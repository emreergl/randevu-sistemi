import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getServices } from "../services/serviceService";

function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data.slice(0, 3));
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
        <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          <div>
            <h1 className="font-display text-4xl sm:text-5xl mb-5 leading-tight">
              Kendinize Zaman Ayırın
            </h1>
            <p className="text-white/80 mb-8 max-w-md">
              Uzman ekibimizle saç bakımından cilt bakımına, tüm ihtiyaçlarınız için
              profesyonel hizmet. Randevunuzu birkaç tıkla oluşturun.
            </p>
            <Link
              to="/services"
              className="inline-block bg-white text-brand-dark px-6 py-3 rounded-lg font-medium hover:bg-brand-soft transition-colors mb-6"
            >
              Randevu Al
            </Link>
            <p className="text-sm text-white/70 flex items-center gap-2">
              <span>✂</span> Uzman kadromuzla profesyonel bakım
            </p>
          </div>

          <div className="relative h-72 lg:h-96 rounded-2xl overflow-hidden bg-brand-soft/10">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: "radial-gradient(circle at 30% 40%, #ffffff 1.5px, transparent 1.5px)",
                backgroundSize: "28px 28px"
              }}
            ></div>
          </div>

        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl text-ink mb-2">Öne Çıkan Hizmetlerimiz</h2>
          <p className="text-ink-soft">Size özel bakım deneyimi için hemen randevu alın</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface border border-line rounded-xl p-5 h-40 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-surface border border-line rounded-xl overflow-hidden"
              >
                <div className="h-40 bg-brand-dark flex items-center justify-center">
                  <span className="text-white text-3xl">✂</span>
                </div>
                <div className="p-5">
                  <h3 className="font-medium text-ink">{service.name}</h3>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            to="/services"
            className="inline-block bg-brand text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-dark transition-colors"
          >
            Tüm Hizmetleri Gör
          </Link>
        </div>
      </div>
    </>
  );
}

export default Home;