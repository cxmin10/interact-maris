import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ChangePasswordModal from "../components/ChangePasswordModal";

export default function Members() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [passwordUser, setPasswordUser] = useState(null);
  const [message, setMessage] = useState("");
  

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get("/users");
      const loadedUsers = response.data || [];

      const usersWithAbsences = await Promise.all(
        loadedUsers.map(async (user) => {
          try {
            const absencesResponse = await api.get(
              `/absences/user/${user.id}`
            );

            const userAbsences =
              absencesResponse.data || [];

            const excused = userAbsences.filter(
              (absence) =>
                absence.type === "EXCUSED"
            ).length;

            const unexcused = userAbsences.filter(
              (absence) =>
                absence.type === "UNEXCUSED"
            ).length;

            return {
              ...user,
              excused,
              absences: unexcused,
              totalAbsences: excused + unexcused,
            };
          } catch (absenceError) {
            console.error(
              `ABSENCES USER ${user.id} ERROR:`,
              absenceError
            );

            return {
              ...user,
              excused: 0,
              absences: 0,
              totalAbsences: 0,
            };
          }
        })
      );

      setUsers(usersWithAbsences);
    } catch (error) {
      console.error("LOAD USERS ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          "Membrii nu au putut fi încărcați."
      );
    } finally {
      setLoading(false);
    }
  }

  async function toggleUser(id) {
    try {
      setSavingId(id);
      setMessage("");

      await api.put(`/users/${id}/toggle`);

      await loadUsers();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Statusul utilizatorului nu a putut fi modificat."
      );
    } finally {
      setSavingId(null);
    }
  }

  async function confirmDeleteUser() {
    if (!deletingUser) {
      return;
    }

    try {
      setSavingId(deletingUser.id);
      setMessage("");

      await api.delete(`/users/${deletingUser.id}`);

      setUsers((currentUsers) =>
        currentUsers.filter(
          (user) => user.id !== deletingUser.id
        )
      );

      setDeletingUser(null);

      setMessage(
        "Membrul a fost eliminat și contul a fost dezactivat."
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Membrul nu a putut fi șters."
      );
    } finally {
      setSavingId(null);
    }
  }

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        `${user.firstName} ${user.lastName} ${user.email}`
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesFilter =
        filter === "ALL" ||
        (filter === "APPROVED" && user.isActive) ||
        (filter === "PENDING" && !user.isActive);

      return matchesSearch && matchesFilter;
    });
  }, [users, search, filter]);

  const pendingCount = users.filter(
    (user) => !user.isActive
  ).length;

  const approvedCount = users.filter(
    (user) => user.isActive
  ).length;

  if (loading) {
    return (
      <div className="py-20 text-center text-lg text-gray-500">
        Se încarcă membrii...
      </div>
    );
  }

  return (
    <>
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-blue-800">
            Membri Interact Maris
          </h1>

          <p className="mt-2 text-gray-500">
            Aprobă, dezactivează sau elimină conturile membrilor.
          </p>
        </div>

        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-blue-800 p-6 text-white shadow-lg">
            <p className="text-sm uppercase tracking-wider text-blue-200">
              Total utilizatori
            </p>

            <p className="mt-3 text-4xl font-bold">
              {users.length}
            </p>
          </div>

          <div className="rounded-2xl bg-green-600 p-6 text-white shadow-lg">
            <p className="text-sm uppercase tracking-wider text-green-100">
              Aprobați
            </p>

            <p className="mt-3 text-4xl font-bold">
              {approvedCount}
            </p>
          </div>

          <div className="rounded-2xl bg-yellow-500 p-6 text-white shadow-lg">
            <p className="text-sm uppercase tracking-wider text-yellow-100">
              În așteptare
            </p>

            <p className="mt-3 text-4xl font-bold">
              {pendingCount}
            </p>
          </div>
        </div>

        <div className="mb-8 grid gap-4 rounded-2xl bg-white p-5 shadow md:grid-cols-[1fr_auto]">
          <input
            type="text"
            placeholder="Caută după nume sau email..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-blue-700"
          />

          <select
            value={filter}
            onChange={(event) =>
              setFilter(event.target.value)
            }
            className="rounded-xl border border-gray-300 bg-white px-5 py-4 font-semibold"
          >
            <option value="ALL">Toți utilizatorii</option>
            <option value="PENDING">
              Așteaptă aprobarea
            </option>
            <option value="APPROVED">Aprobați</option>
          </select>
        </div>

        {message && (
          <div className="mb-6 rounded-xl bg-blue-100 p-4 font-medium text-blue-700">
            {message}
          </div>
        )}

        {filteredUsers.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center text-gray-500 shadow">
            Nu există utilizatori care corespund căutării.
          </div>
        ) : (
          <div className="space-y-5">
            {filteredUsers.map((user) => (
              <article
                key={user.id}
                className={`rounded-2xl border bg-white p-6 shadow-lg ${
                  user.isActive
                    ? "border-gray-100"
                    : "border-yellow-300"
                }`}
              >
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {user.firstName} {user.lastName}
                      </h2>

                      {user.isActive ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                          Aprobat
                        </span>
                      ) : (
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700">
                          Așteaptă aprobarea
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-gray-500">
                      {user.email}
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
                      <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-gray-500">Rol</p>
                        <p className="mt-1 font-bold">
                          {user.role === "ADMIN"
                            ? "Administrator"
                            : "Membru"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-green-50 p-4">
                        <p className="text-gray-500">
                          Participări
                        </p>
                        <p className="mt-1 font-bold text-green-700">
                          {user.participations ?? 0}
                        </p>
                      </div>

                      <div className="rounded-xl bg-yellow-50 p-4">
                        <p className="text-gray-500">
                          Absențe motivate
                        </p>
                        <p className="mt-1 font-bold text-yellow-700">
                          {user.excused ?? 0}
                        </p>
                      </div>

                      <div className="rounded-xl bg-red-50 p-4">
                        <p className="text-gray-500">
                          Absențe nemotivate
                        </p>
                        <p className="mt-1 font-bold text-red-700">
                          {user.absences ?? 0}
                        </p>
                      </div>

                      <div className="rounded-xl bg-gray-100 p-4">
                        <p className="text-gray-500">
                          Total absențe
                        </p>
                        <p className="mt-1 font-bold text-gray-800">
                          {user.totalAbsences ?? 0}
                        </p>
                      </div>

                      <div className="rounded-xl bg-red-50 p-4">
                        <p className="text-gray-500">
                          Cotizații restante
                        </p>
                        <p className="mt-1 font-bold text-red-700">
                          {user.unpaidFees ?? 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/profile/${user.id}`)
                      }
                      className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
                    >
                      Vezi profilul
                    </button>

                    <button
                      type="button"
                      onClick={() => setPasswordUser(user)}
                      disabled={savingId === user.id}
                      className="rounded-xl bg-slate-800 px-6 py-3 font-semibold text-white hover:bg-slate-900 disabled:opacity-50"
                    >
                      Schimbă parola
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleUser(user.id)}
                      disabled={savingId === user.id}
                      className={`rounded-xl px-6 py-3 font-semibold text-white disabled:opacity-50 ${
                        user.isActive
                          ? "bg-orange-500 hover:bg-orange-600"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {savingId === user.id
                        ? "Se actualizează..."
                        : user.isActive
                          ? "Dezactivează contul"
                          : "Aprobă contul"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingUser(user)}
                      disabled={savingId === user.id}
                      className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800 disabled:opacity-50"
                    >
                      Șterge membrul
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>


      {passwordUser && (
        <ChangePasswordModal
          targetUser={passwordUser}
          currentUser={currentUser}
          onClose={() => setPasswordUser(null)}
        />
      )}

      {deletingUser && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={() => setDeletingUser(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900">
              Ștergi membrul?
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Membrul{" "}
              <strong>
                {deletingUser.firstName}{" "}
                {deletingUser.lastName}
              </strong>{" "}
              va fi șters definitiv din platformă împreună cu
              participările și cotizațiile sale.
            </p>

            <p className="mt-3 text-sm text-gray-500">
              Această acțiune este permanentă și nu poate fi anulată.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="rounded-xl bg-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-300"
              >
                Anulează
              </button>

              <button
                type="button"
                onClick={confirmDeleteUser}
                disabled={savingId === deletingUser.id}
                className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800 disabled:opacity-50"
              >
                {savingId === deletingUser.id
                  ? "Se șterge..."
                  : "Confirmă ștergerea"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}