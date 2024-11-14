import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/login' element={<LoginPage/>} />
    )
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>,
)
