import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Dashboard() {
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [events, setEvents] = useState([]);
  const [fees, setFees] = useState([]);
  const [attendances, setAttendances] =
    useState([]);
  const [absences, setAbsences] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setMessage("");

      const [
        eventsResponse,
        feesResponse,
        attendancesResponse,
        absencesResponse,
      ] = await Promise.all([
        api.get("/events"),
        api.get(`/fees/user/${user.id}`),
        api.get(
          `/attendance/user/${user.id}`
        ),
        api.get(
          `/absences/user/${user.id}`
        ),
      ]);

      setEvents(
        eventsResponse.data || []
      );

      setFees(
        feesResponse.data || []
      );

      setAttendances(
        attendancesResponse.data || []
      );

      setAbsences(
        absencesResponse.data || []
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Dashboard-ul nu a putut fi încărcat."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-lg text-gray-500">
        Se încarcă dashboard-ul...
      </div>
    );
  }

  const now = new Date();

  const upcomingEvents = events
    .filter(
      (event) =>
        new Date(event.date) >= now
    )
    .sort(
      (
        firstEvent,
        secondEvent
      ) =>
        new Date(firstEvent.date) -
        new Date(secondEvent.date)
    );

  const nextEvents =
    upcomingEvents.slice(0, 3);

  const paidFees =
    fees.filter(
      (fee) => fee.paid
    );

  const unpaidFees =
    fees.filter(
      (fee) => !fee.paid
    );

  const presentCount =
    attendances.filter(
      (attendance) =>
        attendance.status ===
          "PRESENT" &&
        !attendance.cancelledAt
    ).length;

  // NOUL SISTEM DE ABSENȚE
  const excusedCount =
    absences.filter(
      (absence) =>
        absence.type ===
        "EXCUSED"
    ).length;

  const unexcusedCount =
    absences.filter(
      (absence) =>
        absence.type ===
        "UNEXCUSED"
    ).length;

  const totalAbsences =
    excusedCount +
    unexcusedCount;

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-blue-800">
          Bun venit,{" "}
          {user?.firstName}!
        </h1>

        <p className="mt-2 text-gray-500">
          Aici găsești situația
          contului tău Interact Maris.
        </p>
      </div>

      {message && (
        <div className="mb-7 rounded-xl bg-red-100 p-4 font-medium text-red-700">
          {message}
        </div>
      )}

      <div className="mb-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

        <div className="rounded-2xl bg-blue-700 p-6 text-white shadow-xl">
          <p className="text-sm uppercase tracking-wider text-blue-200">
            Evenimente viitoare
          </p>

          <p className="mt-4 text-5xl font-bold">
            {
              upcomingEvents.length
            }
          </p>
        </div>

        <div className="rounded-2xl bg-green-600 p-6 text-white shadow-xl">
          <p className="text-sm uppercase tracking-wider text-green-100">
            Cotizații plătite
          </p>

          <p className="mt-4 text-5xl font-bold">
            {paidFees.length}
          </p>
        </div>

        <div className="rounded-2xl bg-red-600 p-6 text-white shadow-xl">
          <p className="text-sm uppercase tracking-wider text-red-100">
            Cotizații restante
          </p>

          <p className="mt-4 text-5xl font-bold">
            {unpaidFees.length}
          </p>
        </div>

        <div className="rounded-2xl bg-emerald-600 p-6 text-white shadow-xl">
          <p className="text-sm uppercase tracking-wider text-emerald-100">
            Participări
          </p>

          <p className="mt-4 text-5xl font-bold">
            {presentCount}
          </p>
        </div>

        <div className="rounded-2xl bg-yellow-500 p-6 text-white shadow-xl">
          <p className="text-sm uppercase tracking-wider text-yellow-100">
            Absențe motivate
          </p>

          <p className="mt-4 text-5xl font-bold">
            {excusedCount}
          </p>
        </div>

        <div className="rounded-2xl bg-orange-600 p-6 text-white shadow-xl">
          <p className="text-sm uppercase tracking-wider text-orange-100">
            Absențe nemotivate
          </p>

          <p className="mt-4 text-5xl font-bold">
            {unexcusedCount}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-700 p-6 text-white shadow-xl sm:col-span-2 xl:col-span-3">
          <p className="text-sm uppercase tracking-wider text-slate-200">
            Total absențe
          </p>

          <p className="mt-4 text-5xl font-bold">
            {totalAbsences}
          </p>
        </div>

      </div>

      <section className="rounded-3xl bg-white p-8 shadow-xl">

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

          <div>
            <h2 className="text-2xl font-bold">
              Următoarele evenimente
            </h2>

            <p className="mt-1 text-gray-500">
              Evenimentele care
              urmează în club.
            </p>
          </div>

          <Link
            to="/events"
            className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Vezi toate evenimentele
          </Link>

        </div>

        {nextEvents.length === 0 ? (
          <div className="rounded-2xl bg-gray-50 p-8 text-center text-gray-500">
            Nu există evenimente
            viitoare.
          </div>
        ) : (
          <div className="space-y-4">

            {nextEvents.map(
              (event) => (
                <article
                  key={event.id}
                  className="rounded-2xl border border-gray-200 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">

                    <div>
                      <h3 className="text-xl font-bold text-blue-800">
                        {event.title}
                      </h3>

                      <p className="mt-2 text-gray-600">
                        {new Date(
                          event.date
                        ).toLocaleString(
                          "ro-RO",
                          {
                            dateStyle:
                              "long",
                            timeStyle:
                              "short",
                          }
                        )}
                      </p>

                      <p className="mt-1 text-gray-500">
                        {event.location ||
                          "Locație nespecificată"}
                      </p>
                    </div>

                    <span className="rounded-full bg-blue-100 px-4 py-2 font-bold text-blue-700">
                      {event.participantsCount ??
                        0}{" "}
                      participanți
                    </span>

                  </div>
                </article>
              )
            )}

          </div>
        )}

      </section>
    </main>
  );
}