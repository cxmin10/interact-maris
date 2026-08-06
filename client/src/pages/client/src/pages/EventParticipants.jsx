import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function EventParticipants() {
  const { id } = useParams();

  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    loadParticipants();
  }, []);

  async function loadParticipants() {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/attendance/${id}`
      );

      setParticipants(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="mb-10 text-center text-4xl font-bold text-blue-700">
        Participanți
      </h1>

      {participants.length === 0 ? (
        <p className="text-center text-gray-500">
          Nu există participanți.
        </p>
      ) : (
        <div className="space-y-4">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="rounded-xl bg-white p-6 shadow"
            >
              <h2 className="text-xl font-bold">
                {participant.user.firstName} {participant.user.lastName}
              </h2>

              <p className="mt-2">
                📧 {participant.user.email}
              </p>

              <p className="mt-2">
                Status: <b>{participant.status}</b>
              </p>

              {participant.reason && (
                <p className="mt-2 text-red-600">
                  Motiv: {participant.reason}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}