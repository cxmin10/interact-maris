import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const statusConfig = {
  PRESENT: {
    label: "Prezent",
    classes: "bg-green-100 text-green-700",
  },
  EXCUSED: {
    label: "Absent motivat",
    classes: "bg-yellow-100 text-yellow-700",
  },
  ABSENT: {
    label: "Absent nemotivat",
    classes: "bg-red-100 text-red-700",
  },
};

export default function EventParticipants() {
  const { id } = useParams();

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadParticipants();
  }, [id]);

  async function loadParticipants() {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get(`/attendance/${id}`);

      setParticipants(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Participanții nu au putut fi încărcați."
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(attendanceId, status) {
    try {
      setSavingId(attendanceId);
      setMessage("");

      await api.put(
        `/attendance/${attendanceId}/status`,
        {
          status,
        }
      );

      setParticipants((currentParticipants) =>
        currentParticipants.map((participant) =>
          participant.id === attendanceId
            ? {
                ...participant,
                status,
              }
            : participant
        )
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Statusul nu a putut fi actualizat."
      );
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">
        Se încarcă participanții...
      </div>
    );
  }

  const presentCount = participants.filter(
    (participant) => participant.status === "PRESENT"
  ).length;

  const excusedCount = participants.filter(
    (participant) => participant.status === "EXCUSED"
  ).length;

  const absentCount = participants.filter(
    (participant) => participant.status === "ABSENT"
  ).length;

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-blue-800">
          Prezența la eveniment
        </h1>

        <p className="mt-2 text-gray-500">
          Marchează prezențele și absențele membrilor.
        </p>
      </div>

      <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-blue-800 p-6 text-white">
          <p>Total înscriși</p>
          <p className="mt-3 text-4xl font-bold">
            {participants.length}
          </p>
        </div>

        <div className="rounded-2xl bg-green-600 p-6 text-white">
          <p>Prezenți</p>
          <p className="mt-3 text-4xl font-bold">
            {presentCount}
          </p>
        </div>

        <div className="rounded-2xl bg-yellow-500 p-6 text-white">
          <p>Absențe motivate</p>
          <p className="mt-3 text-4xl font-bold">
            {excusedCount}
          </p>
        </div>

        <div className="rounded-2xl bg-red-600 p-6 text-white">
          <p>Absențe nemotivate</p>
          <p className="mt-3 text-4xl font-bold">
            {absentCount}
          </p>
        </div>
      </div>

      {message && (
        <div className="mb-6 rounded-xl bg-red-100 p-4 font-medium text-red-700">
          {message}
        </div>
      )}

      {participants.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center text-gray-500 shadow">
          Nu există membri înscriși.
        </div>
      ) : (
        <div className="space-y-5">
          {participants.map((participant) => {
            const currentStatus =
              statusConfig[participant.status] ||
              statusConfig.PRESENT;

            return (
              <article
                key={participant.id}
                className="rounded-2xl bg-white p-6 shadow-lg"
              >
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {participant.user.firstName}{" "}
                      {participant.user.lastName}
                    </h2>

                    <p className="mt-1 text-gray-500">
                      {participant.user.email}
                    </p>

                    <span
                      className={`mt-4 inline-block rounded-full px-4 py-2 font-bold ${currentStatus.classes}`}
                    >
                      {currentStatus.label}
                    </span>

                    {participant.cancelledAt && (
                      <div className="mt-4 rounded-xl bg-gray-100 p-4">
                        <p className="font-semibold text-gray-700">
                          Retras din eveniment
                        </p>

                        <p className="mt-1 text-gray-600">
                          Motiv:{" "}
                          {participant.reason ||
                            "Motiv nespecificat"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={savingId === participant.id}
                      onClick={() =>
                        updateStatus(
                          participant.id,
                          "PRESENT"
                        )
                      }
                      className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Prezent
                    </button>

                    <button
                      type="button"
                      disabled={savingId === participant.id}
                      onClick={() =>
                        updateStatus(
                          participant.id,
                          "EXCUSED"
                        )
                      }
                      className="rounded-xl bg-yellow-500 px-5 py-3 font-semibold text-white hover:bg-yellow-600 disabled:opacity-50"
                    >
                      Motivează absența
                    </button>

                    <button
                      type="button"
                      disabled={savingId === participant.id}
                      onClick={() =>
                        updateStatus(
                          participant.id,
                          "ABSENT"
                        )
                      }
                      className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      Absent nemotivat
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}