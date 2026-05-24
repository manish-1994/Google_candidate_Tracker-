import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import LaptopDetails
  from "./pages/LaptopDetails";
import Candidates from "./pages/Candidates";
import Laptops from "./pages/Laptops";
import Sheets from "./pages/Sheets";
import Settings from "./pages/Settings";

export default function App() {

  return (

    <BrowserRouter>

      <MainLayout>

        <Routes>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/laptops/:assetTag"
            element={<LaptopDetails />}
          />

          <Route
            path="/candidates"
            element={<Candidates />}
          />

          <Route
            path="/laptops"
            element={<Laptops />}
          />

          <Route
            path="/laptops/:assetTag"
            element={
              <LaptopDetails />
            }
          />

          <Route
            path="/sheets"
            element={<Sheets />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Routes>

      </MainLayout>

    </BrowserRouter>

  );
}