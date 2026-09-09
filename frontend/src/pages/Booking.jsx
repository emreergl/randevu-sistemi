import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getEmployees } from "../services/employeeService";
import BackButton from "../components/BackButton";

function Booking() {
    const location = useLocation();
    const navigate = useNavigate();

    const service = location.state?.service;

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        if (!service) {
            navigate("/");
            return;
        }

        const fetchEmployees = async () => {
            try {
                const data = await getEmployees();
                const eligible = data.filter((emp) =>
                    emp.employeeServices?.some((es) => es.serviceId === service.id)
                );
                setEmployees(eligible);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, [service, navigate]);

    const handleSelectDate = (date) => {
        setSelectedDate(date);
        setSelectedEmployee(null);
    };

    const getNextDays = () => {
        const days = [];
        const today = new Date();

        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            days.push(date);
        }

        return days;
    };

    const formatDayLabel = (date) => {
        const dayNames = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
        return dayNames[date.getDay()];
    };

    const toDateKey = (date) => {
        return date.toISOString().split("T")[0];
    };

    const getDayOfWeek = (date) => {
        const jsDay = date.getDay();
        return jsDay === 0 ? 7 : jsDay;
    };

    const availableEmployees = selectedDate
        ? employees.filter((emp) =>
            emp.workingHours?.some((wh) => wh.dayOfWeek === getDayOfWeek(selectedDate))
            )
        : []; 

    const handleContinue = () => {
        navigate("/booking/time", {
            state: {
                service,
                employee: selectedEmployee,
                date: toDateKey(selectedDate)
            }
        });
    };

    if (!service) return null;

    return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            <BackButton />

            <div className="bg-brand rounded-xl px-6 py-5 mb-8 text-white">
                <h1 className="font-medium text-lg">{service.name}</h1>
                <p className="text-sm opacity-85">{service.duration} dakika</p>
            </div>

            {loading ? (
                <p className="text-ink-soft">Yükleniyor...</p>
            ) : (
                <>
                    <h2 className="text-sm text-ink-soft mb-3">Tarih seçin</h2>

                    <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
                        {getNextDays().map((date) => {
                            const isSelected = selectedDate && toDateKey(selectedDate) === toDateKey(date);

                            return (
                                <button
                                    key={toDateKey(date)}
                                    onClick={() => handleSelectDate(date)}
                                    className={`flex-shrink-0 w-16 py-3 rounded-xl border text-center transition-colors
                                        ${isSelected
                                            ? "bg-brand border-brand text-white"
                                            : "border-line hover:border-brand text-ink"}`}
                                >
                                    <div className="text-xs opacity-80">{formatDayLabel(date)}</div>
                                    <div className="font-medium">{date.getDate()}</div>
                                </button>
                            );
                        })}
                    </div>

                    {selectedDate && (
                        <>
                            <h2 className="text-sm text-ink-soft mb-3">Çalışan seçiniz</h2>

                            {availableEmployees.length === 0 ? (
                                <div className="bg-paper border border-line rounded-lg px-4 py-6 text-center text-ink-soft mb-8">
                                    Bu tarihte müsait çalışan bulunmuyor. Lütfen başka bir tarih seçiniz.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                                    {availableEmployees.map((emp) => (
                                        <button
                                            key={emp.id}
                                            onClick={() => setSelectedEmployee(emp)}
                                            className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-colors
                                                ${selectedEmployee?.id === emp.id
                                                    ? "border-2 border-brand"
                                                    : "border border-line hover:border-brand"}`}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-brand-soft text-brand
                                                flex items-center justify-center text-sm font-medium flex-shrink-0">
                                                {emp.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-ink">{emp.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            {selectedEmployee && (
                <button
                    onClick={handleContinue}
                    className="w-full bg-brand text-white py-3 rounded-lg font-medium hover:bg-brand-dark transition-colors"
                >
                    Devam et
                </button>
            )}

        </div>
    );
}

export default Booking;