import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleRegister(event) {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      setSuccess(false);
      setMessage("Parolele nu coincid.");
      return;
    }

    if (form.password.length < 6) {
      setSuccess(false);
      setMessage("Parola trebuie să aibă cel puțin 6 caractere.");
      return;
    }

    try {
      setLoading(true);
      setSuccess(false);
      setMessage("");

      await api.post("/auth/register", {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

    setSuccess(true);

setMessage(
  "Contul a fost creat. Un administrator trebuie să îl aprobe înainte să te poți autentifica."
);

window.setTimeout(() => {
  navigate("/login");
}, 2500);

      window.setTimeout(() => {
        navigate("/login");
      }, 1400);
    } catch (error) {
      setSuccess(false);
      setMessage(
        error.response?.data?.message ||
          "Contul nu a putut fi creat."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07172f] px-6 py-16">
      <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-yellow-400/10 blur-3xl" />

      <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur-xl">
        <Link
          to="/login"
          className="mb-8 inline-block text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          ← Înapoi la autentificare
        </Link>

        <h1 className="text-4xl font-bold text-blue-800">
          Creează cont
        </h1>

        <p className="mt-2 text-gray-500">
          Înregistrează-te în platforma Interact Maris.
        </p>

        <form onSubmit={handleRegister} className="mt-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Prenume
              </label>

              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-700"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Nume
              </label>

              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-700"
                required
              />
            </div>
          </div>

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
              minLength={6}
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Confirmă parola
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-700"
              minLength={6}
              required
            />
          </div>

          {message && (
            <div
              className={`rounded-xl p-4 font-medium ${
                success
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-700 py-3 font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Se creează contul..." : "Înregistrare"}
          </button>
        </form>
      </div>
    </main>
  );
}
