import {
  useEffect,
  useState,
} from "react";

import {
  X,
} from "lucide-react";

export default function InputModal({

  open,

  title,

  placeholder,

  defaultValue = "",

  confirmText = "Confirm",

  onClose,

  onConfirm,

}) {

  const [
    value,
    setValue,
  ] = useState("");

  useEffect(() => {

    setValue(
      defaultValue || ""
    );

  }, [
    defaultValue,
    open,
  ]);

  if (!open) {
    return null;
  }

  return (

    <div className="
      fixed
      inset-0
      bg-black/70
      backdrop-blur-sm
      flex
      items-center
      justify-center
      z-[9999]
      p-6
    ">

      <div className="
        w-full
        max-w-lg
        bg-slate-900
        border
        border-white/10
        rounded-3xl
        shadow-2xl
        overflow-hidden
      ">

        {/* HEADER */}

        <div className="
          flex
          items-center
          justify-between
          px-6
          py-5
          border-b
          border-white/10
        ">

          <h2 className="
            text-2xl
            font-bold
          ">
            {title}
          </h2>

          <button
            onClick={
              onClose
            }
            className="
              w-10
              h-10
              rounded-xl
              bg-white/5
              hover:bg-red-500
              transition
              flex
              items-center
              justify-center
            "
          >

            <X size={18} />

          </button>

        </div>

        {/* BODY */}

        <div className="
          p-6
          space-y-6
        ">

          <input
            autoFocus
            type="text"
            value={value}
            onChange={(e) =>
              setValue(
                e.target.value
              )
            }
            placeholder={
              placeholder
            }
            className="
              w-full
              bg-slate-800
              border
              border-white/10
              rounded-2xl
              px-5
              py-4
              outline-none
              text-white
            "
          />

          <div className="
            flex
            justify-end
            gap-4
          ">

            <button
              onClick={
                onClose
              }
              className="
                px-5
                py-3
                rounded-2xl
                bg-slate-700
                hover:bg-slate-600
                transition
                font-semibold
              "
            >
              Cancel
            </button>

            <button
              onClick={() => {

                if (
                  !value.trim()
                ) {
                  return;
                }

                onConfirm(
                  value.trim()
                );
              }}
              className="
                px-5
                py-3
                rounded-2xl
                bg-blue-600
                hover:bg-blue-700
                transition
                font-semibold
              "
            >
              {confirmText}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}