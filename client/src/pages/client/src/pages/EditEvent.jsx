import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    loadEvent();
  }, []);

  async function loadEvent() {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/events/${id}`
      );

      const event = response.data;

      setTitle(event.title);
      setDescription(event.description || "");
      setLocation(event.location || "");
      setDate(event.date.slice(0, 16));
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/api/events/${id}`,
        {
          title,
          description,
          location,
          date,
        }
      );

      navigate("/events");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex justify-center py-12 px-6">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-blue-700">
          Editează eveniment
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            className="w-full rounded-lg border px-4 py-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titlu"
          />

          <textarea
            className="w-full rounded-lg border px-4 py-3"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descriere"
          />

          <input
            className="w-full rounded-lg border px-4 py-3"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Locație"
          />

          <input
            type="datetime-local"
            className="w-full rounded-lg border px-4 py-3"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white"
          >
            Salvează modificările
          </button>
        </form>
      </div>
    </div>
  );
}