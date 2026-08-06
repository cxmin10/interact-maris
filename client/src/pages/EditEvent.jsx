import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
  });

  useEffect(() => {
    loadEvent();
  }, []);

  async function loadEvent() {
    try {
      const response = await api.get(`/events/${id}`);

      const event = response.data;

      setForm({
        title: event.title,
        description: event.description || "",
        location: event.location || "",
        date: event.date.slice(0, 16),
      });

      setLoading(false);
    } catch (error) {
      alert("Evenimentul nu există.");
      navigate("/events");
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.put(`/events/${id}`, form);

      alert("Eveniment actualizat.");

      navigate("/events");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Evenimentul nu a putut fi actualizat."
      );
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-xl">
        Se încarcă...
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="mb-8 text-4xl font-bold text-blue-700">
          Editează eveniment
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block font-semibold">
              Titlu
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-xl border p-4"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Descriere
            </label>

            <textarea
              rows={5}
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-xl border p-4"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Locație
            </label>

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full rounded-xl border p-4"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Data și ora
            </label>

            <input
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full rounded-xl border p-4"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              className="rounded-xl bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800"
            >
              Salvează modificările
            </button>

            <button
              type="button"
              onClick={() => navigate("/events")}
              className="rounded-xl bg-gray-300 px-6 py-3 font-bold"
            >
              Anulează
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}