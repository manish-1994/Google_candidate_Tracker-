import Sidebar from "../components/Sidebar";

export default function MainLayout({
  children,
}) {

  return (

    <div className="
      flex
      w-screen
      h-screen
      overflow-hidden
      text-white
    ">

      <Sidebar />

      <main className="
        flex-1
        overflow-auto
        p-8
      ">

        {children}

      </main>

    </div>

  );
}