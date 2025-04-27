# 3WB Invoice Distribution Library

A TypeScript library providing utilities to generate, sign, and distribute invoices to 3WB members via email and blockchain attestations.

## 🚀 Core Modules

- **Constants** (`src/utils/constants/addresses.ts`)
  - Preconfigured contract and schema addresses.
- **Currency Rates** (`src/utils/currencyRate.ts`)
  - Fetches on-chain & off-chain exchange rates for invoice conversion.
- **Ethereum Signing** (`src/utils/ethSign.ts`)
  - Signs invoice payloads with a Celo/Ethereum private key.
- **Email Delivery** (`src/utils/mail.ts`)
  - Sends invoice emails via configured SMTP or transactional provider.
- **Misc Helpers** (`src/utils/misc.ts`)
  - Common utility functions for formatting and validation.
- **Offchain Attestation** (`src/utils/offchainAttest.ts`)
  - Generates off-chain attestations for invoices using Privy schemas.
- **Privy Integration** (`src/utils/privy.ts`)
  - Manages authentication and requests to Privy API.

## ⚙️ Installation

```bash
npm install @3wb/invoice-distro
# or
yarn add @3wb/invoice-distro
```

## 🔧 Configuration

Create a `.env` file in your project root with:

```env
# Ethereum/Celo
PRIVATE_KEY=0x...                  # Signer private key
RPC_URL=https://forno.celo.org      # Celo RPC endpoint

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
FROM_ADDRESS="no-reply@3wb.club"

# Privy
PRIVY_APP_ID=
PRIVY_APP_SECRET=
INVOICE_SCHEMA_ID=
```

## 📘 Quickstart

```ts
import {
  getCurrencyRate,
  signInvoice,
  sendEmail,
  attestOffchain,
} from '@3wb/invoice-distro';

// 1. Convert USD to Celo M$:
const rate = await getCurrencyRate('USD', 'cUSD');

// 2. Sign invoice data:
const signature = await signInvoice(invoiceData, PRIVATE_KEY);

// 3. Send invoice email:
await sendEmail({
  to: member.email,
  subject: 'Your 3WB Invoice',
  html: invoiceHtml,
});

// 4. Create off-chain attestation:
const attest = await attestOffchain(INVOICE_SCHEMA_ID, invoiceData);
```

## 📁 Project Structure

```bash
src/
├── utils/
│   ├── constants/       # Address & schema constants
│   ├── currencyRate.ts  # Exchange rate utilities
│   ├── ethSign.ts       # EIP-191 signing helpers
│   ├── mail.ts          # Email sender utilities
│   ├── misc.ts          # Formatting & validation helpers
│   ├── offchainAttest.ts# Privy off-chain attestation logic
│   └── privy.ts         # Privy API client
├── package.json         # Library manifest
├── tsconfig.json        # TypeScript config
└── README.md            # This file
```

## 🤝 Contributing

1. Fork the repository.
2. Install dependencies: `npm install`.
3. Add tests for new functionality.
4. Submit a Pull Request.

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
```

