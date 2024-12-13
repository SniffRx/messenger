import { StrictMode } from "react";
import {createRoot} from "react-dom/client"
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import {LoginPage} from "./pages/LoginPage.tsx";
import {RootPage} from "./pages/RootPage.tsx";
import {ChatPage} from "./pages/chat/ChatPage.tsx";
import {RegisterPage} from "./pages/RegisterPage.tsx";
import {ProtectedRoute} from "./components/ProtectedRoute.tsx";
import {ErrorPage} from "./pages/ErrorPage.tsx";

// function App() {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//
//     useEffect(() => {
//         const token = localStorage.getItem("authToken"); // Проверяем наличие токена в localStorage
//         if (token && checkAuth(token)) {
//             setIsAuthenticated(true);
//         } else {
//             setIsAuthenticated(false);
//         }
//     }, []);
//
//     const router = createBrowserRouter(
//         createRoutesFromElements(
//             <Route element={<RootPage />}>
//                 <Route index element={<></>} />
//                 <Route path="/register" element={<RegisterPage />} />
//                 <Route path="/login" element={<LoginPage />} />
//                 <Route path="/chat/:id" element={<ChatPage />} />
//             </Route>
//         )
//     );
//
//     return (
//         <RouterProvider router={router} />
//     );
// }
//
// createRoot(document.getElementById("root")!).render(
//     <StrictMode>
//         <App />
//     </StrictMode>
// );

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider
            router={createBrowserRouter(
                createRoutesFromElements(
                    <>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route element={<RootPage />}>
                            <Route
                                path="/chat/:id"
                                element={
                                    <ProtectedRoute>
                                        <ChatPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="*" element={<ErrorPage />} />
                        </Route>
                    </>
                )
            )}
        />
    </StrictMode>
);