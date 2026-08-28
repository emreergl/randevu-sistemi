function Input({ label, error, ...props }) {
    return (
        <div>
            <label className="block text-sm text-ink-soft mb-1.5">
                {label}
            </label>
            <input
                {...props}
                className={`w-full px-3.5 py-2.5 rounded-lg border bg-surface
                text-ink placeholder:text-ink-faint
                focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand
                transition-colors
                ${error ? "border-danger" : "border-line"}`}
            />
            {error && (
                <p className="text-danger text-sm mt-1.5">{error}</p>
            )}
        </div>
    );
}

export default Input;