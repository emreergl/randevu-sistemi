import { useState, useEffect } from "react";
import {
    getAppointments,
    updateAppointmentStatus
} from "../services/appointmentService";
import { getEmployees } from "../services/employeeService";
import BackButton from "../components/BackButton";

const statusOptions = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"];

const statusLabels = {
    PENDING: "Beklemede",
    CONFIRMED: "Onaylandı",
    COMPLETED: "Tamamlandı",
    CANCELLED: "İptal Edildi",
    NO_SHOW: "Gelmedi"
};

const statusColors = {
    PENDING: "bg-warn-soft text-warn",
    CONFIRMED: "bg-brand-soft text-brand",
    COMPLETED: "bg-ok-bg text-ok-tx",
    CANCELLED: "bg-paper text-ink-faint",
    NO_SHOW: "bg-danger-soft text-danger"
};

function AdminAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const [filters, setFilters] = useState({
        date: "",
        employeeId: "",
        status: ""
    });

    const fetchAppointments = async () => {
        setLoading(true);

        const activeFilters = Object.fromEntries(
            Object.entries(filters).filter(([, value]) => value !== "")
        );

        try {
            const data = await getAppointments(activeFilters);
            setAppointments(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await getEmployees();
                setEmployees(data);
            }   catch (err) {
                console.error(err);
            } 
        };
        fetchEmployees();        
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const clearFilters = () => {
        setFilters({ date: "", employeeId: "", status: "" });
    };

    const handleStatusChange = async (id, newStatus) => {
        setUpdatingId(id);

        try {
            await updateAppointmentStatus(id, newStatus);
            await fetchAppointments();
        }   catch (err) {
            alert(err.response?.data?.message || "Durum güncellenemedi");
        }   finally {
            setUpdatingId(null);
        } 
    };

    const formatDateTime = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <BackButton />

            <h1 className="font-display text-2xl text-ink mb-6">Randevular</h1>

            <div className="bg-surface border border-line rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-end">
                <div>
                    <label className="block text-xs text-ink-soft mb-1">Tarih</label>
                    <input
                        type="date"
                        name="date"
                        value={filters.date}
                        onChange={handleFilterChange}
                        className="border border-line rounded-lg px-3 py-1.5 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-xs text-ink-soft mb-1">Çalışan</label>
                    <select
                        name="employeeId"
                        value={filters.employeeId}
                        onChange={handleFilterChange}
                        className="border border-line rounded-lg px-3 py-1.5 text-sm"
                    >
                        <option value="">Tümü</option>
                        {employees.map((emp) => (
                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs text-ink-soft mb-1">Durum</label>
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="border border-line rounded-lg px-3 py-1.5 text-sm"
                    >
                        <option value="">Tümü</option>
                        {statusOptions.map((s) => (
                            <option key={s} value={s}>{statusLabels[s]}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={clearFilters}
                    className="text-sm text-ink-soft hover:text-ink"
                >
                    Filtreleri Temizle
                </button>
            </div>

            {loading ? (
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-14 bg-line rounded-lg animate-pulse"></div>
                    ))}
                </div>
            ) : appointments.length === 0 ? (
                <div className="text-center py-16 text-ink-soft">
                    Filtrelere uygun randevu bulunamadı.
                </div>
            ) : (
                <div className="bg-surface border border-line rounded-xl overflow-x-auto">
                    <table className="w-full text-sm min-w-[600px]">
                        <thead>
                            <tr className="border-b border-line text-left text-ink-soft">
                                <th className="px-4 py-3 font-medium">Tarih/Saat</th>
                                <th className="px-4 py-3 font-medium">Müşteri</th>
                                <th className="px-4 py-3 font-medium">Hizmet</th>
                                <th className="px-4 py-3 font-medium">Çalışan</th>
                                <th className="px-4 py-3 font-medium">Durum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((apt) => (
                                <tr key={apt.id} className="border-b border-line last:border-0">
                                    <td className="px-4 py-3 text-ink">
                                        {formatDateTime(apt.startTime)}
                                    </td>
                                    <td className="px-4 py-3 text-ink">
                                        {apt.customer?.name}
                                    </td>
                                    <td className="px-4 py-3 text-ink-soft">
                                        {apt.service?.name}
                                    </td>
                                    <td className="px-4 py-3 text-ink-soft">
                                        {apt.employee?.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={apt.status}
                                            onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                                            disabled={updatingId === apt.id}
                                            className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer ${statusColors[apt.status]}`}
                                        >
                                            {statusOptions.map((s) => (
                                                <option key={s} value={s}>{statusLabels[s]}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminAppointments;
