import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getServices } from "../services/serviceService";

function Home() {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await getServices();
                setServices(data);
            } catch (err) {
                setError("Hizmetler yüklenemedi");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const handleSelect = (service) => {
        navigate("/booking", { state: { service } });
    };
    
    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6,].map((i) => (
                        <div key={i} className="bg-surface border border-line rounded-xl p-5 h-32 animate-pulse">
                            <div className="h-4 bg-line rounded w-2/3 mb-3"></div>
                            <div className="h-3 bg-line rounded w-1/3"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="bg-danger-soft text-danger rounded-lg px-4 py-3">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="mb-8">
                <h1 className="font-display text-3xl text-ink mb-2">Hizmetlerimiz</h1>
                <p className="text-ink-soft">Bir hizmet seçerek randevu alabilirsiniz</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                    <button
                        key={service.id}
                        onClick={() => handleSelect(service)}
                        className="text-left bg-surface border border-line rounded-xl p-5 hover:border-brand hover:shadow-sm transition-all"
                    >
                        <h2 className="font-medium text-lg text-ink mb-1">{service.name}</h2>
                        <p className="text-ink-soft text-sm mb-4">{service.duration} dakika</p>
                        <div className="flex items-center justify-between">
                            <span className="text-brand font-medium">{service.price} ₺</span>
                            <span className="text-sm text-ink-faint">Randevu al →</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
export default Home;