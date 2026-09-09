import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAvailability } from "../services/employeeService";
import { createAppointment } from "../services/appointmentService";
import BackButton from "../components/BackButton";

function BookingTime() {
    const location = useLocation();
    const navigate = useNavigate();

    const { service, employee, date } = location.state || {};

    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    useEffect(() => {
        if (!service || !employee || !date) {
            navigate("/");
            return;
        }

        const fetchAvailability = async () => {
            setLoading(true);
            setSelectedTime(null);

            try {
                const data = await getAvailability(employee.id, date, service.id);
                const filteredSlots = filterPastSlots(data.slots || [], date);
                setSlots(filteredSlots);
                setError(null);
            } catch (err) {
                setError("Müsait saatler yüklenemedi");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailability();
    }, [service, employee, date, navigate]);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr + "T00:00:00");
        return d.toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            weekday: "long"
        });
    };

    const filterPastSlots = (slots, dateStr) => {
        const now = new Date();
        const todayStr = now.toISOString().split("T")[0];

        if (dateStr !== todayStr) {
            return slots;
        }

        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        return slots.filter((slot) => {
            const [h, m] = slot.startTime.split(":").map(Number);
            const slotMinutes = h * 60 + m;
            return slotMinutes > currentMinutes;
        });
    };

    const handleConfirm = async () => {
        setSubmitting(true);
        setSubmitError(null);

        try {
            const startTime = `${date}T${selectedTime.startTime}:00`;

            await createAppointment({
                serviceId: service.id,
                employeeId: employee.id,
                startTime
            });

            navigate("/booking/success", {
                state: { service, employee, date, time: selectedTime }
            });
        } catch (err) {
            setSubmitError(err.response?.data?.message || "Randevu oluşturulamadı");
        } finally {
            setSubmitting(false);
        }
    };

    if (!service || !employee || !date) return null;

    return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            <BackButton />

            <div className="bg-brand rounded-xl px-6 py-5 mb-8 text-white">
                <h1 className="font-medium text-lg">{service.name}</h1>
                <p className="text-sm opacity-85">
                    {employee.name} · {formatDate(date)}
                </p>
            </div>

            <h2 className="text-sm text-ink-soft mb-3">Müsait saatler</h2>

            {loading ? (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-8">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="h-10 bg-line rounded-lg animate-pulse"></div>
                    ))}
                </div>
            ) : error ? (
                <div className="bg-danger-soft text-danger rounded-lg px-4 py-3 mb-8">
                    {error}
                </div>
            ) : slots.length === 0 ? (
                <div className="bg-paper border border-line rounded-lg px-4 py-6 text-center text-ink-soft mb-8">
                    Bu tarihte müsait saat bulunmuyor. Lütfen başka bir tarih seçiniz.
                </div>
            ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-8">
                    {slots.map((slot) => (
                        <button
                            key={slot.startTime}
                            onClick={() => setSelectedTime(slot)}
                            className={`py-2.5 rounded-lg text-sm font-medium border transition-colors
                                ${selectedTime?.startTime === slot.startTime
                                    ? "bg-brand border-brand text-white"
                                    : "border-line hover:border-brand text-ink"}`}
                        >
                            {slot.startTime}
                        </button>
                    ))}
                </div>
            )}

            {selectedTime && (
                <div className="border-t border-line pt-6">
                    <div className="mb-4">
                        <div className="text-sm text-ink-soft">
                            {formatDate(date)}, {selectedTime.startTime} · {employee.name}
                        </div>
                    </div>

                    {submitError && (
                        <div className="bg-danger-soft text-danger rounded-lg px-4 py-3 mb-4 text-sm">
                            {submitError}
                        </div>
                    )}

                    <button
                        onClick={handleConfirm}
                        disabled={submitting}
                        className="w-full bg-brand text-white py-3 rounded-lg font-medium
                        hover:bg-brand-dark transition-colors disabled:opacity-50"
                    >
                        {submitting ? "İşleniyor..." : "Randevuyu Onayla"}
                    </button>
                </div>
            )}

        </div>
    );
}

export default BookingTime;