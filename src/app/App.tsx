import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PlantProvider } from "./context/PlantContext";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";

export default function App() {
  return (
    <PlantProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </PlantProvider>
  );
}
