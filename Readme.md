# Stellar Pay  - Stellar Testnet XLM dApp

![Stellar](https://img.shields.io/badge/Stellar-Testnet-08B5E5?style=for-the-badge&logo=stellar)
![React](https://img.shields.io/badge/React-Latest-20232A?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-Latest-38B2AC?style=for-the-badge&logo=tailwind-css)

## About

Stellar Pay  is a modern XLM payment dApp built for Stellar Testnet.
It lets users connect Freighter, view live XLM balance, send XLM transactions, and instantly verify payment hashes on-chain.

## Core Features

- Freighter wallet connect and disconnect
- Live XLM balance fetch from Horizon Testnet
- Send XLM by destination address and amount
- Success and failure transaction feedback
- Direct transaction hash link to Stellar Expert (Testnet)
- Responsive futuristic interface (mobile and desktop)

## Technology Stack

### Frontend

- React (latest)
- Vite (latest)
- Tailwind CSS (latest)

### Blockchain

- @stellar/freighter-api (latest)
- @stellar/stellar-sdk (latest)
- Horizon Testnet endpoint

All dependencies are set to latest tags in package.json and resolve to newest available versions at install time.

## Installation and Run

### Requirements

- Node.js 18 or higher
- npm
- Freighter browser extension

### Steps

    npm install
    npm run dev

Open in browser:

    http://localhost:5173

## Usage Flow

1. Connect Freighter wallet
2. View live XLM balance
3. Enter recipient Stellar address and amount
4. Confirm transaction in Freighter popup
5. View transaction result and hash link

## Testnet Setup

- Set Freighter network to Testnet
- Fund account using https://friendbot.stellar.org

## Screenshots

- Wallet connected state
    /Stellar-Payment-dApp/public/wallet_connected.png


- Balance card displayed


- Send XLM form in action


- Success or failure transaction feedback



## Project Structure

    src/
    ├── components/
    │   ├── WalletConnect.jsx
    │   ├── BalanceDisplay.jsx
    │   ├── SendPayment.jsx
    │   └── TransactionResult.jsx
    ├── hooks/
    │   └── useFreighter.js
    ├── lib/
    │   └── stellar.js
    ├── App.jsx
    ├── main.jsx
    └── index.css

## License

MIT