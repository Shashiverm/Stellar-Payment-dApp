let stellarSdkPromise;
let serverPromise;

async function loadStellarSdk() {
  if (!stellarSdkPromise) {
    stellarSdkPromise = import("@stellar/stellar-sdk");
  }
  return stellarSdkPromise;
}

async function loadServer() {
  if (!serverPromise) {
    serverPromise = (async () => {
      const StellarSdk = await loadStellarSdk();
      return new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
    })();
  }
  return serverPromise;
}

export async function getBalance(publicKey) {
  const server = await loadServer();
  const account = await server.loadAccount(publicKey);
  const xlm = account.balances.find((balance) => balance.asset_type === "native");
  return xlm ? Number.parseFloat(xlm.balance).toFixed(2) : "0.00";
}

export async function sendPayment({
  senderPublicKey,
  destination,
  amount,
  signTransaction,
}) {
  const StellarSdk = await loadStellarSdk();
  const server = await loadServer();
  const account = await server.loadAccount(senderPublicKey);

  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination,
        asset: StellarSdk.Asset.native(),
        amount: amount.toString(),
      })
    )
    .setTimeout(30)
    .build();

  const signedXDR = await signTransaction(transaction.toXDR(), {
    networkPassphrase: StellarSdk.Networks.TESTNET,
  });

  const signedTx = StellarSdk.TransactionBuilder.fromXDR(
    signedXDR,
    StellarSdk.Networks.TESTNET
  );

  const result = await server.submitTransaction(signedTx);
  return result.hash;
}
