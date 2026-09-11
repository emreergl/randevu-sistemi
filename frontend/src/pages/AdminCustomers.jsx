import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllCustomers } from "../services/authService";
import usePageTitle from "../hooks/usePageTitle";

function AdminCustomers() {
    usePageTitle("Müşteriler");

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const data = await getAllCustomers();
                setCustomers(data);
            }   catch (err) {
                setError(err.response?.data?.message || "Müşteriler yüklenemedi");
            }   finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">

            <div className="flex items-center justify-between mb-8">
                <h1 className="font-display text-2xl text-ink">Müşteriler</h1>
                <Link to="/admin" className="text-sm text-brand hover:underline">
                     ← Panele Dön
                </Link>
            </div>

            {error && (
                <div className="bg-danger-soft text-danger rounded-lg px-4 py-3 mb-6">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-14 bg-line rounded-lg animate-pulse"></div>
                    ))}
                </div>
            ) : customers.length === 0 ? (
                <div className="text-center py-16 text-ink-soft">
                    <div className="text-4xl mb-3">👥</div>
                    <p>Henüz kayıtlı müşteri bulunmuyor.</p>
                </div>
            ) : (
                <div className="bg-surface border border-line rounded-lg overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-line text-left text-ink-soft">
                                <th className="px-4 py-3 font-medium">Ad Soyad</th>
                                <th className="px-4 py-3 font-medium">E-posta</th>
                                <th className="px-4 py-3 font-medium">Telefon</th>
                                <th className="px-4 py-3 font-medium">Kayıt tarihi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => (
                                <tr key={customer.id} className="border-b border-line last:border-0">
                                    <td className="px-4 py-3 text-ink">{customer.name}</td>
                                    <td className="px-4 py-3 text-ink">{customer.email}</td>
                                    <td className="px-4 py-3 text-ink">{customer.phone || "-"}</td>
                                    <td className="px-4 py-3 text-ink">{formatDate(customer.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminCustomers;