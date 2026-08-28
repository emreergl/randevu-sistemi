function Button({ children, variant = "primary", loading, ...props }) {
    const base = "w-full px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-brand text-white hover:bg-brand-dark",
        secondary: "bg-surface text-ink border border-line hover:bg-paper"
    };

    return (
        <button{...props}
        disabled={loading || props.disabled}
        className={`${base} ${variants[variant]}`}
    >
        {loading ? "Lütfen bekleyin..." : children}
    </button>
    );
}

export default Button;