import { useState, useEffect } from "react";
import { getServices } from "../services/serviceService";

function Home() {
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

    if (loading) {
        return <div className="p-8 text-slate-500">Yükleniyor...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-600">{error}</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-semibold mb-6">Hizmetlerimiz</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                    <div
                    key={service.id}
                    className="bg-white border border-slate-200 rounded-lg p-5"
                    >
                        <h2 className="font-medium text-lg">{service.name}</h2>
                        <p className="text-slate-500 text-sm mt-1">
                            {service.duration} dakika
                        </p>
                        <p className="text-slate-800 font-medium mt-3">
                            {service.price} ₺
                        </p>                        
            </div>
                ))}
        </div>
        </div>
    );
}
export default Home;