import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CreateEvent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      await api.post("/events", form);

      navigate("/events");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Evenimentul nu a putut fi creat."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="mb-8 text-4xl font-bold text-blue-700">
          Creează eveniment
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Titlu
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-blue-600"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Descriere
            </label>

            <textarea
              name="description"
              rows="5"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Locație
            </label>

            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Data și ora
            </label>

            <input
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-blue-600"
              required
            />
          </div>

          {message && (
            <div className="rounded-xl bg-red-100 p-4 font-semibold text-red-700">
              {message}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-700 px-7 py-3 font-bold text-white hover:bg-blue-800 disabled:opacity-60"
            >
              {loading ? "Se salvează..." : "Creează eveniment"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/events")}
              className="rounded-xl bg-gray-200 px-7 py-3 font-bold text-gray-700 hover:bg-gray-300"
            >
              Anulează
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}