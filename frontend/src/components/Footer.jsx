function Footer() {
    return (
        <footer className="bg-brand-dark text-white/70 mt-16">
        <div className="max-w-5xl mx-auto px-6 py-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <p className="font-display text-lg text-white mb-1">Kadın Kuaför Çetin</p>
                    <p className="text-sm">Kendinize zaman ayırın</p>
                </div>
                <div className="text-sm">
                    <p>Pazartesi - Cumartesi: 09:00 - 19:00</p>
                </div>
            </div>
            <div className="border-t border-white/10 mt-6 pt-6 text-sm text-center sm:text-left">
                 © 2026 Kadın Kuaför Çetin. Tüm hakları saklıdır.
            </div>
        </div>
    </footer>
    );
}