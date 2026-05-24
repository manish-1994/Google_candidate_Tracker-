import {
  useMemo,
  useState,
} from "react";
import {
  useNavigate,
} from "react-router-dom";

import {
  Search,
  Laptop,
  Monitor,
  AlertTriangle,
  X,
  Cpu,
  MemoryStick,
  Globe,
  Mail,
  User,
  Hash,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

import {
  useApp,
} from "../context/AppContext";

export default function Laptops() {

  const {
    laptops,
  } = useApp();

  const navigate =
    useNavigate();

  const [
    selectedLaptop,
    setSelectedLaptop,
  ] = useState(null);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    filter,
    setFilter,
  ] = useState("All");

  const filteredLaptops =
    useMemo(() => {

      return laptops.filter(
        (laptop) => {

          const searchMatch =
            Object.values(
              laptop
            ).some((value) =>

              String(value)
                .toLowerCase()
                .includes(
                  search.toLowerCase()
                )
            );

          if (
            filter ===
            "All"
          ) {
            return searchMatch;
          }

          return (
            searchMatch &&
            laptop.status ===
            filter
          );
        }
      );

    }, [
      laptops,
      search,
      filter,
    ]);

  const getStatusColor =
    (status) => {

      switch (
      status
      ) {

        case "Assigned":
          return "bg-green-600";

        case "Damaged":
          return "bg-red-600";

        case "Available":
          return "bg-blue-600";

        default:
          return "bg-yellow-600";
      }
    };

  const getStatusIcon =
    (status) => {

      switch (
      status
      ) {

        case "Assigned":
          return (
            <CheckCircle2
              size={16}
            />
          );

        case "Damaged":
          return (
            <ShieldAlert
              size={16}
            />
          );

        default:
          return (
            <Laptop
              size={16}
            />
          );
      }
    };

  return (

    <div className="
      space-y-8
    ">

      <div className="
        flex
        justify-between
        items-start
        flex-wrap
        gap-6
      ">

        <div>

          <h1 className="
            text-5xl
            font-black
          ">
            Laptop Tracker
          </h1>

          <p className="
            text-slate-400
            mt-2
            text-lg
          ">
            Centralized operational inventory
          </p>

        </div>

        <div className="
          flex
          gap-4
          flex-wrap
        ">

          <div className="
            bg-white/5
            border
            border-white/10
            rounded-2xl
            px-5
            py-4
            flex
            items-center
            gap-3
            w-[360px]
          ">

            <Search
              size={18}
            />

            <input
              type="text"
              placeholder="
Search candidate, asset, serial...
              "
              value={
                search
              }
              onChange={(
                e
              ) =>
                setSearch(
                  e.target
                    .value
                )
              }
              className="
                bg-transparent
                outline-none
                text-white
                w-full
              "
            />

          </div>

          <select
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target
                  .value
              )
            }
            className="
              bg-slate-900
              border
              border-white/10
              rounded-2xl
              px-5
              py-4
              text-white
              outline-none
            "
          >

            <option>
              All
            </option>

            <option>
              Assigned
            </option>

            <option>
              Available
            </option>

            <option>
              Damaged
            </option>

          </select>

        </div>

      </div>

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
      ">

        {filteredLaptops.map(
          (
            laptop,
            index
          ) => (

            <div
              key={index}
              onClick={() =>
                setSelectedLaptop(
                  laptop
                )
              }
              className="
                bg-white/5
                border
                border-white/10
                rounded-3xl
                p-6
                backdrop-blur-xl
                shadow-2xl
                cursor-pointer
                hover:scale-[1.02]
                transition
              "
            >

              <div className="
                flex
                justify-between
                items-start
              ">

                <div className="
                  flex
                  gap-4
                ">

                  <div className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-blue-600
                    flex
                    items-center
                    justify-center
                  ">

                    {laptop.deviceType ===
                      "MacBook"

                      ? (
                        <Monitor />
                      )

                      : (
                        <Laptop />
                      )}

                  </div>

                  <div>

                    <h2 className="
                      text-xl
                      font-bold
                      leading-tight
                    ">

                      {
                        laptop[
                        "Model Name appears on the box or in the Invoice"
                        ] ||

                        laptop[
                        "The equipment that the vendor should have."
                        ] ||

                        "Unknown Device"
                      }

                    </h2>

                    <p className="
                      text-slate-400
                      mt-2
                      text-sm
                    ">

                      {
                        laptop[
                        "Akraya Asset ID"
                        ]
                      }

                    </p>

                  </div>

                </div>

                <div className={`
                  flex
                  items-center
                  gap-2
                  px-3
                  py-2
                  rounded-xl
                  text-sm
                  font-semibold
                  ${getStatusColor(
                  laptop.status
                )}
                `}>

                  {getStatusIcon(
                    laptop.status
                  )}

                  {
                    laptop.status
                  }

                </div>

              </div>

              <div className="
                mt-6
                space-y-4
                text-sm
              ">

                <div className="
                  flex
                  justify-between
                  items-start
                  gap-4
                ">

                  <span className="
                    text-slate-400
                  ">
                    Assigned To
                  </span>

                  <span className="
                    font-medium
                    text-right
                  ">

                    {
                      laptop.assignedCandidate ||

                      laptop[
                      "The consultant's full legal name (as it will appear in the system)."
                      ] ||

                      "Unassigned"
                    }

                  </span>

                </div>

                <div className="
                  flex
                  justify-between
                ">

                  <span className="
                    text-slate-400
                  ">
                    Country
                  </span>

                  <span className="
                    font-medium
                  ">

                    {
                      laptop[
                      "Country"
                      ]
                    }

                  </span>

                </div>

                <div className="
                  flex
                  justify-between
                ">

                  <span className="
                    text-slate-400
                  ">
                    RAM
                  </span>

                  <span className="
                    font-medium
                  ">

                    {
                      laptop[
                      "RAM of the device"
                      ]
                    }

                  </span>

                </div>

                <div className="
                  flex
                  justify-between
                ">

                  <span className="
                    text-slate-400
                  ">
                    Source
                  </span>

                  <span className="
                    bg-slate-800
                    px-3
                    py-1
                    rounded-lg
                    text-xs
                  ">

                    {
                      laptop.sourceSheet
                    }

                  </span>

                </div>

              </div>

            </div>

          )
        )}

      </div>

      {selectedLaptop && (

        <div className="
          fixed
          inset-0
          bg-black/60
          backdrop-blur-sm
          z-50
          flex
          justify-end
        ">

          <div className="
            w-[700px]
            h-screen
            bg-slate-950
            border-l
            border-white/10
            overflow-auto
            p-8
          ">

            <div className="
              flex
              justify-between
              items-center
              mb-8
            ">

              <h2 className="
                text-3xl
                font-black
              ">
                Device Details
              </h2>

              <button
                onClick={() => {

                  navigate(

                    `/laptops/${encodeURIComponent(

                      selectedLaptop[
                      "Akraya Asset ID"
                      ] ||

                      selectedLaptop[
                      "__rowId"
                      ]
                    )}`,

                    {
                      state: {

                        laptop:
                          selectedLaptop,

                        sheetName:
                          selectedLaptop
                            .sourceSheet,
                      },
                    }
                  );
                }}
                className="
    mt-4
    px-5
    py-3
    rounded-2xl
    bg-blue-600
    hover:bg-blue-700
    transition
    font-semibold
  "
              >

                Open Full Record

              </button>

              <button
                onClick={() =>
                  setSelectedLaptop(
                    null
                  )
                }
                className="
                  bg-white/10
                  p-3
                  rounded-xl
                "
              >

                <X size={20} />

              </button>

            </div>

            <div className="
              grid
              grid-cols-1
              gap-5
            ">

              <DetailRow
                icon={User}
                label="Assigned Candidate"
                value={
                  selectedLaptop.assignedCandidate ||

                  selectedLaptop[
                  "The consultant's full legal name (as it will appear in the system)."
                  ]
                }
              />

              <DetailRow
                icon={Mail}
                label="Email"
                value={
                  selectedLaptop[
                  "Email Address of the candidate"
                  ]
                }
              />

              <DetailRow
                icon={Hash}
                label="Asset ID"
                value={
                  selectedLaptop[
                  "Akraya Asset ID"
                  ]
                }
              />

              <DetailRow
                icon={Cpu}
                label="Processor"
                value={
                  selectedLaptop[
                  "Processor model of the device"
                  ]
                }
              />

              <DetailRow
                icon={MemoryStick}
                label="RAM"
                value={
                  selectedLaptop[
                  "RAM of the device"
                  ]
                }
              />

              <DetailRow
                icon={Globe}
                label="Country"
                value={
                  selectedLaptop[
                  "Country"
                  ]
                }
              />

              <DetailRow
                icon={Laptop}
                label="Serial Number"
                value={
                  selectedLaptop[
                  "manufacturer provided Serial Number for the device (Found on the device, physical sticker and also in the hardware details)"
                  ]
                }
              />

              <DetailRow
                icon={AlertTriangle}
                label="Status"
                value={
                  selectedLaptop
                    .status
                }
              />

            </div>

          </div>

        </div>

      )}

    </div>

  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}) {

  return (

    <div className="
      bg-white/5
      border
      border-white/10
      rounded-2xl
      p-5
      flex
      gap-4
      items-start
    ">

      <div className="
        bg-blue-600
        p-3
        rounded-xl
      ">

        <Icon size={18} />

      </div>

      <div>

        <p className="
          text-slate-400
          text-sm
        ">
          {label}
        </p>

        <p className="
          mt-2
          text-lg
          font-semibold
          break-words
        ">
          {value || "N/A"}
        </p>

      </div>

    </div>

  );
}