import { NavLink } from "react-router-dom";

const TABS = [
    { to: "/home", label: "홈", icon: "🏠", end: true },
    { to: "/map", label: "지도", icon: "📅" },
    { to: "/slang", label: "찜", icon: "🛒" },
    { to: "/my", label: "마이", icon: "💬" },

];

export default function Footer() {
    return (
        <nav className="tabbar">
            {TABS.map((t) => (
                <NavLink key={t.to} to={t.to} end={t.end}>
                    <div className="tab-icon">{t.icon}</div>
                    {t.label}
                </NavLink>
            ))}
        </nav>
    );
}