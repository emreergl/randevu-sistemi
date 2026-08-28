import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const navigate = useNavigate();
    const { user, isAuthenticated, isAdmin, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-surface border-b border-line px-6 py-4 flex items-center justify-between">
            <Link to="/" className="font-display text-xl text-brand">
                Bayan Kuaför Çetin
            </Link>

            <div className="flex items-center gap-6 text-sm">
                {isAuthenticated ? (
                    <>
                        {isAdmin && (
                            <Link to="/admin" className="text-ink-soft hover:text-ink">
                                Yönetim Paneli
                            </Link>
                        )}
                        
                        <Link to="/appointments" className="text-ink-soft hover:text-ink">
                            Randevularım
                        </Link>

                        <span className="text-ink-soft">
                            {user.name}
                        </span>

                        <button
                            onClick={handleLogout}
                            className="text-danger hover:underline"
                        >
                            Çıkış
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-ink-soft hover:text-ink">
                            Giriş Yap
                        </Link>
                        <Link to="/register" className="text-brand hover:underline">
                            Kayıt Ol
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;