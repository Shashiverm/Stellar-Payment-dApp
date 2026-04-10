import { useMemo, useState } from "react";
import { sendPayment } from "../lib/stellar";
import TransactionResult from "./TransactionResult";

export default function SendPayment({
  senderPublicKey,
  signTransaction,
  onSuccess,
}) {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const canSubmit = useMemo(() => {
    return destination.trim().length === 56 && Number.parseFloat(amount) > 0;
  }, [destination, amount]);

  async function handleSend(event) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const hash = await sendPayment({
        senderPublicKey,
        destination: destination.trim(),
        amount,
        signTransaction,
      });

      setResult({ hash });
      await onSuccess();
      setDestination("");
      setAmount("");
    } catch (e) {
      setResult({ error: e?.message || "Payment rejected" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-plasma backdrop-blur-xl animate-floatIn [animation-delay:240ms]">
      <p className="text-xs uppercase tracking-[0.24em] text-frost/75">Send payment</p>

      <form onSubmit={handleSend} className="mt-4 space-y-3">
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-[0.16em] text-frost/65">
            Recipient address
          </span>
          <input
            type="text"
            placeholder="G..."
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-3 font-mono text-sm text-white outline-none placeholder:text-frost/35 focus:border-pulse/70"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-[0.16em] text-frost/65">
            Amount (XLM)
          </span>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            min="0"
            step="0.01"
            onChange={(event) => setAmount(event.target.value)}
            className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-3 text-sm text-white outline-none placeholder:text-frost/35 focus:border-pulse/70"
          />
        </label>

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="w-full rounded-xl border border-transparent bg-gradient-to-r from-pulse to-[#7cf5ff] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-abyss transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Broadcasting..." : "Send XLM"}
        </button>
      </form>

      {result ? <div className="mt-3"><TransactionResult result={result} /></div> : null}
    </section>
  );
}
