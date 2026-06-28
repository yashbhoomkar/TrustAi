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

        <div
            style={{
                width: 220,
                borderRight: "1px solid black",
                padding: 20,
            }}
        >

            <h2>TrustAI</h2>

            <hr />

            {items.map((item) => (

                <div
                    key={item}
                    style={{
                        marginTop: 10,
                    }}
                >

                    <button
                        onClick={() => onChange(item)}
                        disabled={current === item}
                    >
                        {item}
                    </button>

                </div>

            ))}

            <button
                onClick={handleLogout}
            >
                Logout
            </button>

        </div>

    );

}