import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSummary } from "../services/reportService";
import { Bar, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";
import { getOccupancy, getPopularServices } from "../services/reportService";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function AdminDashboard() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [occupancy, setOccupancy] = useState(null);
    const [popularServices, setPopularServices] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const today = new Date().toISOString().split("T")[0];

                const [summaryData, occupancyData, popularData] = await Promise.all([
                    getSummary(),
                    getOccupancy(today),
                    getPopularServices()
                ]);

                setSummary(summaryData);
                setOccupancy(occupancyData);
                setPopularServices(popularData);
            } catch (err) {
            console.error(err);
            } finally {
            setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const cards = [
        { label: "Bugünkü Randevu", value: summary?.todayAppointments },
        { label: "Onay Bekleyen", value: summary?.pendingAppointments },
        { label: "Bu Ayki Gelir", value: summary? `${summary.monthlyRevenue} ₺` : null },
        { label: "Toplam Müşteri", value: summary?.totalCustomers },
    ];

    const occupancyChartData = {
        labels: occupancy?.employees.map((e) => e.employeeName) || [],
        datasets: [
            {
                label: "Doluluk Oranı (%)",
                data: occupancy?.employees.map((e) => e.occupancyRate) || [],
                backgroundColor: "#2d5a4f"
            }
        ]
    };

    const popularServicesChartData = {
        labels: popularServices.map((s) => s.serviceName),
        datasets: [
            {
                data: popularServices.map((s) => s.appointmentCount),
                backgroundColor: ["#2d5a4f", "#4a7c6f", "#6f9b8f", "#94baaf", "#b9d9cf"]
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false }
        }
    };

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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                    <div className="bg-surface border border-line rounded-xl p-5">
                        <h2 className="text-sm font-medium text-ink mb-4">
                            Bugünkü Doluluk Oranı
                        </h2>
                        {loading ? (
                            <div className="h-48 bg-line rounded animate-pulse"></div>
                        ) : occupancy?.employees.length > 0 ? (
                            <Bar data={occupancyChartData} options={chartOptions} />
                        ) : (
                            <p className="text-ink-soft text-sm">Veri Bulunamadı</p>
                        )}
                    </div>

                    <div className="bg-surface border border-line rounded-xl p-5">
                        <h2 className="text-sm font-medium text-ink mb-4">
                            Popüler Hizmetler
                        </h2>
                        {loading ? (
                            <div className="h-48 bg-line rounded animate-pulse"></div>
                        ) : popularServices.length > 0 ? (
                            <Doughnut data={popularServicesChartData} options={chartOptions} />
                        ) : (
                            <p className="text-ink-soft text-sm">Veri bulunamadı</p>
                        )}
                    </div>
                </div>
        </div>
    );
}   

export default AdminDashboard;