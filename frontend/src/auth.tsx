import { Navigate } from "react-router-dom";

export function saveToken(token: string) {
    localStorage.setItem("token", token);
}

export function getToken() {
    return localStorage.getItem("token");
}

export function logout() {
    localStorage.removeItem("token");
}

export function isAuthenticated() {
    return !!getToken();
}

export function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return children;

}