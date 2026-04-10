import { useCallback, useState } from "react";
import { getBalance } from "../lib/stellar";

let freighterApiPromise;

async function loadFreighterApi() {
  if (!freighterApiPromise) {
    freighterApiPromise = import("@stellar/freighter-api").then((mod) => {
      // Support both ESM named exports and CJS default export shapes.
      const api = mod?.default && typeof mod.default === "object" ? mod.default : mod;
      return api;
    });
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
      const freighterApi = await loadFreighterApi();

      const hasIsConnected = typeof freighterApi?.isConnected === "function";
      const hasIsAllowed = typeof freighterApi?.isAllowed === "function";

      let connected = true;
      if (hasIsConnected) {
        connected = await freighterApi.isConnected();
      } else if (hasIsAllowed) {
        connected = await freighterApi.isAllowed();
      }

      if (!connected) {
        throw new Error("Freighter extension is not available");
      }

      let key = null;
      if (typeof freighterApi?.getPublicKey === "function") {
        key = await freighterApi.getPublicKey();
      } else if (typeof freighterApi?.getAddress === "function") {
        const addressResult = await freighterApi.getAddress();
        key =
          typeof addressResult === "string"
            ? addressResult
            : addressResult?.address || addressResult?.publicKey || null;
      }

      if (!key) {
        throw new Error("Unable to read account address from Freighter");
      }

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
    if (typeof freighterApi?.signTransaction !== "function") {
      throw new Error("Freighter signTransaction is unavailable");
    }
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
