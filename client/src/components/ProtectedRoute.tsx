import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
    const token = localStorage.getItem("authToken");
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
}
