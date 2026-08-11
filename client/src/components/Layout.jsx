import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return children;
  }

  return (
    <>
      <Navbar />

      <Sidebar />

      <main
        className="
          min-h-screen
          w-full
          bg-slate-100
          p-4
          pt-20
          sm:p-6
          sm:pt-20
          lg:ml-64
          lg:w-[calc(100%-16rem)]
          lg:p-8
          lg:pt-8
        "
      >
        {children}
      </main>
    </>
  );
}