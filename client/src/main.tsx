import {StrictMode} from "react"
import {createRoot} from "react-dom/client"
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import {LoginPage} from "./pages/LoginPage.tsx";
import {RootPage} from "./pages/RootPage.tsx";
import {ChatPage} from "./pages/ChatPage.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={createBrowserRouter(
            createRoutesFromElements(
                <Route element={<RootPage/>}>
                    <Route index element={<></>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/chat" element={<ChatPage/>}/>
                </Route>
            )
        )}/>
    </StrictMode>
)
