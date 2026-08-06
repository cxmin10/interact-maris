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

      <div className="flex">
        <Sidebar />

        <main className="ml-64 w-full min-h-screen bg-slate-100 p-8">
          {children}
        </main>
      </div>
    </>
  );
}