import "./Sidebar.css";

import { logout } from "../auth";

function handleLogout() {
    logout();
    window.location.href = "/login";
}

type Props = {
    current: string;
    onChange: (page: string) => void;
};

export default function Sidebar({
    current,
    onChange,
}: Props) {

    const items = [
        "Dashboard",
        "Datasets",
        "Metrics",
        "Evaluations",
        "Reports",
        "Settings",
    ];

    return (

        <div className="sidebar">

            <div className="sidebar-title">
                TrustAI
            </div>

            <div className="sidebar-menu">

                {items.map((item) => (

                    <button
                        key={item}
                        onClick={() => onChange(item)}
                        className={
                            current === item
                                ? "sidebar-button active"
                                : "sidebar-button"
                        }
                    >
                        {item}
                    </button>

                ))}

            </div>

            <button
                className="logout-button"
                onClick={handleLogout}
            >
                Logout
            </button>

        </div>

    );
}