import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [fees, setFees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setMessage("");

      const [
        eventsResponse,
        membersResponse,
        feesResponse,
      ] = await Promise.all([
        api.get("/events"),
        api.get("/users"),
        api.get("/fees"),
      ]);

      setEvents(eventsResponse.data || []);
      setMembers(membersResponse.data || []);
      setFees(feesResponse.data || []);
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Dashboard-ul administratorului nu a putut fi încărcat."
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

  const activeMembers = members.filter(
    (member) =>
      member.role === "MEMBER" &&
      member.isActive
  );

  const pendingMembers = members.filter(
    (member) =>
      member.role === "MEMBER" &&
      !member.isActive
  );

  const paidFees = fees.filter(
    (fee) => fee.paid
  );

  const unpaidFees = fees.filter(
    (fee) => !fee.paid
  );

  const now = new Date();

  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= now)
    .sort(
      (firstEvent, secondEvent) =>
        new Date(firstEvent.date) -
        new Date(secondEvent.date)
    );

  const nextEvents = upcomingEvents.slice(0, 4);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-blue-800">
          Dashboard Administrator
        </h1>

        <p className="mt-2 text-gray-500">
          Situația actuală a platformei Interact Maris.
        </p>
      </div>

      {message && (
        <div className="mb-7 rounded-xl bg-red-100 p-4 font-medium text-red-700">
          {message}
        </div>
      )}

      <div className="mb-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-blue-700 p-6 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-200">
            Evenimente
          </p>

          <p className="mt-4 text-5xl font-bold">
            {events.length}
          </p>

          <p className="mt-3 text-sm text-blue-100">
            {upcomingEvents.length} viitoare
          </p>
        </div>

        <div className="rounded-2xl bg-green-600 p-6 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-100">
            Membri activi
          </p>

          <p className="mt-4 text-5xl font-bold">
            {activeMembers.length}
          </p>

          <p className="mt-3 text-sm text-green-100">
            {pendingMembers.length} în așteptare
          </p>
        </div>

        <div className="rounded-2xl bg-yellow-500 p-6 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-yellow-100">
            Cotizații plătite
          </p>

          <p className="mt-4 text-5xl font-bold">
            {paidFees.length}
          </p>
        </div>

        <div className="rounded-2xl bg-red-600 p-6 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-red-100">
            Restanțe
          </p>

          <p className="mt-4 text-5xl font-bold">
            {unpaidFees.length}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Link
          to="/members"
          className="rounded-2xl bg-white p-7 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
        >
          <h2 className="text-2xl font-bold text-blue-700">
            Membri
          </h2>

          <p className="mt-3 text-gray-600">
            Gestionează membrii și aprobă conturile noi.
          </p>

          {pendingMembers.length > 0 && (
            <span className="mt-5 inline-block rounded-full bg-yellow-100 px-4 py-2 font-bold text-yellow-700">
              {pendingMembers.length} conturi așteaptă aprobarea
            </span>
          )}
        </Link>

        <Link
          to="/events"
          className="rounded-2xl bg-white p-7 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
        >
          <h2 className="text-2xl font-bold text-blue-700">
            Evenimente
          </h2>

          <p className="mt-3 text-gray-600">
            Gestionează evenimentele și prezențele.
          </p>

          <span className="mt-5 inline-block rounded-full bg-blue-100 px-4 py-2 font-bold text-blue-700">
            {upcomingEvents.length} evenimente viitoare
          </span>
        </Link>

        <Link
          to="/fees"
          className="rounded-2xl bg-white p-7 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
        >
          <h2 className="text-2xl font-bold text-blue-700">
            Cotizații
          </h2>

          <p className="mt-3 text-gray-600">
            Gestionează plățile și cotizațiile restante.
          </p>

          <span className="mt-5 inline-block rounded-full bg-red-100 px-4 py-2 font-bold text-red-700">
            {unpaidFees.length} cotizații restante
          </span>
        </Link>

        <Link
          to="/create-event"
          className="rounded-2xl bg-white p-7 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
        >
          <h2 className="text-2xl font-bold text-blue-700">
            Eveniment nou
          </h2>

          <p className="mt-3 text-gray-600">
            Creează rapid un eveniment nou.
          </p>
        </Link>
      </div>

      <section className="mt-10 rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              Următoarele evenimente
            </h2>

            <p className="mt-1 text-gray-500">
              Evenimentele programate în perioada următoare.
            </p>
          </div>

          <Link
            to="/events"
            className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Vezi toate
          </Link>
        </div>

        {nextEvents.length === 0 ? (
          <div className="rounded-2xl bg-gray-50 p-8 text-center text-gray-500">
            Nu există evenimente viitoare.
          </div>
        ) : (
          <div className="space-y-4">
            {nextEvents.map((event) => (
              <article
                key={event.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 p-5"
              >
                <div>
                  <h3 className="text-xl font-bold text-blue-800">
                    {event.title}
                  </h3>

                  <p className="mt-2 text-gray-600">
                    {new Date(event.date).toLocaleString(
                      "ro-RO",
                      {
                        dateStyle: "long",
                        timeStyle: "short",
                      }
                    )}
                  </p>

                  <p className="mt-1 text-gray-500">
                    {event.location ||
                      "Locație nespecificată"}
                  </p>
                </div>

                <span className="rounded-full bg-blue-100 px-4 py-2 font-bold text-blue-700">
                  {event.participantsCount ?? 0} participanți
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}