import { useState, useEffect } from "react";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getWorkingHours,
  setWorkingHours
} from "../services/employeeService";
import { getServices } from "../services/serviceService";
import BackButton from "../components/BackButton";
import Input from "../components/Input";
import Button from "../components/Button";

function AdminEmployees() {
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", serviceIds: [] });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [hoursEmployee, setHoursEmployee] = useState(null);
  const [hoursForm, setHoursForm] = useState({});
  const [hoursLoading, setHoursLoading] = useState(false);
  const [hoursSubmitting, setHoursSubmitting] = useState(false);
  const [hoursError, setHoursError] = useState("");

  const dayNames = {
    1: "Pazartesi",
    2: "Salı",
    3: "Çarşamba",
    4: "Perşembe",
    5: "Cuma",
    6: "Cumartesi",
    7: "Pazar"
  };

  const fetchData = async () => {
    try {
      const [employeeData, serviceData] = await Promise.all([
        getEmployees(),
        getServices()
      ]);
      setEmployees(employeeData);
      setServices(serviceData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateForm = () => {
    setEditingId(null);
    setForm({ name: "", phone: "", serviceIds: [] });
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (employee) => {
    setEditingId(employee.id);
    setForm({
      name: employee.name,
      phone: employee.phone || "",
      serviceIds: employee.employeeServices?.map((es) => es.serviceId) || []
    });
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError("");
  };

  const toggleService = (serviceId) => {
    setForm((prev) => {
      const has = prev.serviceIds.includes(serviceId);
      return {
        ...prev,
        serviceIds: has
          ? prev.serviceIds.filter((id) => id !== serviceId)
          : [...prev.serviceIds, serviceId]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name) {
      setFormError("Çalışan adı zorunludur");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      if (editingId) {
        await updateEmployee(editingId, {
          name: form.name,
          phone: form.phone,
          serviceIds: form.serviceIds
        });
      } else {
        await createEmployee(form);
      }
      await fetchData();
      closeForm();
    } catch (err) {
      setFormError(err.response?.data?.message || "İşlem başarısız");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Bu çalışanı silmek istediğinize emin misiniz?");
    if (!confirmed) return;

    try {
      await deleteEmployee(id);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Çalışan silinemedi");
    }
  };

  const openHoursPanel = async (employee) => {
    setHoursEmployee(employee);
    setHoursError("");
    setHoursLoading(true);

    const defaultForm = {};
    for (let day = 1; day <= 7; day++) {
      defaultForm[day] = { enabled: false, startTime: "09:00", endTime: "18:00" };
    }

    try {
      const existing = await getWorkingHours(employee.id);
      existing.forEach((wh) => {
        defaultForm[wh.dayOfWeek] = {
          enabled: true,
          startTime: wh.startTime,
          endTime: wh.endTime
        };
      });
      setHoursForm(defaultForm);
    } catch (err) {
      console.error(err);
      setHoursForm(defaultForm);
    } finally {
      setHoursLoading(false);
    }
  };

  const closeHoursPanel = () => {
    setHoursEmployee(null);
    setHoursForm({});
    setHoursError("");
  };

  const toggleDay = (day) => {
    setHoursForm((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled }
    }));
  };

  const handleHoursTimeChange = (day, field, value) => {
    setHoursForm((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const handleHoursSubmit = async (e) => {
    e.preventDefault();
    setHoursSubmitting(true);
    setHoursError("");

    const workingHours = Object.entries(hoursForm)
      .filter(([, value]) => value.enabled)
      .map(([day, value]) => ({
        dayOfWeek: Number(day),
        startTime: value.startTime,
        endTime: value.endTime
      }));

    try {
      await setWorkingHours(hoursEmployee.id, workingHours);
      closeHoursPanel();
    } catch (err) {
      setHoursError(err.response?.data?.message || "Çalışma saatleri kaydedilemedi");
    } finally {
      setHoursSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <BackButton />

      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl text-ink">Çalışanlar</h1>
        <button
          onClick={openCreateForm}
          className="bg-brand text-white text-sm px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
        >
          + Yeni Çalışan
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-line rounded-xl p-6 space-y-4 mb-6"
        >
          <h2 className="font-medium text-ink">
            {editingId ? "Çalışanı Düzenle" : "Yeni Çalışan Ekle"}
          </h2>

          <Input
            label="Ad Soyad"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <Input
            label="Telefon"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm text-ink-soft mb-2">
              Verdiği Hizmetler
            </label>
            <div className="grid grid-cols-2 gap-2">
              {services.map((service) => (
                <label
                  key={service.id}
                  className="flex items-center gap-2 text-sm text-ink cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form.serviceIds.includes(service.id)}
                    onChange={() => toggleService(service.id)}
                    className="rounded border-line"
                  />
                  {service.name}
                </label>
              ))}
            </div>
          </div>

          {formError && (
            <div className="bg-danger-soft text-danger text-sm rounded-lg px-3.5 py-2.5">
              {formError}
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" loading={submitting}>
              {editingId ? "Güncelle" : "Ekle"}
            </Button>
            <Button type="button" variant="secondary" onClick={closeForm}>
              İptal
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-line rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="bg-surface border border-line rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-ink">{emp.name}</div>
                <div className="flex gap-3">
                  <button
                    onClick={() => openHoursPanel(emp)}
                    className="text-sm text-brand hover:underline"
                  >
                    Mesai
                  </button>
                  <button
                    onClick={() => openEditForm(emp)}
                    className="text-sm text-brand hover:underline"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(emp.id)}
                    className="text-sm text-danger hover:underline"
                  >
                    Sil
                  </button>
                </div>
              </div>
              <div className="text-sm text-ink-soft">
                {emp.phone && <span>{emp.phone} · </span>}
                {emp.employeeServices?.length > 0
                  ? emp.employeeServices
                      .map((es) => services.find((s) => s.id === es.serviceId)?.name)
                      .filter(Boolean)
                      .join(", ")
                  : "Hizmet atanmamış"}
              </div>
            </div>
          ))}
        </div>
      )}

      {hoursEmployee && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">

            <h2 className="font-medium text-ink mb-4">
              {hoursEmployee.name} — Çalışma Saatleri
            </h2>

            {hoursLoading ? (
              <p className="text-ink-soft text-sm">Yükleniyor...</p>
            ) : (
              <form onSubmit={handleHoursSubmit} className="space-y-3">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div key={day} className="flex items-center gap-3">
                    <label className="flex items-center gap-2 w-28 flex-shrink-0 text-sm text-ink">
                      <input
                        type="checkbox"
                        checked={hoursForm[day]?.enabled || false}
                        onChange={() => toggleDay(day)}
                        className="rounded border-line"
                      />
                      {dayNames[day]}
                    </label>

                    {hoursForm[day]?.enabled && (
                      <>
                        <input
                          type="time"
                          value={hoursForm[day]?.startTime || "09:00"}
                          onChange={(e) => handleHoursTimeChange(day, "startTime", e.target.value)}
                          className="border border-line rounded-lg px-2 py-1 text-sm"
                        />
                        <span className="text-ink-soft text-sm">-</span>
                        <input
                          type="time"
                          value={hoursForm[day]?.endTime || "18:00"}
                          onChange={(e) => handleHoursTimeChange(day, "endTime", e.target.value)}
                          className="border border-line rounded-lg px-2 py-1 text-sm"
                        />
                      </>
                    )}
                  </div>
                ))}

                {hoursError && (
                  <div className="bg-danger-soft text-danger text-sm rounded-lg px-3.5 py-2.5">
                    {hoursError}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button type="submit" loading={hoursSubmitting}>
                    Kaydet
                  </Button>
                  <Button type="button" variant="secondary" onClick={closeHoursPanel}>
                    İptal
                  </Button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default AdminEmployees;