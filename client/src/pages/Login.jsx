import { useNavigate } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-blue-700">
          Autentificare
        </h1>

        <p className="mb-8 text-center text-gray-600">
          Intră în contul tău InteractMureș
        </p>

        <form
  className="space-y-5"
  onSubmit={(e) => {
    e.preventDefault();
    navigate("/dashboard");
  }}
>
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              placeholder="exemplu@email.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-700"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Parolă
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-700"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            Autentificare
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Ai uitat parola?
        </p>
      </div>
    </div>
  );
}