import { Routes, Route, Navigate } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import { ProtectedRoute } from "./auth";

export default function Router() {

    return (
        <Routes>

            <Route path="/signup" element={<Signup />} />

            <Route path="/login" element={<Login />} />

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="*"
                element={<Navigate to="/" />}
            />

        </Routes>
    );
}