import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getServices } from "../services/serviceService";
import usePageTitle from "../hooks/usePageTitle";

const serviceImages = {
  "Saç Kesimi": "https://images.unsplash.com/photo-1700760934268-8aa0ef52ce0a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGFpcmN1dCUyMHdvbWVufGVufDB8fDB8fHww",
  "Fön": "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&q=80&fit=crop",
  "Saç Boyama": "https://thumbs.dreamstime.com/b/hairdresser-applying-color-female-customer-salon-doing-hair-dye-professional-to-design-women-having-her-dyed-36422960.jpg",
  "Röfle": "https://images.unsplash.com/photo-1707979577466-2d6109c68a45?w=400&q=80&fit=crop",
  "Keratin Bakımı": "https://images.unsplash.com/photo-1605980625600-88b46abafa8d?w=400&q=80&fit=crop",
  "Manikür": "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&q=80&fit=crop",
  "Pedikür": "https://images.unsplash.com/photo-1707725238063-0c54fb6963d1?w=400&q=80&fit=crop",
  "Kaş Alımı": "https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?w=400&q=80&fit=crop",
  "Cilt Bakımı": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80&fit=crop",
  "Saç Düzleştirme": "https://media.istockphoto.com/id/452697595/photo/hair-straighteners.webp?a=1&b=1&s=612x612&w=0&k=20&c=VyWosVmgw_GBPeGQn1NC6kBYQuf23pjvj9iAIqHu-LA="
};
const defaultImage = "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80&fit=crop";

function Home() {
  usePageTitle("Ana Sayfa");

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

          <div className="relative h-72 lg:h-96 rounded-2xl overflow-hidden">
            <img
              src="https://st2.depositphotos.com/2885805/7084/v/450/depositphotos_70841815-stock-illustration-beauty-salon-concept.jpg"
              alt="Salon"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl text-ink mb-2">Öne Çıkan Hizmetlerimiz</h2>
          <p className="text-ink-soft">Size özel bakım deneyimi için hemen randevu alın</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-surface border border-line rounded-xl overflow-hidden animate-pulse">
                <div className="h-40 bg-line"></div>
                <div className="p-5">
                  <div className="h-4 bg-line rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-surface border border-line rounded-xl overflow-hidden"
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={serviceImages[service.name] || defaultImage}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-medium text-lg text-ink mb-1">{service.name}</h3>
                  <p className="text-ink-soft text-sm">{service.duration} dakika</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Home;