import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SHOW_SEARCH_AT = 80;

export default function Header() {
    const location = useLocation();
    const isHome = location.pathname === "/" || location.pathname === "/home";
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        if (!isHome) {
            setShowSearch(true);
            return;
        }

        const onScroll = () => {
            setShowSearch(window.scrollY > SHOW_SEARCH_AT);
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [isHome]);

    useEffect(() => {
        const shouldHide = isHome && !showSearch;
        document.body.classList.toggle("header-hidden", shouldHide);
        return () => {
            document.body.classList.remove("header-hidden");
        };
    }, [isHome, showSearch]);

    useEffect(() => {
        document.body.classList.toggle("home-route", isHome);
        return () => {
            document.body.classList.remove("home-route");
        };
    }, [isHome]);

    return (
        <div className={`header-wrap${showSearch ? " header-wrap--visible" : ""}`}>
            {showSearch && (
                <div className="header-search">
                    <span>🔎</span>
                    <input placeholder="올 겨울엔 어디로 캠핑을 떠날까요?"/>
                </div>
            )}
        </div>
    );
}
