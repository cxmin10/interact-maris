import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold">
          Interact<span className="text-yellow-300">Mureș</span>
        </Link>
<div className="flex items-center gap-6">
  <Link to="/" className="hover:text-yellow-300 transition-colors">
    Acasă
  </Link>

  <Link to="/events" className="hover:text-yellow-300 transition-colors">
    EVENIMENTE TEST
  </Link>

  <Link
    to="/login"
    className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-blue-900 hover:bg-yellow-300 transition-colors"
  >
    LOGIN TEST
  </Link>
</div>
      </div>
    </nav>
  );
}