import { useState } from "react";
import api from "../api/axios";

export default function ChangePasswordModal({
  targetUser,
  currentUser,
  onClose,
}) {
  const changingOwnPassword =
    Number(targetUser.id) === Number(currentUser.id);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function updateForm(field, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setSuccess(false);

    if (form.newPassword.length < 6) {
      setMessage("Parola nouă trebuie să aibă minimum 6 caractere.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setMessage("Parolele noi nu coincid.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.put(
        `/users/${targetUser.id}/password`,
        {
          currentPassword: changingOwnPassword
            ? form.currentPassword
            : undefined,
          newPassword: form.newPassword,
        }
      );

      setSuccess(true);
      setMessage(
        response.data.message || "Parola a fost modificată."
      );

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setSuccess(false);
      setMessage(
        error.response?.data?.message ||
          "Parola nu a putut fi modificată."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Schimbă parola
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {changingOwnPassword
                ? "Modifică parola contului tău."
                : `Modifică parola pentru ${targetUser.firstName} ${targetUser.lastName}.`}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-600 hover:bg-gray-200"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {changingOwnPassword && (
            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Parola actuală
              </label>

              <input
                type="password"
                value={form.currentPassword}
                onChange={(event) =>
                  updateForm(
                    "currentPassword",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-blue-700"
                required
              />
            </div>
          )}

          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Parola nouă
            </label>

            <input
              type="password"
              value={form.newPassword}
              onChange={(event) =>
                updateForm("newPassword", event.target.value)
              }
              className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-blue-700"
              minLength={6}
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Confirmă parola nouă
            </label>

            <input
              type="password"
              value={form.confirmPassword}
              onChange={(event) =>
                updateForm(
                  "confirmPassword",
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-blue-700"
              minLength={6}
              required
            />
          </div>

          {message && (
            <div
              className={`rounded-xl p-4 font-medium ${
                success
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-300"
            >
              Închide
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
            >
              {loading
                ? "Se modifică..."
                : "Salvează parola"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}