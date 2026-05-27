import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout
  from "./layouts/MainLayout";

import Dashboard
  from "./pages/Dashboard";

import Candidates
  from "./pages/Candidates";

import Laptops
  from "./pages/Laptops";

import LaptopDetails
  from "./pages/LaptopDetails";

import Sheets
  from "./pages/Sheets";

import Settings
  from "./pages/Settings";

import WorkbookViewer
  from "./pages/WorkbookViewer";

import Alerts
  from "./pages/Alerts";

export default function App() {

  return (

    <BrowserRouter>

      <MainLayout>

        <Routes>

          {/* DASHBOARD */}

          <Route
            path="/"
            element={
              <Dashboard />
            }
          />

          {/* CANDIDATES */}

          <Route
            path="/candidates"
            element={
              <Candidates />
            }
          />

          {/* LAPTOPS */}

          <Route
            path="/laptops"
            element={
              <Laptops />
            }
          />

          <Route
            path="/laptops/:assetTag"
            element={
              <LaptopDetails />
            }
          />

          {/* SHEETS */}

          <Route
            path="/sheets"
            element={
              <Sheets />
            }
          />

          {/* ALERTS */}

          <Route
            path="/alerts"
            element={
              <Alerts />
            }
          />

          {/* WORKBOOK */}

          <Route
            path="/workbook"
            element={
              <WorkbookViewer />
            }
          />

          {/* SETTINGS */}

          <Route
            path="/settings"
            element={
              <Settings />
            }
          />

        </Routes>

      </MainLayout>

    </BrowserRouter>

  );
}