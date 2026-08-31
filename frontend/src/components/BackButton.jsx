import { useNavigate } from "react-router-dom";

function BackButton({ label = "Geri" }) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink mb-4 transition-colors"
        >
            <span>←</span>
            <span>{label}</span>
        </button>
    );
}

export default BackButton;