import {
  LayoutDashboard,
  Users,
  Laptop,
  FileSpreadsheet,
  Settings,
} from "lucide-react";

import { Link } from "react-router-dom";

const menu = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    name: "Candidates",
    icon: Users,
    path: "/candidates",
  },
  {
    name: "Laptop Tracker",
    icon: Laptop,
    path: "/laptops",
  },
  {
    name: "Sheets",
    icon: FileSpreadsheet,
    path: "/sheets",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export default function Sidebar() {

  return (

    <aside className="
      w-72
      min-w-72
      h-screen
      bg-white/5
      backdrop-blur-xl
      border-r
      border-white/10
      p-6
      flex
      flex-col
      shadow-2xl
    ">

      <div className="mb-10">

        <h1 className="
          text-3xl
          font-black
          tracking-tight
          bg-gradient-to-r
          from-blue-400
          to-cyan-300
          bg-clip-text
          text-transparent
        ">
          Google Tracker
        </h1>

        <p className="
          text-slate-400
          text-sm
          mt-2
        ">
          Internal Operations Platform
        </p>

      </div>

      <nav className="
        flex
        flex-col
        gap-3
      ">

        {menu.map((item) => {

          const Icon = item.icon;

          return (

            <Link
              key={item.name}
              to={item.path}
              className="
                group
                flex
                items-center
                gap-4
                px-5
                py-4
                rounded-2xl
                text-slate-300
                no-underline
                transition-all
                duration-300
                hover:bg-blue-600/20
                hover:text-white
                hover:translate-x-1
              "
            >

              <Icon
                size={20}
                className="
                  group-hover:scale-110
                  transition
                "
              />

              <span className="
                font-medium
              ">
                {item.name}
              </span>

            </Link>

          );
        })}

      </nav>

      <div className="
        mt-auto
        bg-slate-900/70
        border
        border-white/10
        rounded-3xl
        p-5
      ">

        <p className="
          text-sm
          text-slate-400
        ">
          Workspace
        </p>

        <h3 className="
          mt-2
          text-lg
          font-bold
        ">
          Google Operations
        </h3>

      </div>

    </aside>

  );
}