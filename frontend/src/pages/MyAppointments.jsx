import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAppointments, cancelAppointment } from "../services/appointmentService";

const statusConfig = {
  PENDING: { label: "Beklemede", bg: "bg-warn-soft", text: "text-warn" },
  CONFIRMED: { label: "Onaylandı", bg: "bg-brand-soft", text: "text-brand" },
  CANCELLED: { label: "İptal Edildi", bg: "bg-paper", text: "text-ink-faint" },
  COMPLETED: { label: "Tamamlandı", bg: "bg-ok-bg", text: "text-ok-tx" },
  NO_SHOW: { label: "Gelmedi", bg: "bg-danger-soft", text: "text-danger" }
};

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("upcoming");
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelError, setCancelError] = useState("");

  const fetchAppointments = async () => {
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const now = new Date();

  const upcoming = appointments.filter(
    (apt) => new Date(apt.startTime) >= now && apt.status !== "CANCELLED"
  );
  const past = appointments.filter(
    (apt) => new Date(apt.startTime) < now || apt.status === "CANCELLED"
  );

  const visible = tab === "upcoming" ? upcoming : past;

  const formatDateTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleCancel = async (id) => {
    const confirmed = window.confirm("Randevuyu iptal etmek istediğinizden emin misiniz?");

    if (!confirmed) return;

    setCancellingId(id);
    setCancelError("");

    try {
      await cancelAppointment(id);
      await fetchAppointments();
    } catch (err) {
      setCancelError(err.response?.data?.message || "Randevu iptal edilemedi");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-line rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Randevularım</h1>
        <Link
          to="/services" className="bg-brand text-white text-sm px-4 py-2 rounded-lg hover:bg-brand-dark"
        >
          + Yeni Randevu Al
        </Link>
      </div>

      <div className="flex gap-1 mb-6 border-b border-line">
        <button
          onClick={() => setTab("upcoming")}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors
            ${tab === "upcoming"
              ? "border-brand text-brand"
              : "border-transparent text-ink-soft hover:text-ink"}`}
        >
          Yaklaşanlar
        </button>
        <button
          onClick={() => setTab("past")}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors
            ${tab === "past"
              ? "border-brand text-brand"
              : "border-transparent text-ink-soft hover:text-ink"}`}
        >
          Geçmiş
        </button>
      </div>

      {cancelError && (
        <div className="bg-danger-soft text-danger rounded-lg px-4 py-3 mb-4 text-sm">
          {cancelError}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-ink-soft mb-4">
            {tab === "upcoming"
              ? "Yaklaşan randevunuz bulunmamaktadır."
              : "Geçmiş randevunuz bulunmamaktadır."}
          </p>
          {tab === "upcoming" && (
            <Link to="/services" className="text-brand hover:underline text-sm">
              Hizmetlere göz atın
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((apt) => {
            const status = statusConfig[apt.status] || statusConfig.PENDING;
            const canCancel = tab === "upcoming" && apt.status !== "CANCELLED";

            return (
              <div
                key={apt.id}
                className="bg-surface border border-line rounded-xl p-5"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-ink">
                      {formatDateTime(apt.startTime)}
                    </div>
                    <div className="text-sm text-ink-soft mt-0.5">
                      {apt.service.name} · {apt.employee.name}
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${status.bg} ${status.text}`}>
                    {status.label}
                  </span>
                </div>

                {canCancel && (
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => handleCancel(apt.id)}
                      disabled={cancellingId === apt.id}
                      className="text-sm text-danger hover:underline disabled:opacity-50"
                    >
                      {cancellingId === apt.id ? "İptal ediliyor..." : "İptal Et"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default MyAppointments;