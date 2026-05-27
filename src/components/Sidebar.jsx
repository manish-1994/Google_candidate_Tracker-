import {
  LayoutDashboard,
  Users,
  Laptop,
  FileSpreadsheet,
  Settings,
  AlertTriangle,
} from "lucide-react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  useApp,
} from "../context/AppContext";

export default function Sidebar() {

  const location =
    useLocation();

  const context =
    useApp() || {};

  const alerts =
    Array.isArray(
      context.generatedAlerts
    )

      ? context.generatedAlerts

      : [];

  const criticalCount =
    alerts.filter(
      (alert) =>
        alert?.level ===
        "critical"
    ).length;

  const warningCount =
    alerts.filter(
      (alert) =>
        alert?.level ===
        "warning"
    ).length;

  const totalAlerts =
    alerts.length;

  const menu = [

    {
      name:
        "Dashboard",

      icon:
        LayoutDashboard,

      path:
        "/",
    },

    {
      name:
        "Candidates",

      icon:
        Users,

      path:
        "/candidates",
    },

    {
      name:
        "Laptop Tracker",

      icon:
        Laptop,

      path:
        "/laptops",
    },

    {
      name:
        "Sheets",

      icon:
        FileSpreadsheet,

      path:
        "/sheets",
    },

    {
      name:
        "Alerts",

      icon:
        AlertTriangle,

      path:
        "/alerts",

      badge:
        totalAlerts,
    },

    {
      name:
        "Settings",

      icon:
        Settings,

      path:
        "/settings",
    },

  ];

  return (

    <aside className="
      w-72
      min-w-72
      h-screen
      bg-[#050816]
      border-r
      border-white/10
      flex
      flex-col
    ">

      <div className="
        p-7
      ">

        <h1 className="
          text-4xl
          font-black
          bg-gradient-to-r
          from-blue-400
          to-cyan-300
          bg-clip-text
          text-transparent
        ">
          Google Tracker
        </h1>

        <p className="
          text-slate-500
          mt-3
          text-sm
        ">
          Internal Operations Platform
        </p>

      </div>

      <nav className="
        flex-1
        px-4
        py-5
        space-y-3
      ">

        {menu.map(
          (item) => {

            const Icon =
              item.icon;

            const active =
              location.pathname ===
              item.path;

            return (

              <Link
                key={item.name}
                to={item.path}
                className={`
                  flex
                  items-center
                  justify-between
                  px-5
                  py-4
                  rounded-2xl
                  transition
                  border
                  ${
                    active

                      ? "bg-blue-600 border-blue-500 text-white"

                      : "border-transparent text-slate-300 hover:bg-white/5"
                  }
                `}
              >

                <div className="
                  flex
                  items-center
                  gap-4
                ">

                  <Icon size={20} />

                  <span className="
                    font-semibold
                  ">
                    {item.name}
                  </span>

                </div>

                {item.badge > 0 && (

                  <div className="
                    min-w-[28px]
                    h-7
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-xs
                    font-black
                    px-2
                    bg-red-500
                    text-white
                  ">

                    {
                      item.badge
                    }

                  </div>

                )}

              </Link>

            );
          }
        )}

      </nav>

    </aside>
  );
}