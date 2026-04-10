export default function WalletConnect({
  publicKey,
  connecting,
  error,
  onConnect,
  onDisconnect,
}) {
  const shortAddress = publicKey
    ? `${publicKey.slice(0, 6)}...${publicKey.slice(-6)}`
    : null;

  return (
    <section className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-plasma backdrop-blur-xl animate-floatIn [animation-delay:80ms]">
      {publicKey ? (
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-frost/75">Wallet linked</p>
            <p className="mt-1 font-mono text-sm text-white">{shortAddress}</p>
          </div>

          <button
            type="button"
            onClick={onDisconnect}
            className="rounded-xl border border-ember/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ember transition hover:border-ember hover:bg-ember/10"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <button
            type="button"
            onClick={onConnect}
            disabled={connecting}
            className="group relative w-full overflow-hidden rounded-xl border border-pulse/60 bg-pulse/90 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-abyss transition hover:bg-pulse disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">
              {connecting ? "Linking Freighter..." : "Connect Freighter"}
            </span>
          </button>

          {error ? (
            <p className="rounded-lg border border-ember/35 bg-ember/10 px-3 py-2 text-xs text-ember">
              {error}
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}
