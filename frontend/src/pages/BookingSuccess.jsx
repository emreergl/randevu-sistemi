import { useLocation, useNavigate, Link } from "react-router-dom";

function BookingSuccess() {
    const location = useLocation();
    const navigate = useNavigate();

    const { service, employee, date, time } = location.state || {};

    if (!service) {
        navigate("/");
        return null;
    }

    const formatDate = (dateStr) => {
        const d = new Date(dateStr + "T00:00:00");
        return d.toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    return (
        <div className="max-w-md mx-auto px-6 py-16 text-center">

            <div className="w-14 h-14 rounded-full bg-brand-soft text-brand
            flex items-center justify-center text-2xl mx-auto mb-5">
                ✓
            </div>

            <h1 className="font-display text-2xl text-ink mb-2">
                Randevunuz Oluşturuldu
            </h1>
            <p className="text-ink-soft text-sm mb-8">
                Onaylandığında e-posta ile bilgilendirileceksiniz.
            </p>

            <div className="bg-surface border border-line rounded-xl overflow-hidden text-left mb-8">
                <div className="flex justify-between px-5 py-3 border-b border-line">
                    <span className="text-ink-soft text-sm">Hizmet</span>
                    <span className="text-ink text-sm font-medium">{service.name}</span>
                </div>
                <div className="flex justify-between px-5 py-3 border-b border-line">
                    <span className="text-ink-soft text-sm">Çalışan</span>
                    <span className="text-ink text-sm font-medium">{employee.name}</span>
                </div>
                <div className="flex justify-between px-5 py-3 border-b border-line">
                    <span className="text-ink-soft text-sm">Tarih</span>
                    <span className="text-ink text-sm font-medium">{formatDate(date)}</span>
                </div>
                <div className="flex justify-between px-5 py-3">
                    <span className="text-ink-soft text-sm">Saat</span>
                    <span className="text-ink text-sm font-medium">{time.startTime}</span>
                </div>
            </div>

            <Link
            to="/appointments"
            className="block w-full bg-brand text-white py-3 rounded-lg font-medium
            hover:bg-brand-dark transition-colors"
            >
                Randevularımı Görüntüle
            </Link>

        </div>
    );
}

export default BookingSuccess;