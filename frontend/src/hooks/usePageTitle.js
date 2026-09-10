import { useEffect } from "react";

function usePageTitle(title) {
    useEffect(() => {
        document.title = title ? `${title} | Kadın Kuaför Çetin` : "Kadın Kuaför Çetin";
    }, [title]);
}

export default usePageTitle;