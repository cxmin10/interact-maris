import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  function logout() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <nav className="bg-blue-700 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link
          to="/dashboard"
          className="text-2xl font-bold text-white"
        >
          Interact Maris
        </Link>

        <div className="flex items-center gap-5">

          <Link
            to="/dashboard"
            className="text-white hover:text-yellow-300"
          >
            Dashboard
          </Link>

          <Link
            to="/events"
            className="text-white hover:text-yellow-300"
          >
            Evenimente
          </Link>

          {user?.role === "ADMIN" && (
            <>
              <Link
                to="/members"
                className="text-white hover:text-yellow-300"
              >
                Membri
              </Link>

              <Link
                to="/fees"
                className="text-white hover:text-yellow-300"
              >
                Cotizații
              </Link>
            </>
          )}

          <Link
            to={`/profile/${user.id}`}
            className="text-white hover:text-yellow-300"
          >
            Profil
          </Link>

          <button
            onClick={logout}
            className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
          >
            Logout
          </button>

        </div>

      </div>
    </nav>
  );
}