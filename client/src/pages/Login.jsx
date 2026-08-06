import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleLogin(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await api.post("/auth/login", form);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      if (response.data.user.role === "ADMIN") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    }  catch (error) {
  setMessage(
    error.response?.data?.message ||
      "Email sau parolă incorectă."
  );
} finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07172f] px-6 py-16">
      <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-yellow-400/10 blur-3xl" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur-xl">
        <Link
          to="/"
          className="mb-8 inline-block text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          ← Înapoi la pagina principală
        </Link>

        <h1 className="text-4xl font-bold text-blue-800">
          Autentificare
        </h1>

        <p className="mt-2 text-gray-500">
          Intră în contul tău Interact Maris.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-700"
              placeholder="exemplu@email.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Parolă
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-700"
              placeholder="Parola ta"
              minLength={6}
              required
            />
          </div>

          {message && (
            <div className="rounded-xl bg-red-100 p-4 font-medium text-red-700">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-700 py-3 font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Se autentifică..." : "Autentificare"}
          </button>
        </form>

        <div className="mt-7 border-t border-gray-200 pt-6 text-center">
          <p className="text-gray-600">
            Nu ai încă un cont?
          </p>

          <Link
            to="/register"
            className="mt-3 inline-flex w-full items-center justify-center rounded-xl border-2 border-blue-700 px-5 py-3 font-bold text-blue-700 transition hover:bg-blue-700 hover:text-white"
          >
            Creează cont
          </Link>
        </div>
      </div>
    </main>
  );
}
