import { useState, useEffect } from "react";
import { getServices } from "../services/serviceService";

function Prices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <>
      <div className="bg-brand-dark text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <h1 className="font-display text-4xl mb-3">Fiyat Listesi</h1>
          <p className="text-white/80 max-w-xl mx-auto">
            Tüm hizmetlerimize ait güncel fiyatlarımızı aşağıda bulabilirsiniz
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-line rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="bg-surface border border-line rounded-xl overflow-hidden">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`flex items-center justify-between px-6 py-4 ${
                  index !== services.length - 1 ? "border-b border-line" : ""
                }`}
              >
                <div>
                  <div className="font-medium text-ink">{service.name}</div>
                  <div className="text-sm text-ink-soft">{service.duration} dakika</div>
                </div>
                <span className="text-brand font-medium text-lg">{service.price} ₺</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Prices;