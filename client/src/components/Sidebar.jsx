import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

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

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-blue-950 text-white shadow-xl">
      <div className="border-b border-white/10 p-6">
        <Link
          to={
            user.role === "ADMIN"
              ? "/admin-dashboard"
              : "/dashboard"
          }
        >
          <h1 className="text-2xl font-bold">
            Interact Maris
          </h1>

          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-blue-300">
            Platformă membri
          </p>
        </Link>
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
  );
}