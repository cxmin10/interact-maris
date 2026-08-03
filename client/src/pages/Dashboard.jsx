export default function Dashboard() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="mb-8 text-4xl font-bold text-blue-700">
        Bun venit în contul tău 👋
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-700">
            Cotizație
          </h2>

          <p className="mt-4 text-2xl font-bold text-green-600">
            Plătită ✓
          </p>
        </div>


        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-700">
            Absențe
          </h2>

          <p className="mt-4 text-2xl font-bold text-red-500">
            2
          </p>
        </div>


        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-700">
            Evenimente viitoare
          </h2>

          <p className="mt-4 text-gray-600">
            3 evenimente programate
          </p>
        </div>

      </div>
    </main>
  );
}