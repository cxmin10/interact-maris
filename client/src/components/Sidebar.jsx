import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const [open, setOpen] = useState(false);

  if (!user) {
    return null;
  }

  const menu = [
    {
      title: "Dashboard",
      path:
        user.role === "ADMIN"
          ? "/admin-dashboard"
          : "/dashboard",
    },
    {
      title: "Evenimente",
      path: "/events",
    },
    {
      title: "Cotizații",
      path: "/fees",
    },
    {
      title: "Profil",
      path: `/profile/${user.id}`,
    },
  ];

  if (user.role === "ADMIN") {
    menu.splice(
      2,
      0,
      {
        title: "Membri",
        path: "/members",
      },
      {
        title: "Eveniment nou",
        path: "/create-event",
      }
    );
  }

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      {/* BUTON MOBIL */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-2 z-[70] flex h-12 w-12 items-center justify-center rounded-xl bg-blue-950 text-white shadow-xl lg:hidden"
        aria-label="Deschide meniul"
      >
        <Menu size={26} />
      </button>

      {/* FUNDAL ÎNCHIS PE MOBIL */}
      {open && (
        <div
          className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={closeMenu}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-[90]
          flex h-screen w-64 flex-col
          bg-blue-950 text-white shadow-xl
          transition-transform duration-300
          lg:translate-x-0
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="flex items-start justify-between border-b border-white/10 p-6">
          <Link
            to={
              user.role === "ADMIN"
                ? "/admin-dashboard"
                : "/dashboard"
            }
            onClick={closeMenu}
          >
            <h1 className="text-2xl font-bold">
              Interact Maris
            </h1>

            <p className="mt-1 text-xs uppercase tracking-[0.25em] text-blue-300">
              Platformă membri
            </p>
          </Link>

          {/* X DOAR PE MOBIL */}
          <button
            type="button"
            onClick={closeMenu}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white lg:hidden"
            aria-label="Închide meniul"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {menu.map((item) => {
            const active =
              location.pathname === item.path ||
              (item.path === "/events" &&
                location.pathname.startsWith("/events"));

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={`mb-2 block rounded-xl px-4 py-3 font-medium transition ${
                  active
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-blue-100 hover:bg-blue-900 hover:text-white"
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <p className="truncate font-semibold">
            {user.firstName} {user.lastName}
          </p>

          <p className="mt-1 text-sm text-blue-300">
            {user.role === "ADMIN"
              ? "Administrator"
              : "Membru"}
          </p>
        </div>
      </aside>
    </>
  );
}