import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

const monthNames = [
  "Ianuarie",
  "Februarie",
  "Martie",
  "Aprilie",
  "Mai",
  "Iunie",
  "Iulie",
  "August",
  "Septembrie",
  "Octombrie",
  "Noiembrie",
  "Decembrie",
];

export default function Fees() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [fees, setFees] = useState([]);
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [loading, setLoading] = useState(true);
  const [savingAmount, setSavingAmount] =
    useState(false);
  const [generating, setGenerating] =
    useState(false);
  const [savingId, setSavingId] = useState(null);
  const [deletingFee, setDeletingFee] =
    useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    try {
      setLoading(true);
      setMessage("");

      if (user.role === "ADMIN") {
        const [feesResponse, settingsResponse] =
          await Promise.all([
            api.get("/fees"),
            api.get("/fees/settings"),
          ]);

        setFees(feesResponse.data);

        setAmount(
          settingsResponse.data.membershipFeeAmount || ""
        );
      } else {
        const response = await api.get(
          `/fees/user/${user.id}`
        );

        setFees(response.data);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Cotizațiile nu au putut fi încărcate."
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveMonthlyAmount(event) {
    event.preventDefault();

    try {
      setSavingAmount(true);
      setMessage("");

      await api.put("/fees/settings", {
        amount: Number(amount),
      });

      setMessage(
        "Suma lunară a fost salvată și aplicată lunii curente."
      );

      await loadPage();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Suma nu a putut fi salvată."
      );
    } finally {
      setSavingAmount(false);
    }
  }

  async function generateCurrentMonth() {
    try {
      setGenerating(true);
      setMessage("");

      const response = await api.post(
        "/fees/generate-current"
      );

      setMessage(response.data.message);

      await loadPage();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Cotizațiile nu au putut fi generate."
      );
    } finally {
      setGenerating(false);
    }
  }

  async function updateStatus(feeId, paid) {
    try {
      setSavingId(feeId);
      setMessage("");

      await api.put(`/fees/${feeId}/status`, {
        paid,
      });

      await loadPage();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Statusul nu a putut fi actualizat."
      );
    } finally {
      setSavingId(null);
    }
  }

  async function confirmDeleteFee() {
    if (!deletingFee) {
      return;
    }

    try {
      setSavingId(deletingFee.id);
      setMessage("");

      await api.delete(`/fees/${deletingFee.id}`);

      setFees((currentFees) =>
        currentFees.filter(
          (fee) => fee.id !== deletingFee.id
        )
      );

      setDeletingFee(null);

      setMessage("Cotizația a fost ștearsă definitiv.");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Cotizația nu a putut fi ștearsă."
      );
    } finally {
      setSavingId(null);
    }
  }

  function formatAmount(value) {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: "RON",
    }).format(Number(value || 0));
  }

  const filteredFees = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return fees.filter((fee) => {
      const memberText = fee.user
        ? `${fee.user.firstName} ${fee.user.lastName} ${fee.user.email}`
            .toLowerCase()
        : "";

      const matchesSearch =
        !normalizedSearch ||
        memberText.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PAID" && fee.paid) ||
        (statusFilter === "UNPAID" && !fee.paid);

      return matchesSearch && matchesStatus;
    });
  }, [fees, search, statusFilter]);

  const unpaidFees = fees.filter(
    (fee) => !fee.paid
  );

  const paidFees = fees.filter(
    (fee) => fee.paid
  );

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">
        Se încarcă cotizațiile...
      </div>
    );
  }

  return (
    <>
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-blue-800">
            Cotizații
          </h1>

          <p className="mt-2 text-gray-500">
            Cotizațiile neplătite rămân vizibile până
            la achitare.
          </p>
        </div>

        {user.role === "ADMIN" && (
          <section className="mb-10 rounded-3xl bg-white p-7 shadow-lg">
            <h2 className="text-2xl font-bold">
              Configurare cotizație lunară
            </h2>

            <p className="mt-2 text-gray-500">
              Suma este folosită automat pentru fiecare
              membru activ la începutul lunii.
            </p>

            <form
              onSubmit={saveMonthlyAmount}
              className="mt-6 flex flex-wrap items-end gap-4"
            >
              <div className="min-w-[240px] flex-1">
                <label className="mb-2 block font-semibold">
                  Suma lunară în lei
                </label>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(event) =>
                    setAmount(event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 p-4"
                  placeholder="Exemplu: 30"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={savingAmount}
                className="rounded-xl bg-blue-700 px-7 py-4 font-bold text-white hover:bg-blue-800 disabled:opacity-50"
              >
                {savingAmount
                  ? "Se salvează..."
                  : "Salvează suma"}
              </button>

              <button
                type="button"
                onClick={generateCurrentMonth}
                disabled={generating}
                className="rounded-xl bg-yellow-400 px-7 py-4 font-bold text-blue-950 hover:bg-yellow-300 disabled:opacity-50"
              >
                {generating
                  ? "Se generează..."
                  : "Verifică luna curentă"}
              </button>
            </form>
          </section>
        )}

        {user.role === "ADMIN" && (
          <section className="mb-8 grid gap-4 rounded-2xl bg-white p-5 shadow md:grid-cols-[1fr_auto]">
            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Caută membru după nume sau email..."
              className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-blue-700"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="rounded-xl border border-gray-300 bg-white px-5 py-4 font-semibold"
            >
              <option value="ALL">
                Toate cotizațiile
              </option>

              <option value="UNPAID">
                Doar neplătite
              </option>

              <option value="PAID">
                Doar plătite
              </option>
            </select>
          </section>
        )}

        {message && (
          <div className="mb-7 rounded-xl bg-blue-50 p-4 font-medium text-blue-700">
            {message}
          </div>
        )}

        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-blue-800 p-6 text-white">
            <p>Total</p>

            <p className="mt-3 text-4xl font-bold">
              {fees.length}
            </p>
          </div>

          <div className="rounded-2xl bg-red-600 p-6 text-white">
            <p>Restante</p>

            <p className="mt-3 text-4xl font-bold">
              {unpaidFees.length}
            </p>
          </div>

          <div className="rounded-2xl bg-green-600 p-6 text-white">
            <p>Plătite</p>

            <p className="mt-3 text-4xl font-bold">
              {paidFees.length}
            </p>
          </div>
        </div>

        {filteredFees.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center text-gray-500 shadow">
            Nu există cotizații care corespund căutării.
          </div>
        ) : (
          <div className="space-y-5">
            {filteredFees.map((fee) => (
              <article
                key={fee.id}
                className={`rounded-2xl border p-6 shadow-lg ${
                  fee.paid
                    ? "border-green-200 bg-white"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div>
                    {user.role === "ADMIN" &&
                      fee.user && (
                        <>
                          <h2 className="text-xl font-bold">
                            {fee.user.firstName}{" "}
                            {fee.user.lastName}
                          </h2>

                          <p className="mt-1 text-sm text-gray-500">
                            {fee.user.email}
                          </p>
                        </>
                      )}

                    <p className="mt-3 text-lg font-semibold">
                      {monthNames[fee.month - 1]}{" "}
                      {fee.year}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-blue-800">
                      {formatAmount(fee.amount)}
                    </p>

                    {fee.dueDate && (
                      <p className="mt-2 text-sm text-gray-500">
                        Termen:{" "}
                        {new Date(
                          fee.dueDate
                        ).toLocaleDateString("ro-RO")}
                      </p>
                    )}

                    {fee.paidAt && (
                      <p className="mt-2 text-sm text-green-700">
                        Plătită la:{" "}
                        {new Date(
                          fee.paidAt
                        ).toLocaleDateString("ro-RO")}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-4 py-2 font-bold ${
                        fee.paid
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {fee.paid
                        ? "Plătită"
                        : "Neplătită"}
                    </span>

                    {user.role === "ADMIN" && (
                      <>
                        <select
                          value={
                            fee.paid
                              ? "paid"
                              : "unpaid"
                          }
                          disabled={
                            savingId === fee.id
                          }
                          onChange={(event) =>
                            updateStatus(
                              fee.id,
                              event.target.value ===
                                "paid"
                            )
                          }
                          className="rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold disabled:opacity-50"
                        >
                          <option value="unpaid">
                            Neplătită
                          </option>

                          <option value="paid">
                            Plătită
                          </option>
                        </select>

                        <button
                          type="button"
                          onClick={() =>
                            setDeletingFee(fee)
                          }
                          disabled={
                            savingId === fee.id
                          }
                          className="rounded-xl bg-red-700 px-5 py-3 font-semibold text-white hover:bg-red-800 disabled:opacity-50"
                        >
                          Șterge
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {deletingFee && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={() => setDeletingFee(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <h2 className="text-2xl font-bold">
              Ștergi cotizația?
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Cotizația pentru{" "}
              <strong>
                {deletingFee.user?.firstName}{" "}
                {deletingFee.user?.lastName}
              </strong>{" "}
              din luna{" "}
              <strong>
                {monthNames[
                  deletingFee.month - 1
                ]}{" "}
                {deletingFee.year}
              </strong>{" "}
              va fi eliminată definitiv.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setDeletingFee(null)
                }
                className="rounded-xl bg-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-300"
              >
                Anulează
              </button>

              <button
                type="button"
                onClick={confirmDeleteFee}
                disabled={
                  savingId === deletingFee.id
                }
                className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800 disabled:opacity-50"
              >
                {savingId === deletingFee.id
                  ? "Se șterge..."
                  : "Șterge definitiv"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}