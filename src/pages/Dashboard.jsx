import {
  Users,
  Laptop,
  CheckCircle2,
  Clock3,
  Globe2,
  Activity,
  Plus,
  Upload,
  ArrowUpRight,
  Database,
  Briefcase,
  ShieldAlert,
} from "lucide-react";

import {
  useMemo,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useApp,
} from "../context/AppContext";

export default function Dashboard() {
  const navigate =
    useNavigate();

  const {
    candidates,

    availableLaptops,

    laptops,

    candidateCardSettings,
  } = useApp();

  // TOTALS

  const totalCandidates =
    candidates.length;

  const onboardedCount =
    candidates.filter(
      (candidate) =>
        candidate.Onboarded ===
        true
    ).length;

  const pendingCount =
    totalCandidates -
    onboardedCount;

  // FIXED ASSIGNED COUNTS
  const assignedLaptops =
    laptops.filter(
      (laptop) =>
        laptop.status ===
        "Assigned"
    ).length;

  // FIXED AVAILABLE COUNTS
  const availableLaptopCount =
    laptops.filter(
      (laptop) =>
        laptop.status ===
        "Available"
    ).length;

  // COUNTRIES / REGIONS

  const countryStats =
    useMemo(() => {
      const stats = {};

      availableLaptops.forEach(
        (laptop) => {
          const country =
            laptop.customRegion ||

            laptop.Country ||

            "Unknown";

          if (!stats[country]) {
            stats[country] = 0;
          }

          stats[country] += 1;
        }
      );

      return Object.entries(
        stats
      )
        .sort(
          (a, b) =>
            b[1] - a[1]
        )
        .slice(0, 5);
    }, [availableLaptops]);

  // RECENT

  const recentCandidates =
    [...candidates]
      .reverse()
      .slice(0, 6);

  // KPI

  const stats = [
    {
      title:
        "Candidates",

      value:
        totalCandidates,

      icon:
        Users,

      color:
        "from-blue-500 to-cyan-500",
    },

    {
      title:
        "Onboarded",

      value:
        onboardedCount,

      icon:
        CheckCircle2,

      color:
        "from-green-500 to-emerald-500",
    },

    {
      title:
        "Pending",

      value:
        pendingCount,

      icon:
        Clock3,

      color:
        "from-yellow-500 to-orange-500",
    },

    {
      title:
        "Assigned",

      value:
        assignedLaptops,

      icon:
        Laptop,

      color:
        "from-purple-500 to-pink-500",
    },

    {
      title:
        "Inventory",

      value:
        availableLaptopCount,

      icon:
        Database,

      color:
        "from-indigo-500 to-blue-500",
    },

    {
      title:
        "Regions",

      value:
        countryStats.length,

      icon:
        Globe2,

      color:
        "from-cyan-500 to-sky-500",
    },
  ];

  return (
    <div
      className="
        space-y-6
        pb-10
      "
    >
      {/* HEADER */}

      <div
        className="
          flex
          justify-between
          items-center
          flex-wrap
          gap-4
        "
      >
        <div>
          <h1
            className="
              text-5xl
              font-black
              tracking-tight
            "
          >
            Operations Dashboard
          </h1>

          <p
            className="
              text-slate-400
              mt-2
            "
          >
            Recruitment & Inventory Control Center
          </p>
        </div>

        <div
          className="
            flex
            gap-3
            flex-wrap
          "
        >
          <button
            onClick={() =>
              navigate(
                "/candidates"
              )
            }
            className="
              bg-blue-600
              hover:bg-blue-700
              transition
              px-5
              py-3
              rounded-2xl
              font-semibold
              flex
              items-center
              gap-2
            "
          >
            <Plus size={18} />

            Candidate
          </button>

          <button
            onClick={() =>
              navigate(
                "/sheets"
              )
            }
            className="
              bg-purple-600
              hover:bg-purple-700
              transition
              px-5
              py-3
              rounded-2xl
              font-semibold
              flex
              items-center
              gap-2
            "
          >
            <Upload size={18} />

            Upload
          </button>
        </div>
      </div>

      {/* KPI */}

      <div
        className="
          grid
          grid-cols-2
          lg:grid-cols-3
          2xl:grid-cols-6
          gap-4
        "
      >
        {stats.map((stat) => {
          const Icon =
            stat.icon;

          return (
            <div
              key={stat.title}
              className="
                bg-white/5
                border
                border-white/10
                rounded-[28px]
                p-5
                backdrop-blur-xl
                hover:translate-y-[-2px]
                transition
              "
            >
              <div
                className="
                  flex
                  justify-between
                  items-start
                "
              >
                <div>
                  <p
                    className="
                      text-slate-400
                      text-sm
                    "
                  >
                    {stat.title}
                  </p>

                  <h2
                    className="
                      text-4xl
                      font-black
                      mt-3
                    "
                  >
                    {stat.value}
                  </h2>
                </div>

                <div
                  className={`
                    p-3
                    rounded-2xl
                    bg-gradient-to-r
                    ${stat.color}
                  `}
                >
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MAIN GRID */}

      <div
        className="
          grid
          grid-cols-1
          2xl:grid-cols-3
          gap-6
        "
      >
        {/* ACTIVITY */}

        <div
          className="
            2xl:col-span-2
            bg-white/5
            border
            border-white/10
            rounded-[32px]
            p-6
            backdrop-blur-xl
          "
        >
          <div
            className="
              flex
              justify-between
              items-center
              mb-6
            "
          >
            <div>
              <h2
                className="
                  text-2xl
                  font-black
                "
              >
                Recent Candidate Activity
              </h2>

              <p
                className="
                  text-slate-400
                  text-sm
                  mt-1
                "
              >
                Latest onboarding operations
              </p>
            </div>

            <div
              className="
                bg-blue-600/20
                text-blue-400
                p-3
                rounded-2xl
              "
            >
              <Activity size={22} />
            </div>
          </div>

          <div
            className="
              space-y-3
            "
          >
            {recentCandidates.length ===
            0 ? (
              <div
                className="
                  bg-slate-900/70
                  border
                  border-white/10
                  rounded-3xl
                  p-6
                  text-center
                  text-slate-400
                "
              >
                No candidate activity
                yet
              </div>
            ) : (
              recentCandidates.map(
                (
                  candidate
                ) => (
                  <div
                    key={
                      candidate.id
                    }
                    className="
                      bg-slate-900/70
                      border
                      border-white/10
                      rounded-3xl
                      p-4
                      flex
                      justify-between
                      items-center
                      hover:border-blue-500
                      transition
                    "
                  >
                    <div>
                      <h3
                        className="
                          text-lg
                          font-bold
                        "
                      >
                        {
                          candidate[
                            candidateCardSettings
                              .titleField
                          ] ||
                            "Unnamed"
                        }
                      </h3>

                      <div
                        className="
                          flex
                          gap-4
                          mt-1
                          text-sm
                          text-slate-400
                          flex-wrap
                        "
                      >
                        <span>
                          {
                            candidate.Email ||
                            "No Email"
                          }
                        </span>

                        
                      </div>
                    </div>

                    {candidate.Onboarded ? (
                      <div
                        className="
                          bg-green-600
                          px-4
                          py-2
                          rounded-2xl
                          text-sm
                          font-semibold
                        "
                      >
                        Onboarded
                      </div>
                    ) : (
                      <div
                        className="
                          bg-yellow-500
                          text-black
                          px-4
                          py-2
                          rounded-2xl
                          text-sm
                          font-semibold
                        "
                      >
                        Pending
                      </div>
                    )}
                  </div>
                )
              )
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div
          className="
            space-y-6
          "
        >
          {/* ONBOARDING */}

          <div
            className="
              bg-white/5
              border
              border-white/10
              rounded-[32px]
              p-6
              backdrop-blur-xl
            "
          >
            <div
              className="
                flex
                justify-between
                items-center
              "
            >
              <div>
                <h2
                  className="
                    text-2xl
                    font-black
                  "
                >
                  Onboarding
                </h2>

                <p
                  className="
                    text-slate-400
                    text-sm
                    mt-1
                  "
                >
                  Candidate progress
                </p>
              </div>

              <CheckCircle2
                size={24}
                className="
                  text-green-400
                "
              />
            </div>

            <div
              className="
                mt-6
                space-y-5
              "
            >
              <div>
                <div
                  className="
                    flex
                    justify-between
                    mb-2
                    text-sm
                  "
                >
                  <span>
                    Completed
                  </span>

                  <span>
                    {
                      onboardedCount
                    }
                  </span>
                </div>

                <div
                  className="
                    h-3
                    bg-slate-800
                    rounded-full
                    overflow-hidden
                  "
                >
                  <div
                    className="
                      h-full
                      bg-green-500
                    "
                    style={{
                      width: `${
                        totalCandidates ===
                        0
                          ? 0
                          : (onboardedCount /
                              totalCandidates) *
                            100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div
                  className="
                    flex
                    justify-between
                    mb-2
                    text-sm
                  "
                >
                  <span>
                    Pending
                  </span>

                  <span>
                    {
                      pendingCount
                    }
                  </span>
                </div>

                <div
                  className="
                    h-3
                    bg-slate-800
                    rounded-full
                    overflow-hidden
                  "
                >
                  <div
                    className="
                      h-full
                      bg-yellow-500
                    "
                    style={{
                      width: `${
                        totalCandidates ===
                        0
                          ? 0
                          : (pendingCount /
                              totalCandidates) *
                            100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ASSIGNMENTS */}

          <div
            className="
              bg-white/5
              border
              border-white/10
              rounded-[32px]
              p-6
              backdrop-blur-xl
            "
          >
            <div
              className="
                flex
                justify-between
                items-center
              "
            >
              <div>
                <h2
                  className="
                    text-2xl
                    font-black
                  "
                >
                  Assignments
                </h2>

                <p
                  className="
                    text-slate-400
                    text-sm
                    mt-1
                  "
                >
                  Device utilization
                </p>
              </div>

              <Laptop
                size={24}
                className="
                  text-purple-400
                "
              />
            </div>

            <div
              className="
                mt-6
                space-y-4
              "
            >
              <div
                className="
                  bg-slate-900/70
                  border
                  border-white/10
                  rounded-2xl
                  p-4
                  flex
                  justify-between
                "
              >
                <span>
                  Assigned
                </span>

                <span
                  className="
                    font-bold
                  "
                >
                  {
                    assignedLaptops
                  }
                </span>
              </div>

              <div
                className="
                  bg-slate-900/70
                  border
                  border-white/10
                  rounded-2xl
                  p-4
                  flex
                  justify-between
                "
              >
                <span>
                  Available
                </span>

                <span
                  className="
                    font-bold
                  "
                >
                  {
                    availableLaptopCount
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}