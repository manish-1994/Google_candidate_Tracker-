import ExcelUploader from "../components/ExcelUploader";

export default function Sheets() {

  return (

    <div className="space-y-6">

      <h1 className="
        text-4xl
        font-bold
      ">
        Excel Sheets
      </h1>

      <ExcelUploader />

    </div>

  );
}