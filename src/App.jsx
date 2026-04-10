import BalanceDisplay from "./components/BalanceDisplay";
import SendPayment from "./components/SendPayment";
import WalletConnect from "./components/WalletConnect";
import { useFreighter } from "./hooks/useFreighter";

export default function App() {
  const wallet = useFreighter();

  return (
    <div className="relative min-h-screen overflow-hidden bg-abyss text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(66,245,215,0.18),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(255,141,94,0.14),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(200,216,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(200,216,255,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />

      <main className="relative mx-auto flex min-h-screen w-full max-w-2xl items-center px-4 py-10 sm:px-6">
        <div className="w-full space-y-4">
          <header className="animate-floatIn">
            <p className="text-xs uppercase tracking-[0.3em] text-frost/70">Stellar payment interface</p>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Stellar Pay 2050
            </h1>
            <p className="mt-3 max-w-xl text-sm text-frost/70">
              High-signal, low-friction XLM transfers on Stellar Testnet with
              Freighter signing and live transaction proof.
            </p>
          </header>

          <WalletConnect
            publicKey={wallet.publicKey}
            connecting={wallet.connecting}
            error={wallet.error}
            onConnect={wallet.connect}
            onDisconnect={wallet.disconnect}
          />

          {wallet.publicKey ? (
            <>
              <BalanceDisplay balance={wallet.balance} />
              <SendPayment
                senderPublicKey={wallet.publicKey}
                signTransaction={wallet.signTransaction}
                onSuccess={wallet.refreshBalance}
              />
            </>
          ) : (
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-frost/75 animate-floatIn [animation-delay:140ms]">
              Connect Freighter on Testnet to unlock balance streaming and XLM send.
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
