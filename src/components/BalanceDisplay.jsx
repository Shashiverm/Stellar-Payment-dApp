export default function BalanceDisplay({ balance }) {
  return (
    <section className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 p-5 shadow-plasma backdrop-blur-xl animate-floatIn [animation-delay:160ms]">
      <p className="text-xs uppercase tracking-[0.24em] text-frost/75">Live balance</p>
      <p className="mt-3 flex items-baseline gap-2 text-4xl font-semibold text-white">
        {balance ?? "-"}
        <span className="text-base font-medium text-pulse/85">XLM</span>
      </p>
      <div className="mt-4 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-pulse animate-pulseLine" />
        <p className="text-xs text-frost/70">Stellar Testnet stream online</p>
      </div>
    </section>
  );
}
