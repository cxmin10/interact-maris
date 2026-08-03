const events = [
  {
    title: "Ședință InteractMureș",
    date: "10 August 2026",
    description: "Întâlnirea lunară a membrilor clubului.",
  },
  {
    title: "Proiect comunitar",
    date: "18 August 2026",
    description: "Activitate de voluntariat organizată de club.",
  },
  {
    title: "Eveniment caritabil",
    date: "25 August 2026",
    description: "Acțiune pentru sprijinirea comunității.",
  },
];

export default function Events() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="mb-10 text-center text-4xl font-bold text-blue-700">
        Evenimente InteractMureș
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        {events.map((event, index) => (
          <div
            key={index}
            className="rounded-2xl bg-white p-6 shadow-lg transition hover:-translate-y-1"
          >
            <h2 className="mb-3 text-xl font-bold text-blue-700">
              {event.title}
            </h2>

            <p className="mb-3 font-semibold text-yellow-600">
              {event.date}
            </p>

            <p className="text-gray-600">
              {event.description}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}