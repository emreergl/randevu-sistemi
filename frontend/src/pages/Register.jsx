import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import { useState, useEffect } from "react";
import usePageTitle from "../hooks/usePageTitle";

function Register() {
    usePageTitle("Kayıt Ol");

    const navigate = useNavigate();
    const { register, isAuthenticated, isAdmin } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate(isAdmin ? "/admin" : "/");
        }
    }, [isAuthenticated, isAdmin, navigate]);

    const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.password || !form.phone) {
            setError("Bütün bilgileri doldurunuz");
            return;
        }

        setLoading(true);

        try {
            const user = await register(form);
            navigate(user.role === "ADMIN" ? "/admin" : "/");
        } catch (err) {
            setError(err.response?.data?.message || "Kayıt olunamadı");
             } finally {
            setLoading(false);
        }
    };

    return(
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-sm">

                <div className="text-center mb-8">
                    <h1 className="font-display text-4xl text-brand mb-1">KadınKUAFÖR ÇETİN</h1>
                    <p className="text-ink-soft text-sm">Giriş Yapmak İçin Kayıt Olunuz</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-surface border border-line rounded-xl p-6 space-y-4"
                >
                    <Input
                        label="Ad-Soyad"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Adınız ve Syadınız"
                    />

                    <Input
                        label="E-posta"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="ornek@gmail.com"
                    />

                    <Input
                        label="Şifre"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                    />

                    <Input
                        label="Telefon No"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Telefon Numaranız"
                    />

                    {error && (
                        <div className="bg-danger-soft text-danger text-sm rounded-lg pxpx-3.5 py-2.5">
                            {error}
                        </div>
                    )}

                    <Button type="submit" loading={loading}>
                        Kayıt Ol
                    </Button>
                </form>

                <p className="text-center text-sm text-ink-soft mt-6">
                    Hesabınız var mı?{" "}
                    <Link to="/login" className="text-brand hover:underline">
                        Giriş Yapın
                     </Link>
                </p>
             </div>
        </div>
    );
 }

export default Register;