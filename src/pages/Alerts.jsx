import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

import {
  useApp,
} from "../context/AppContext";

export default function Alerts() {

  const context =
    useApp() || {};

  const alerts =
    Array.isArray(
      context?.generatedAlerts
    )

      ? context.generatedAlerts

      : [];

  const criticalAlerts =
    alerts.filter(
      (alert) =>
        alert?.level ===
        "critical"
    );

  const warningAlerts =
    alerts.filter(
      (alert) =>
        alert?.level ===
        "warning"
    );

  return (

    <div className="
      space-y-8
      pb-10
    ">

      {/* HEADER */}

      <div>

        <h1 className="
          text-5xl
          font-black
        ">
          Alerts Center
        </h1>

        <p className="
          text-slate-400
          mt-2
        ">
          Operational monitoring
        </p>

      </div>

      {/* SUMMARY */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-5
      ">

        {/* CRITICAL */}

        <div className="
          bg-red-500/10
          border
          border-red-500/30
          rounded-3xl
          p-6
        ">

          <div className="
            flex
            justify-between
            items-center
          ">

            <div>

              <p className="
                text-red-300
                text-sm
              ">
                Critical Alerts
              </p>

              <h2 className="
                text-5xl
                font-black
                mt-2
              ">
                {
                  criticalAlerts.length
                }
              </h2>

            </div>

            <ShieldAlert
              size={40}
              className="
                text-red-400
              "
            />

          </div>

        </div>

        {/* WARNING */}

        <div className="
          bg-yellow-500/10
          border
          border-yellow-500/30
          rounded-3xl
          p-6
        ">

          <div className="
            flex
            justify-between
            items-center
          ">

            <div>

              <p className="
                text-yellow-300
                text-sm
              ">
                Warning Alerts
              </p>

              <h2 className="
                text-5xl
                font-black
                mt-2
              ">
                {
                  warningAlerts.length
                }
              </h2>

            </div>

            <AlertTriangle
              size={40}
              className="
                text-yellow-400
              "
            />

          </div>

        </div>

        {/* HEALTH */}

        <div className="
          bg-green-500/10
          border
          border-green-500/30
          rounded-3xl
          p-6
        ">

          <div className="
            flex
            justify-between
            items-center
          ">

            <div>

              <p className="
                text-green-300
                text-sm
              ">
                System Health
              </p>

              <h2 className="
                text-4xl
                font-black
                mt-3
              ">

                {
                  alerts.length === 0

                    ? "Stable"

                    : "Attention"
                }

              </h2>

            </div>

            <CheckCircle2
              size={40}
              className="
                text-green-400
              "
            />

          </div>

        </div>

      </div>

      {/* ALERT LIST */}

      <div className="
        space-y-4
      ">

        {
          alerts.length === 0 && (

            <div className="
              bg-green-500/10
              border
              border-green-500/30
              rounded-3xl
              p-8
              text-center
            ">

              <CheckCircle2
                size={50}
                className="
                  mx-auto
                  text-green-400
                "
              />

              <h2 className="
                text-3xl
                font-black
                mt-5
              ">
                No Active Alerts
              </h2>

              <p className="
                text-slate-400
                mt-3
              ">
                Operations are currently stable.
              </p>

            </div>
          )
        }

        {
          alerts.map(
            (
              alert,
              index
            ) => (

              <div
                key={index}
                className={`
                  border
                  rounded-3xl
                  p-5
                  ${
                    alert.level ===
                    "critical"

                      ? "bg-red-500/10 border-red-500/30"

                      : "bg-yellow-500/10 border-yellow-500/30"
                  }
                `}
              >

                <div className="
                  flex
                  justify-between
                  items-center
                ">

                  <div>

                    <h2 className="
                      text-xl
                      font-black
                    ">
                      {
                        alert.title
                      }
                    </h2>

                    <p className="
                      text-slate-300
                      mt-2
                    ">
                      {
                        alert.description
                      }
                    </p>

                  </div>

                  <div className={`
                    px-4
                    py-2
                    rounded-2xl
                    text-sm
                    font-bold
                    ${
                      alert.level ===
                      "critical"

                        ? "bg-red-600"

                        : "bg-yellow-500 text-black"
                    }
                  `}>

                    {
                      alert.level
                    }

                  </div>

                </div>

              </div>
            )
          )
        }

      </div>

    </div>
  );
}