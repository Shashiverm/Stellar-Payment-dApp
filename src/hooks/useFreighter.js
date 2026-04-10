import { useCallback, useState } from "react";
import { getBalance } from "../lib/stellar";

let freighterApiPromise;

async function loadFreighterApi() {
  if (!freighterApiPromise) {
    freighterApiPromise = import("@stellar/freighter-api");
  }
  return freighterApiPromise;
}

export function useFreighter() {
  const [publicKey, setPublicKey] = useState(null);
  const [balance, setBalance] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);

    try {
      const { isConnected, getPublicKey } = await loadFreighterApi();
      const connected = await isConnected();
      if (!connected) {
        throw new Error("Freighter extension is not available");
      }

      const key = await getPublicKey();
      const walletBalance = await getBalance(key);
      setPublicKey(key);
      setBalance(walletBalance);
    } catch (e) {
      setError(e?.message || "Could not connect to Freighter");
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setPublicKey(null);
    setBalance(null);
    setError(null);
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!publicKey) {
      return;
    }

    try {
      const walletBalance = await getBalance(publicKey);
      setBalance(walletBalance);
    } catch {
      setError("Unable to refresh balance");
    }
  }, [publicKey]);

  const signTransaction = useCallback(async (...args) => {
    const freighterApi = await loadFreighterApi();
    return freighterApi.signTransaction(...args);
  }, []);

  return {
    publicKey,
    balance,
    connecting,
    error,
    connect,
    disconnect,
    refreshBalance,
    signTransaction,
  };
}
