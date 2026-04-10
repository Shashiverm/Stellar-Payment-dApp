export default function TransactionResult({ result }) {
  if (result?.hash) {
    return (
      <div className="rounded-2xl border border-pulse/40 bg-pulse/10 p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-pulse">
          Transaction confirmed
        </p>
        <a
          href={`https://stellar.expert/explorer/testnet/tx/${result.hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block break-all font-mono text-xs text-frost hover:text-white"
        >
          {result.hash}
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-ember/35 bg-ember/10 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ember">
        Transaction failed
      </p>
      <p className="mt-1 text-xs text-frost">{result?.error || "Unknown error"}</p>
    </div>
  );
}
