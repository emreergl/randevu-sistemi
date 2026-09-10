import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import { useState, useEffect } from "react";
import usePageTitle from "../hooks/usePageTitle";

function Login() {
    usePageTitle("Giriş Yap");

    const navigate = useNavigate();
    const { login, isAuthenticated, isAdmin } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate(isAdmin ? "/admin" : "/");
        }
    }, [isAuthenticated, isAdmin, navigate]);

    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email || !form.password) {
            setError("E-posta ve şifre gereklidir");
            return;
        }

        setLoading(true);

        try {
            const user = await login(form.email, form.password);
            navigate(user.role === "ADMIN" ? "/admin" : "/");
        } catch (err) {
            setError(err.response?.data?.message || "Giriş yapılamadı");
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-sm">

                <div className="text-center mb-8">
                    <h1 className="font-display text-3xl text-brand mb-1">KADIN KUAFÖR ÇETİN </h1>
                    <p className="text-ink-soft text-sm">Randevu sistemine hoşgeldiniz</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-surface border border-line rounded-xl p-6 space-y-4"
                >
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

                    {error && (
                        <div className="bg-danger-soft text-danger text-sm rounded-lg px-3.5 py-2.5">
                            {error}
                        </div>
                    )}

                    <Button type="submit" loading={loading}>
                        Giriş Yap
                    </Button>
                </form>

                <p className="text-center text-sm text-ink-soft mt-6">
                    Hesabınız yok mu?{" "}
                    <Link to="/register" className="text-brand hover:underline">
                        Kayıt Olun
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;