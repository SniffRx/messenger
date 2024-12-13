import { StrictMode, useEffect, useState } from "react";
import {createRoot} from "react-dom/client"
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import {LoginPage} from "./pages/LoginPage.tsx";
import {RootPage} from "./pages/RootPage.tsx";
import {ChatPage} from "./pages/ChatPage.tsx";
import { checkAuth } from "./utils/auth";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("authToken"); // Проверяем наличие токена в localStorage
        if (token && checkAuth(token)) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route element={<RootPage />}>
                <Route index element={<></>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/chat/:id" element={<ChatPage />} />
            </Route>
        )
    );

    return (
        <RouterProvider router={router} />
    );
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);