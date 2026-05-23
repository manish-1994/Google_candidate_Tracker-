import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
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
            path="/candidates"
            element={<Candidates />}
          />

          <Route
            path="/laptops"
            element={<Laptops />}
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