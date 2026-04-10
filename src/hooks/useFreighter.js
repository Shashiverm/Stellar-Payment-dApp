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

function pickBoolean(result, key) {
  if (typeof result === "boolean") {
    return result;
  }
  if (result && typeof result === "object" && key in result) {
    return Boolean(result[key]);
  }
  return false;
}

function pickErrorMessage(result) {
  if (!result || typeof result !== "object") {
    return null;
  }
  const apiError = result.error;
  if (!apiError) {
    return null;
  }
  if (typeof apiError === "string") {
    return apiError;
  }
  if (typeof apiError?.message === "string" && apiError.message) {
    return apiError.message;
  }
  return "Freighter returned an unexpected error";
}

function pickAddress(result) {
  if (typeof result === "string") {
    return result;
  }
  if (!result || typeof result !== "object") {
    return "";
  }
  return result.address || result.publicKey || "";
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

      let connected = true;
      if (typeof freighterApi?.isConnected === "function") {
        const status = await freighterApi.isConnected();
        connected = pickBoolean(status, "isConnected");
      }

      if (!connected) {
        throw new Error("Freighter extension is not available");
      }

      let key = "";
      let addressResult = null;

      if (typeof freighterApi?.isAllowed === "function") {
        const allowedResult = await freighterApi.isAllowed();
        const allowed = pickBoolean(allowedResult, "isAllowed");
        const allowedError = pickErrorMessage(allowedResult);
        if (allowedError) {
          throw new Error(allowedError);
        }

        if (!allowed && typeof freighterApi?.requestAccess === "function") {
          const accessResult = await freighterApi.requestAccess();
          const accessError = pickErrorMessage(accessResult);
          if (accessError) {
            throw new Error(accessError);
          }
          key = pickAddress(accessResult);
        }
      }

      if (!key && typeof freighterApi?.getPublicKey === "function") {
        addressResult = await freighterApi.getPublicKey();
        key = pickAddress(addressResult);
      }

      if (!key && typeof freighterApi?.getAddress === "function") {
        addressResult = await freighterApi.getAddress();
        key = pickAddress(addressResult);
      }

      const addressError = pickErrorMessage(addressResult);
      if (addressError) {
        throw new Error(addressError);
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
