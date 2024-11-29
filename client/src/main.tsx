import {StrictMode} from "react"
import {createRoot} from "react-dom/client"
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import {LoginPage} from "./pages/LoginPage.tsx";
import {RootPage} from "./pages/RootPage.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={createBrowserRouter(
            createRoutesFromElements(
                <Route element={<RootPage/>}>
                    <Route index element={<></>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                </Route>
            )
        )}/>
    </StrictMode>
)
