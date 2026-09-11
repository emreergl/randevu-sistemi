import { useState, useEffect } from "react";
import { getServices, createService, updateService, deleteService } from "../services/serviceService";
import BackButton from "../components/BackButton";
import Input from "../components/Input";
import Button from "../components/Button";
import usePageTitle from "../hooks/usePageTitle";

function AdminServices() {
    usePageTitle("Hizmet Yönetimi");

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: "", price: "", duration: ""});
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

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

    useEffect(() => {
        fetchServices();
    }, []);

    const openCreateForm = () => {
        setEditingId(null);
        setForm({ name: "", price: "", duration: "" });
        setFormError("");
        setShowForm(true);
    };

    const openEditForm = (service) => {
        setEditingId(service.id);
        setForm({ name: service.name, price: service.price, duration: service.duration });
        setFormError("");
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFormError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || !form.price || !form.duration) {
            setFormError("Tüm alanlar zorunludur");
            return;
        }

        setSubmitting(true);
        setFormError("");

        const payload = { name: form.name, price: Number(form.price), duration: Number(form.duration) };

        try {
            if (editingId) {
                await updateService(editingId, payload);
            }   else {
                await createService(payload);
            }
            await fetchServices();
            closeForm();
        } catch (err) {
            setFormError(err.response?.data?.message || "İşlem başarısız");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Bu hizmeti silmek istediğinizden emin misiniz?");
        if (!confirmed) return;

        try {
            await deleteService(id);
            await fetchServices();
        } catch (err) {
            alert(err.response?.data?.message || "Hizmet silinemedi");
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            <BackButton />

            <div className="flex items-center justify-between mb-8">
                <h1 className="font-display text-2xl text-ink">Hizmetler</h1>
                <button
                    onClick={openCreateForm}
                    className="bg-brand text-white text-sm px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
                >
                    + Yeni Hizmet
                </button>
            </div>

            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-surface border border-line rounded-xl p-6 space-y-4 mb-6"
                >
                    <h2 className="font-medium text-ink">
                        {editingId ? "Hizmeti Düzenle" : "Yeni Hizmet Ekle"}
                    </h2>

                    <Input
                        label="Hizmet Adı"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Fiyat (₺)"
                            name="price"
                            type="number"
                            value={form.price}
                            onChange={handleChange}
                        />
                        <Input
                            label="Süre (dakika)"
                            name="duration"
                            type="number"
                            value={form.duration}
                            onChange={handleChange}
                        />
                    </div>

                    {formError && (
                        <div className="bg-danger-soft text-danger text-sm rounded-lg px-3.5 py-2.5">
                            {formError}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <Button type="submit" loading={submitting}>
                            {editingId ? "Güncelle" : "Ekle"}
                        </Button>
                        <Button type="button" variant="secondary" onClick={closeForm}>
                            İptal
                        </Button>
                    </div>
                </form>
            )}

            {loading ? (
                <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-line rounded-xl animate-pulse"></div>
                ))}
            </div>

    ) : services.length === 0 ? (
        <div className="text-center py-16">
            <div className="text-4xl mb-3">✂️</div>
            <p className="text-ink-soft">Henüz hizmet eklenmemiş</p>
        </div>
    
    ) : (
        <div className="space-y-3">
            {services.map((service) => (
                <div 
                    key={service.id}
                    className="bg-surface border border-line rounded-xl p-4 flex items-center justify-between"
                >
                    <div>
                        <div className="font-medium text-ink">{service.name}</div>
                        <div className="text-sm text-ink-soft">
                            {service.duration} dakika · {service.price} ₺   
                        </div>    
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => openEditForm(service)}
                            className="text-sm text-brand hover:underline transition-colors"
                        >
                            Düzenle
                        </button> 
                        <button
                            onClick={() => handleDelete(service.id)}
                            className="text-sm text-danger hover:underline transition-colors"
                    >
                        Sil
                    </button>
                </div>
            </div>
        ))}
    </div>  
    )}
</div>
);
}

export default AdminServices;