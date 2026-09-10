import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const navigate = useNavigate();
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-surface border-b border-line px-6 py-4">
            <div className="flex items-center justify-between">
                <Link to="/" className="font-display text-xl text-brand">
                    Kadın Kuaför Çetin
                </Link>

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="sm:hidden text-2xl text-ink"
                >
                    ☰
                </button>

                <div className="hidden sm:flex items-center gap-6 text-sm">
                    <Link to="/prices" className="text-ink-soft hover:text-ink">
                        Fiyatlar
                    </Link>

                    {!isAdmin && (
                        <Link to="/services" className="text-ink-soft hover:text-ink">
                            Randevu Al
                        </Link>
                    )}

                    {isAuthenticated ? (
                        <>
                            {isAdmin && (
                                <Link to="/admin" className="text-ink-soft hover:text-ink">
                                    Yönetim Paneli
                                </Link>
                            )}

                            {!isAdmin && (
                                <Link to="/appointments" className="text-ink-soft hover:text-ink">
                                    Randevularım
                                </Link>
                            )}

                            <Link to="/profile" className="text-ink-soft hover:text-ink">
                                {user.name}
                            </Link>

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
            </div>

            {menuOpen && (
                <div className="sm:hidden flex flex-col gap-3 pt-4 mt-4 border-t border-line text-sm">
                    <Link to="/prices" onClick={() => setMenuOpen(false)} className="text-ink-soft">
                        Fiyatlar
                    </Link>

                    {!isAdmin && (
                        <Link to="/services" onClick={() => setMenuOpen(false)} className="text-ink-soft">
                            Randevu Al
                        </Link>
                    )}

                    {isAuthenticated ? (
                        <>
                            {isAdmin && (
                                <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-ink-soft">
                                    Yönetim Paneli
                                </Link>
                            )}

                            {!isAdmin && (
                                <Link to="/appointments" onClick={() => setMenuOpen(false)} className="text-ink-soft">
                                    Randevularım
                                </Link>
                            )}

                            <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-ink-soft">
                                {user.name}
                            </Link>

                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMenuOpen(false);
                                }}
                                className="text-danger text-left"
                            >
                                Çıkış
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setMenuOpen(false)} className="text-ink-soft">
                                Giriş Yap
                            </Link>
                            <Link to="/register" onClick={() => setMenuOpen(false)} className="text-brand">
                                Kayıt Ol
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;