import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getServices } from "../services/serviceService";

const serviceImages = {
  "Saç Kesimi": "https://images.unsplash.com/photo-1700760934268-8aa0ef52ce0a?w=500&auto=format&fit=crop&q=60",
  "Fön": "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&q=80&fit=crop",
  "Saç Boyama": "https://images.unsplash.com/photo-1605980766335-d3a41c7332a1?w=400&q=80&fit=crop",
  "Röfle": "https://images.unsplash.com/photo-1707979577466-2d6109c68a45?w=400&q=80&fit=crop",
  "Keratin Bakımı": "https://images.unsplash.com/photo-1605980625600-88b46abafa8d?w=400&q=80&fit=crop"
};

const defaultImage = "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80&fit=crop";

function Services() {
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

  return (
    <>
      <div className="bg-brand-dark text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <h1 className="font-display text-4xl mb-3">Hizmetlerimiz</h1>
          <p className="text-white/80 max-w-xl mx-auto">
            Bir hizmet seçerek randevu alma sürecine başlayabilirsiniz
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {error && (
          <div className="bg-danger-soft text-danger rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-surface border border-line rounded-xl overflow-hidden animate-pulse">
                <div className="h-40 bg-line"></div>
                <div className="p-5">
                  <div className="h-4 bg-line rounded w-2/3 mb-3"></div>
                  <div className="h-3 bg-line rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleSelect(service)}
                className="text-left bg-surface border border-line rounded-xl overflow-hidden
                  hover:border-brand hover:shadow-md transition-all"
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={serviceImages[service.name] || defaultImage}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h2 className="font-medium text-lg text-ink mb-3">{service.name}</h2>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-soft text-sm">{service.duration} dakika</span>
                    <span className="text-sm text-brand font-medium">Randevu al →</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Services;