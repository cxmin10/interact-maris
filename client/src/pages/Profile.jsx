import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import ChangePasswordModal from "../components/ChangePasswordModal";

export default function Profile() {
  const { id } = useParams();

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const isAdmin =
    currentUser?.role === "ADMIN";

  const [user, setUser] = useState(null);
  const [absences, setAbsences] = useState([]);

  const [editing, setEditing] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [
    absenceLoading,
    setAbsenceLoading,
  ] = useState(false);

  const [
    deletingAbsence,
    setDeletingAbsence,
  ] = useState(null);

  const [message, setMessage] =
    useState("");

  const [
    passwordModalOpen,
    setPasswordModalOpen,
  ] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    photo: "",
    description: "",
  });

  useEffect(() => {
    loadPage();
  }, [id]);

  async function loadPage() {
    try {
      setLoading(true);
      setMessage("");

      const profileResponse =
        await api.get(
          `/profile/${id}`
        );

      const profile =
        profileResponse.data;

      setUser(profile);

      setForm({
        firstName:
          profile.firstName || "",
        lastName:
          profile.lastName || "",
        photo:
          profile.photo || "",
        description:
          profile.description || "",
      });

      try {
        const absencesResponse =
          await api.get(
            `/absences/user/${id}`
          );

        setAbsences(
          absencesResponse.data || []
        );
      } catch (absenceError) {
        console.error(
          "ABSENCES ERROR:",
          absenceError
        );

        setAbsences([]);
      }
    } catch (error) {
      console.error(
        "PROFILE ERROR:",
        error
      );

      setUser(null);

      setMessage(
        error.response?.data?.message ||
          "Profilul nu a putut fi încărcat."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadAbsences() {
    try {
      const response = await api.get(
        `/absences/user/${id}`
      );

      setAbsences(
        response.data || []
      );
    } catch (error) {
      console.error(
        "LOAD ABSENCES ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Absențele nu au putut fi încărcate."
      );
    }
  }

  function updateForm(
    field,
    value
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function cancelEditing() {
    if (!user) {
      return;
    }

    setForm({
      firstName:
        user.firstName || "",
      lastName:
        user.lastName || "",
      photo:
        user.photo || "",
      description:
        user.description || "",
    });

    setEditing(false);
    setMessage("");
  }

  async function saveProfile() {
    try {
      setSaving(true);
      setMessage("");

      await api.put(
        `/profile/${id}`,
        form
      );

      setEditing(false);

      await loadPage();

      setMessage(
        "Profilul a fost actualizat."
      );
    } catch (error) {
      console.error(
        "SAVE PROFILE ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Profilul nu a putut fi actualizat."
      );
    } finally {
      setSaving(false);
    }
  }

  async function addAbsence(type) {
    if (!isAdmin) {
      return;
    }

    try {
      setAbsenceLoading(true);
      setMessage("");

      await api.post(
        `/absences/user/${id}`,
        {
          type,
        }
      );

      await loadAbsences();

      setMessage(
        type === "EXCUSED"
          ? "Absența motivată a fost adăugată."
          : "Absența nemotivată a fost adăugată."
      );
    } catch (error) {
      console.error(
        "ADD ABSENCE ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Absența nu a putut fi adăugată."
      );
    } finally {
      setAbsenceLoading(false);
    }
  }

  async function confirmDeleteAbsence() {
    if (
      !isAdmin ||
      !deletingAbsence
    ) {
      return;
    }

    try {
      setAbsenceLoading(true);
      setMessage("");

      await api.delete(
        `/absences/${deletingAbsence.id}`
      );

      setDeletingAbsence(null);

      await loadAbsences();

      setMessage(
        "Absența a fost ștearsă."
      );
    } catch (error) {
      console.error(
        "DELETE ABSENCE ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Absența nu a putut fi ștearsă."
      );
    } finally {
      setAbsenceLoading(false);
    }
  }

  const attendances =
    user?.attendances || [];

  const fees =
    user?.fees || [];

  const participations =
    useMemo(() => {
      return attendances.filter(
        (attendance) =>
          attendance.status ===
            "PRESENT" &&
          !attendance.cancelledAt
      );
    }, [attendances]);

  const excusedCount =
    useMemo(() => {
      return absences.filter(
        (absence) =>
          absence.type ===
          "EXCUSED"
      ).length;
    }, [absences]);

  const unexcusedCount =
    useMemo(() => {
      return absences.filter(
        (absence) =>
          absence.type ===
          "UNEXCUSED"
      ).length;
    }, [absences]);

  const totalAbsences =
    excusedCount +
    unexcusedCount;

  const canChangePassword =
    isAdmin ||
    Number(currentUser?.id) ===
      Number(user?.id);

  if (loading) {
    return (
      <div className="py-20 text-center text-lg text-gray-500">
        Se încarcă profilul...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-red-600">
          Profilul nu a putut fi
          încărcat
        </h2>

        <p className="mt-4 text-gray-600">
          {message ||
            "A apărut o eroare la încărcarea profilului."}
        </p>
      </div>
    );
  }

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
                  {user.firstName}{" "}
                  {user.lastName}
                </h1>

                <p className="mt-2 text-gray-500">
                  {user.email}
                </p>

                <span className="mt-4 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
                  {user.role ===
                  "ADMIN"
                    ? "Administrator"
                    : "Membru"}
                </span>
              </div>

              <div className="flex flex-wrap gap-3">

                {isAdmin &&
                  !editing && (
                    <button
                      type="button"
                      onClick={() =>
                        setEditing(true)
                      }
                      className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
                    >
                      Editează profilul
                    </button>
                  )}

                {canChangePassword && (
                  <button
                    type="button"
                    onClick={() =>
                      setPasswordModalOpen(
                        true
                      )
                    }
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
                      value={
                        form.firstName
                      }
                      onChange={(
                        event
                      ) =>
                        updateForm(
                          "firstName",
                          event.target
                            .value
                        )
                      }
                      className="w-full rounded-xl border border-gray-300 bg-white p-4 outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold text-gray-700">
                      Nume
                    </label>

                    <input
                      value={
                        form.lastName
                      }
                      onChange={(
                        event
                      ) =>
                        updateForm(
                          "lastName",
                          event.target
                            .value
                        )
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
                    value={
                      form.photo
                    }
                    onChange={(
                      event
                    ) =>
                      updateForm(
                        "photo",
                        event.target.value
                      )
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
                    value={
                      form.description
                    }
                    onChange={(
                      event
                    ) =>
                      updateForm(
                        "description",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white p-4 outline-none focus:border-blue-600"
                  />
                </div>

                <div className="flex flex-wrap gap-3">

                  <button
                    type="button"
                    onClick={
                      saveProfile
                    }
                    disabled={saving}
                    className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {saving
                      ? "Se salvează..."
                      : "Salvează"}
                  </button>

                  <button
                    type="button"
                    onClick={
                      cancelEditing
                    }
                    disabled={saving}
                    className="rounded-xl bg-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                  >
                    Anulează
                  </button>

                </div>

              </div>
            ) : (
              <div className="mt-8 rounded-2xl bg-gray-50 p-6">

                <h2 className="text-2xl font-bold">
                  Despre
                </h2>

                <p className="mt-4 leading-7 text-gray-600">
                  {user.description ||
                    "Nu există descriere."}
                </p>

              </div>
            )}

            <section className="mt-10">

              <h2 className="mb-5 text-2xl font-bold">
                Statistici prezență
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <StatCard
                  label="Participări"
                  value={
                    participations.length
                  }
                  className="bg-green-50"
                  valueClassName="text-green-700"
                />

                <StatCard
                  label="Absențe motivate"
                  value={
                    excusedCount
                  }
                  className="bg-yellow-50"
                  valueClassName="text-yellow-700"
                />

                <StatCard
                  label="Absențe nemotivate"
                  value={
                    unexcusedCount
                  }
                  className="bg-red-50"
                  valueClassName="text-red-700"
                />

                <StatCard
                  label="Total absențe"
                  value={
                    totalAbsences
                  }
                  className="bg-gray-100"
                  valueClassName="text-gray-800"
                />

              </div>
            </section>

            {isAdmin &&
              user.role !==
                "ADMIN" && (
                <section className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-6">

                  <h2 className="text-2xl font-bold text-blue-900">
                    Administrare absențe
                  </h2>

                  <p className="mt-2 text-gray-600">
                    Adaugă absențele
                    acestui membru direct
                    din profil.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">

                    <button
                      type="button"
                      disabled={
                        absenceLoading
                      }
                      onClick={() =>
                        addAbsence(
                          "EXCUSED"
                        )
                      }
                      className="rounded-xl bg-yellow-500 px-6 py-3 font-bold text-white hover:bg-yellow-600 disabled:opacity-50"
                    >
                      + Absență motivată
                    </button>

                    <button
                      type="button"
                      disabled={
                        absenceLoading
                      }
                      onClick={() =>
                        addAbsence(
                          "UNEXCUSED"
                        )
                      }
                      className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      + Absență nemotivată
                    </button>

                  </div>

                </section>
              )}

            <section className="mt-10">

              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

                <h2 className="text-2xl font-bold">
                  Absențe
                </h2>

                <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700">
                  Total:{" "}
                  {totalAbsences}
                </span>

              </div>

              {absences.length === 0 ? (
                <div className="rounded-2xl bg-gray-50 p-6 text-gray-500">
                  Nu există absențe
                  înregistrate.
                </div>
              ) : (
                <div className="space-y-3">

                  {absences.map(
                    (absence) => (
                      <div
                        key={
                          absence.id
                        }
                        className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gray-50 p-5"
                      >

                        <div>

                          <span
                            className={`inline-block rounded-full px-4 py-2 text-sm font-bold ${
                              absence.type ===
                              "EXCUSED"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {absence.type ===
                            "EXCUSED"
                              ? "Absență motivată"
                              : "Absență nemotivată"}
                          </span>

                          <p className="mt-2 text-sm text-gray-500">
                            Adăugată la{" "}
                            {new Date(
                              absence.createdAt
                            ).toLocaleString(
                              "ro-RO"
                            )}
                          </p>

                        </div>

                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() =>
                              setDeletingAbsence(
                                absence
                              )
                            }
                            className="rounded-xl bg-red-100 px-4 py-2 font-semibold text-red-700 hover:bg-red-200"
                          >
                            Șterge
                          </button>
                        )}

                      </div>
                    )
                  )}

                </div>
              )}

            </section>

            <section className="mt-10">

              <h2 className="mb-5 text-2xl font-bold">
                Participări
              </h2>

              {participations.length ===
              0 ? (
                <div className="rounded-2xl bg-gray-50 p-6 text-gray-500">
                  Nu există participări
                  înregistrate.
                </div>
              ) : (
                <div className="space-y-4">

                  {participations.map(
                    (attendance) => (
                      <div
                        key={
                          attendance.id
                        }
                        className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gray-50 p-5"
                      >

                        <div>

                          <h3 className="font-bold">
                            {attendance
                              .event
                              ?.title ||
                              "Eveniment"}
                          </h3>

                          {attendance
                            .event
                            ?.date && (
                            <p className="mt-1 text-sm text-gray-500">
                              {new Date(
                                attendance
                                  .event
                                  .date
                              ).toLocaleDateString(
                                "ro-RO"
                              )}
                            </p>
                          )}

                        </div>

                        <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                          Prezent
                        </span>

                      </div>
                    )
                  )}

                </div>
              )}

            </section>

            <section className="mt-10">

              <h2 className="mb-5 text-2xl font-bold">
                Cotizații
              </h2>

              {fees.length === 0 ? (
                <div className="rounded-2xl bg-gray-50 p-6 text-gray-500">
                  Nu există cotizații
                  înregistrate.
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
                          {fee.month}/
                          {fee.year}
                        </h3>

                        {fee.amount !==
                          undefined && (
                          <p className="mt-1 font-semibold text-blue-700">
                            {Number(
                              fee.amount
                            ).toLocaleString(
                              "ro-RO",
                              {
                                style:
                                  "currency",
                                currency:
                                  "RON",
                              }
                            )}
                          </p>
                        )}

                        {fee.dueDate && (
                          <p className="mt-1 text-sm text-gray-500">
                            Termen:{" "}
                            {new Date(
                              fee.dueDate
                            ).toLocaleDateString(
                              "ro-RO"
                            )}
                          </p>
                        )}

                        {fee.paidAt && (
                          <p className="mt-1 text-sm text-gray-500">
                            Plătită la{" "}
                            {new Date(
                              fee.paidAt
                            ).toLocaleDateString(
                              "ro-RO"
                            )}
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
                        {fee.paid
                          ? "Plătită"
                          : "Neplătită"}
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
          currentUser={
            currentUser
          }
          onClose={() =>
            setPasswordModalOpen(
              false
            )
          }
        />
      )}

      {deletingAbsence && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={() =>
            setDeletingAbsence(null)
          }
        >

          <div
            className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <h2 className="text-2xl font-bold text-gray-900">
              Ștergi absența?
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Această{" "}
              <strong>
                {deletingAbsence.type ===
                "EXCUSED"
                  ? "absență motivată"
                  : "absență nemotivată"}
              </strong>{" "}
              va fi eliminată din
              profilul membrului.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                disabled={
                  absenceLoading
                }
                onClick={() =>
                  setDeletingAbsence(
                    null
                  )
                }
                className="rounded-xl bg-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-300 disabled:opacity-50"
              >
                Anulează
              </button>

              <button
                type="button"
                disabled={
                  absenceLoading
                }
                onClick={
                  confirmDeleteAbsence
                }
                className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800 disabled:opacity-50"
              >
                {absenceLoading
                  ? "Se șterge..."
                  : "Șterge"}
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}

function StatCard({
  label,
  value,
  className = "",
  valueClassName = "",
}) {
  return (
    <div
      className={`rounded-2xl p-5 ${className}`}
    >
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p
        className={`mt-2 text-3xl font-bold ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  );
}