import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile, changePassword } from "../services/authService";
import Input from "../components/Input";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import usePageTitle from "../hooks/usePageTitle";

function Profile() {
    usePageTitle("Profilim");

    const { user, updateUser } = useAuth();

    const [profileForm, setProfileForm] = useState({
        name: user?.name || "",
        phone: user?.phone || ""
    });
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileMessage, setProfileMessage] = useState("");
    const [profileError, setProfileError] = useState("");

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        if (user) {
            setProfileForm({
                name: user.name || "",
                phone: user.phone || ""
            });
        }
    }, [user]);

    const handleProfileChange = (e) => {
        setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
        setProfileMessage("");
        setProfileError("");
    };

    const handlePasswordChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
        setPasswordMessage("");
        setPasswordError("");
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        const phonePattern = /^0[0-9]{10}$/;

        if (profileForm.phone && !phonePattern.test(profileForm.phone)) {
            setProfileError("Telefon numarası 0 ile başlayan 11 haneli olmalıdır.");
            return;
        }

        setProfileLoading(true);
        setProfileMessage("");
        setProfileError("");

        try {
            const updated = await updateProfile(profileForm);
            updateUser(updated);
            setProfileMessage("Profil bilgileriniz başarıyla güncellendi");
        } catch (err) {
            setProfileError(err.response?.data?.message || "Güncelleme başarısız");
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setPasswordError("Yeni şifreler eşleşmiyor");
        return;
    }

    setPasswordLoading(true);
    setPasswordMessage("");
    setPasswordError("");

    try {
        await changePassword(
            passwordForm.currentPassword,
            passwordForm.newPassword
        );
        setPasswordMessage("Şifreniz güncellendi");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
        setPasswordError(err.response?.data?.message || "Şifre değiştirme başarısız");
    } finally {
        setPasswordLoading(false);
    }
};
    return (
        <div className="max-w-md mx-auto px-6 py-10">
            <BackButton />

            <h1 className="font-display text-2xl text-ink mb-8">Profilim</h1>

            <form
                onSubmit={handleProfileSubmit}
                className="bg-surface border border-line rounded-xl p-6 space-y-4 mb-8"
            >
                <h2 className="font-medium text-ink mb-2">Kişisel Bilgiler</h2>
                <Input
                    label="Ad Soyad"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                />

                <Input
                    label="Telefon"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                />

                {profileMessage && (
                    <div className="bg-ok-bg text-ok-tx text-sm rounded-lg px-3.5 py-2.5">
                        {profileMessage}
                    </div>
                )}

                {profileError && (
                    <div className="bg-danger-soft text-danger text-sm rounded-lg px-3.5 py-2.5">
                        {profileError}
                    </div>
                )}

                <Button type="submit" loading={profileLoading}>
                    Bilgileri Güncelle
                </Button>
            </form>

            <form
                onSubmit={handlePasswordSubmit}
                className="bg-surface border border-line rounded-xl p-6 space-y-4"
            >
                <h2 className="font-medium text-ink mb-2">Şifre Değiştir</h2>

                <Input
                    label="Mevcut Şifre"
                    name="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                />

                <Input
                    label="Yeni Şifre"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                />

                <Input
                    label="Yeni Şifre (Tekrar)"
                    name= "confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                />

                {passwordMessage && (
                    <div className="bg-ok-bg text-ok-tx text-sm rounded-lg px-3.5 py-2.5">
                        {passwordMessage}
                    </div>
                )}

                {passwordError && (
                    <div className="bg-danger-soft text-danger text-sm rounded-lg px-3.5 py-2.5">
                        {passwordError}
                    </div>
                )}

                <Button type="submit" loading={passwordLoading} variant="secondary">
                    Şifreyi Değiştir
                </Button>
            </form>
        </div>
    );
}

export default Profile;