import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Events() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [myAttendances, setMyAttendances] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cancelModal, setCancelModal] = useState({
    open: false,
    eventId: null,
    reason: "",
  });

  const [cancelLoading, setCancelLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    setLoading(true);

    await loadEvents();

    if (user?.role === "MEMBER") {
      await loadMyAttendances();
    }

    setLoading(false);
  }

  async function loadEvents() {
    try {
      const response = await api.get("/events");
      setEvents(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadMyAttendances() {
    try {
      const response = await api.get(
        `/attendance/user/${user.id}`
      );

      setMyAttendances(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function registerToEvent(eventId) {
    try {
      await api.post("/attendance", {
        userId: user.id,
        eventId,
      });

      await Promise.all([
        loadEvents(),
        loadMyAttendances(),
      ]);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "A apărut o eroare la înscriere."
      );
    }
  }

  function openCancelModal(eventId) {
    setCancelModal({
      open: true,
      eventId,
      reason: "",
    });

    setModalMessage("");
  }

  function closeCancelModal() {
    if (cancelLoading) {
      return;
    }

    setCancelModal({
      open: false,
      eventId: null,
      reason: "",
    });

    setModalMessage("");
  }

  async function cancelAttendance() {
    const reason = cancelModal.reason.trim();

    if (!reason) {
      setModalMessage(
        "Te rugăm să scrii motivul retragerii."
      );
      return;
    }

    try {
      setCancelLoading(true);
      setModalMessage("");

      await api.put("/attendance/cancel", {
        userId: user.id,
        eventId: cancelModal.eventId,
        reason,
      });

      await Promise.all([
        loadEvents(),
        loadMyAttendances(),
      ]);

      closeCancelModal();
    } catch (error) {
      setModalMessage(
        error.response?.data?.message ||
          "Participarea nu a putut fi anulată."
      );
    } finally {
      setCancelLoading(false);
    }
  }

  async function deleteEvent(id) {
    const confirmed = window.confirm(
      "Sigur vrei să ștergi acest eveniment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/events/${id}`);
      await loadEvents();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Evenimentul nu a putut fi șters."
      );
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-lg text-gray-500">
        Se încarcă evenimentele...
      </div>
    );
  }

  return (
    <>
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-blue-700">
              Evenimente Interact Maris
            </h1>

            <p className="mt-2 text-gray-500">
              Activitățile și proiectele clubului
            </p>
          </div>

          {user?.role === "ADMIN" && (
            <button
              onClick={() => navigate("/create-event")}
              className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
            >
              Adaugă eveniment
            </button>
          )}
        </div>

        {events.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow">
            <p className="text-gray-500">
              Nu există evenimente momentan.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => {
              const registered = myAttendances.some(
                (attendance) =>
                  attendance.eventId === event.id &&
                  !attendance.cancelledAt
              );

              return (
                <article
                  key={event.id}
                  className="flex flex-col rounded-2xl bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <h2 className="text-2xl font-bold text-blue-700">
                    {event.title}
                  </h2>

                  <p className="mt-4 font-semibold text-yellow-600">
                    {new Date(event.date).toLocaleString(
                      "ro-RO",
                      {
                        dateStyle: "long",
                        timeStyle: "short",
                      }
                    )}
                  </p>

                  <p className="mt-3 text-gray-700">
                    Locație:{" "}
                    {event.location ||
                      "Locație nespecificată"}
                  </p>

                  <p className="mt-4 flex-1 text-gray-600">
                    {event.description || "Fără descriere"}
                  </p>

                  <div className="mt-5 rounded-xl bg-blue-50 p-3">
                    <span className="font-semibold text-blue-800">
                      Participanți înscriși:
                    </span>

                    <span className="ml-2 font-bold text-blue-700">
                      {event.participantsCount ?? 0}
                    </span>
                  </div>

                  {user?.role === "MEMBER" && (
                    <div className="mt-5">
                      {!registered ? (
                        <button
                          onClick={() =>
                            registerToEvent(event.id)
                          }
                          className="w-full rounded-xl bg-blue-700 py-3 font-bold text-white hover:bg-blue-800"
                        >
                          Participă
                        </button>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <button
                            disabled
                            className="w-full rounded-xl bg-green-600 py-3 font-bold text-white"
                          >
                            Înscris
                          </button>

                          <button
                            onClick={() =>
                              openCancelModal(event.id)
                            }
                            className="w-full rounded-xl bg-red-600 py-3 font-bold text-white hover:bg-red-700"
                          >
                            Nu mai particip
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {user?.role === "ADMIN" && (
                    <div className="mt-5 grid gap-3">
                      <button
                        onClick={() =>
                          navigate(
                            `/events/${event.id}/participants`
                          )
                        }
                        className="rounded-xl bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800"
                      >
                        Participanți (
                        {event.participantsCount ?? 0})
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/edit-event/${event.id}`)
                        }
                        className="rounded-xl bg-yellow-400 py-3 font-semibold text-gray-900 hover:bg-yellow-500"
                      >
                        Editează
                      </button>

                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700"
                      >
                        Șterge
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>

      {cancelModal.open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={closeCancelModal}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Retragere din eveniment
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Scrie motivul pentru care nu mai poți
                  participa.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCancelModal}
                disabled={cancelLoading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-600 hover:bg-gray-200"
                aria-label="Închide"
              >
                ×
              </button>
            </div>

            <textarea
              autoFocus
              rows={5}
              value={cancelModal.reason}
              onChange={(event) =>
                setCancelModal((currentModal) => ({
                  ...currentModal,
                  reason: event.target.value,
                }))
              }
              placeholder="Exemplu: Nu pot participa din motive personale..."
              className="mt-6 w-full resize-none rounded-2xl border border-gray-300 p-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />

            {modalMessage && (
              <div className="mt-4 rounded-xl bg-red-100 p-3 text-sm font-medium text-red-700">
                {modalMessage}
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeCancelModal}
                disabled={cancelLoading}
                className="rounded-xl bg-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-300 disabled:opacity-50"
              >
                Renunță
              </button>

              <button
                type="button"
                onClick={cancelAttendance}
                disabled={cancelLoading}
                className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancelLoading
                  ? "Se salvează..."
                  : "Confirmă retragerea"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}