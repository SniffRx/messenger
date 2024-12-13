import { Navigate } from "react-router-dom";
import {ProtectedRouteProps} from "./types.ts";

export function ProtectedRoute(props: ProtectedRouteProps) {
    const token = localStorage.getItem("authToken");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return props.children;
}