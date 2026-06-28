import { useNavigate } from "react-router-dom";

import { logout } from "../auth";

export default function Home() {

    const navigate = useNavigate();

    function handleLogout() {

        logout();

        navigate("/login");

    }

    return (

        <div>

            <h1>

                You are successfully logged in.

            </h1>

            <button
                onClick={handleLogout}
            >
                Logout
            </button>

        </div>

    );

}