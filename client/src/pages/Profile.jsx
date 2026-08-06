import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import ChangePasswordModal from "../components/ChangePasswordModal";

const statusLabels = {
  PRESENT: "Prezent",
  EXCUSED: "Absent motivat",
  ABSENT: "Absent nemotivat",
};

export default function Profile() {
  const { id } = useParams();

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordModalOpen, setPasswordModalOpen] =
  useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    photo: "",
    description: "",
  });

  useEffect(() => {
    loadProfile();
  }, [id]);

  async function loadProfile() {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get(`/profile/${id}`);

      setUser(response.data);

      setForm({
        firstName: response.data.firstName || "",
        lastName: response.data.lastName || "",
        photo: response.data.photo || "",
        description: response.data.description || "",
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Profilul nu a putut fi încărcat."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateForm(field, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function cancelEditing() {
    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      photo: user.photo || "",
      description: user.description || "",
    });

    setEditing(false);
    setMessage("");
  }

  async function saveProfile() {
    try {
      setSaving(true);
      setMessage("");

      await api.put(`/profile/${id}`, form);

      setMessage("Profilul a fost actualizat.");
      setEditing(false);

      await loadProfile();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Profilul nu a putut fi actualizat."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-lg text-gray-500">
        Se încarcă profilul...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-20 text-center text-red-600">
        Profilul nu există.
      </div>
    );
  }

  const attendances = user.attendances || [];
  const fees = user.fees || [];
  const presentCount = attendances.filter(
  (attendance) => attendance.status === "PRESENT"
).length;

const excusedCount = attendances.filter(
  (attendance) => attendance.status === "EXCUSED"
).length;

const absentCount = attendances.filter(
  (attendance) => attendance.status === "ABSENT"
).length;

const totalAbsences = excusedCount + absentCount;

  return (
    <>
      <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="h-44 bg-gradient-to-r from-blue-950 via-blue-800 to-blue-600" />

        <div className="relative px-8 pb-10">
          <img
            src={
              user.photo ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                `${user.firstName} ${user.lastName}`
              )}&background=17458F&color=ffffff&size=256`
            }
            alt={`${user.firstName} ${user.lastName}`}
            className="-mt-20 h-40 w-40 rounded-full border-8 border-white object-cover shadow-xl"
          />

          <div className="mt-6 flex flex-wrap items-start justify-between gap-5">
            <div>
              <h1 className="text-4xl font-bold text-blue-800">
                {user.firstName} {user.lastName}
              </h1>

              <p className="mt-2 text-gray-500">{user.email}</p>

              <span className="mt-4 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
                {user.role === "ADMIN"
                  ? "Administrator"
                  : "Membru"}
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              {currentUser?.role === "ADMIN" && !editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
                >
                  Editează profilul
                </button>
              )}

              {(
                currentUser?.role === "ADMIN" ||
                Number(currentUser?.id) === Number(user.id)
              ) && (
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(true)}
                  className="rounded-xl bg-slate-800 px-6 py-3 font-semibold text-white hover:bg-slate-900"
                >
                  Schimbă parola
                </button>
              )}
            </div>
          </div>
          

          {message && (
            <div className="mt-6 rounded-xl bg-blue-50 p-4 font-medium text-blue-700">
              {message}
            </div>
          )}

          {editing ? (
            <div className="mt-8 space-y-5 rounded-2xl bg-gray-50 p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Prenume
                  </label>

                  <input
                    value={form.firstName}
                    onChange={(event) =>
                      updateForm("firstName", event.target.value)
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white p-4 outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Nume
                  </label>

                  <input
                    value={form.lastName}
                    onChange={(event) =>
                      updateForm("lastName", event.target.value)
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white p-4 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  URL fotografie
                </label>

                <input
                  value={form.photo}
                  onChange={(event) =>
                    updateForm("photo", event.target.value)
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl border border-gray-300 bg-white p-4 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Descriere
                </label>

                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(event) =>
                    updateForm("description", event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white p-4 outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={saving}
                  className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? "Se salvează..." : "Salvează"}
                </button>

                <button
                  type="button"
                  onClick={cancelEditing}
                  className="rounded-xl bg-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-300"
                >
                  Anulează
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-2xl bg-gray-50 p-6">
              <h2 className="text-2xl font-bold">Despre</h2>

              <p className="mt-4 leading-7 text-gray-600">
                {user.description || "Nu există descriere."}
              </p>
            </div>
          )}

          <section className="mt-10">
  <h2 className="mb-5 text-2xl font-bold">
    Statistici prezență
  </h2>

  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <div className="rounded-2xl bg-green-50 p-5">
      <p className="text-sm text-gray-500">
        Participări
      </p>

      <p className="mt-2 text-3xl font-bold text-green-700">
        {presentCount}
      </p>
    </div>

    <div className="rounded-2xl bg-yellow-50 p-5">
      <p className="text-sm text-gray-500">
        Absențe motivate
      </p>

      <p className="mt-2 text-3xl font-bold text-yellow-700">
        {excusedCount}
      </p>
    </div>

    <div className="rounded-2xl bg-red-50 p-5">
      <p className="text-sm text-gray-500">
        Absențe nemotivate
      </p>

      <p className="mt-2 text-3xl font-bold text-red-700">
        {absentCount}
      </p>
    </div>

    <div className="rounded-2xl bg-gray-100 p-5">
      <p className="text-sm text-gray-500">
        Total absențe
      </p>

      <p className="mt-2 text-3xl font-bold text-gray-800">
        {totalAbsences}
      </p>
    </div>
  </div>
</section>

          <section className="mt-10">
            <h2 className="mb-5 text-2xl font-bold">
              Participări
            </h2>

            {attendances.length === 0 ? (
              <div className="rounded-2xl bg-gray-50 p-6 text-gray-500">
                Nu există participări înregistrate.
              </div>
            ) : (
              <div className="space-y-4">
                {attendances.map((attendance) => (
                  <div
                    key={attendance.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gray-50 p-5"
                  >
                    <div>
                      <h3 className="font-bold">
                        {attendance.event?.title ||
                          "Eveniment"}
                      </h3>

                      {attendance.event?.date && (
                        <p className="mt-1 text-sm text-gray-500">
                          {new Date(
                            attendance.event.date
                          ).toLocaleDateString("ro-RO")}
                        </p>
                      )}
                    </div>

                    <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
                      {statusLabels[attendance.status] ||
                        attendance.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mt-10">
            <h2 className="mb-5 text-2xl font-bold">
              Cotizații
            </h2>

            {fees.length === 0 ? (
              <div className="rounded-2xl bg-gray-50 p-6 text-gray-500">
                Nu există cotizații înregistrate.
              </div>
            ) : (
              <div className="space-y-4">
                {fees.map((fee) => (
                  <div
                    key={fee.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gray-50 p-5"
                  >
                    <div>
                      <h3 className="font-bold">
                        {fee.month}/{fee.year}
                      </h3>

                      {fee.paidAt && (
                        <p className="mt-1 text-sm text-gray-500">
                          Plătită la{" "}
                          {new Date(
                            fee.paidAt
                          ).toLocaleDateString("ro-RO")}
                        </p>
                      )}
                    </div>

                    <span
                      className={`rounded-full px-4 py-2 text-sm font-bold ${
                        fee.paid
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {fee.paid ? "Plătită" : "Neplătită"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      </main>

      {passwordModalOpen && (
        <ChangePasswordModal
          targetUser={user}
          currentUser={currentUser}
          onClose={() => setPasswordModalOpen(false)}
        />
      )}
    </>
  );
}