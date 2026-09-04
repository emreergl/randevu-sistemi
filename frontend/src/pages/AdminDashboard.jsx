import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSummary } from "../services/reportService";

function AdminDashBoard() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary =async () => {
            try {
                const data = await getSummary();
                setSummary(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    const cards = [
        { label: "Bugünkü Randevu", value: summary?.todayAppointments },
        { label: "Onay Bekleyen", value: summary?.pendingAppointments },
        { label: "Bu Ayki Gelir", value: summary? `${summary.monthlyRevenue} ₺` : null },
        { label: "Toplam Müşteri", value: summary?.totalCustomers },
    ];

    return(
        <div className="max-w-5xl mx-auto px-6 py-10">
            
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-display text-2xl text-ink">Yönetim Paneli</h1>
                <div className="flex gap-3">
                    <Link to="/admin/services" className="text-sm text-brand hover:underline"
                    >
                        Hizmetler
                    </Link>
                    <Link to="/admin/employees" className="text-sm text-brand hover:underline"
                    >
                        Çalışanlar
                    </Link>
                    <Link to="/admin/appointments" className="text-sm text-brand hover:underline"
                    >
                        Randevular
                    </Link>  
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {cards.map((card, i) => (
                    <div
                        key={i}
                        className="bg-surface border border-line rounded-xl p-4"
                    >
                        <div className="text-xs text-ink-soft mb-1.5">
                            {card.label}
                            </div>
                            <div className="text-2xl font-medium text-ink">
                                {loading ? (
                                    <div className="h-7 w-12 bg-line rounded animate-pulse"></div>
                                ) : (
                                    card.value ?? "-"
                                )}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        );
    }   



export default AdminDashBoard;