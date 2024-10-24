import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { ThirdwebProvider } from "thirdweb/react";
import Layout from "./Layout.tsx";
import LandingPage from "./components/LandingPage/LandingPage.tsx";
import Login from "./components/Login/Login.tsx";
import Patient from "./components/Patient/Patient.tsx";
import { Register } from "./components/Registration/Registration.tsx";
import Upload from "./components/Upload/Upload.tsx";
import View from "./components/View/View.tsx";
import NFT from "./components/NFT/NFT.tsx";
import Access from "./components/Access/Access.tsx";
import Doctor from "./components/Doctor/Doctor.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/patient" element={<Patient />} />
      <Route path="/register" element={<Register />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/view" element={<View />} />
      <Route path="/access" element={<Access />} />
      <Route path="/nft" element={<NFT />} />
      <Route path="/doctor" element={<Doctor />} />
    </Route>
  )
);

// dotenv.config();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThirdwebProvider>
      <RouterProvider router={router} />
    </ThirdwebProvider>
  </React.StrictMode>
);
