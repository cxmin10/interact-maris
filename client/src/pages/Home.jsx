export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-6 text-5xl font-bold text-blue-700">
        Bine ai venit la InteractMureș!
      </h2>

      <p className="max-w-2xl text-lg text-gray-700">
        Platforma oficială pentru membrii clubului.
      </p>

      <div className="mt-10 flex gap-4">
        <button className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800">
          Vezi evenimente
        </button>

        <button className="rounded-lg border border-blue-700 px-6 py-3 font-semibold text-blue-700 hover:bg-blue-50">
          Află mai multe
        </button>
      </div>
    </main>
  );
}