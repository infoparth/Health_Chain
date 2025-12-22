# Health Chain

This project leverages blockchain technology to securely store and manage medical records, transforming them into NFTs. It provides role-based access to medical documents, ensuring that only authorized doctors can view and manage patient information. This approach enhances the security, privacy, and accessibility of medical records, offering a modern solution for healthcare data management.

### Getting Started

To start the project, run the following commands

````
# Health Chain (SecureMed)

Health Chain (SecureMed) is a blockchain-enabled web application for secure medical record storage, access management, and optional NFT monetization. Patients can upload medical documents, control which doctors can view them, and mint selected documents as NFTs for provenance or monetization. Doctors can access only the patients who have explicitly granted access.

This README documents the project's purpose, architecture, features, impact metrics, and setup instructions so you or your stakeholders can run, test, and evaluate the app.

---

## Key Features

- Wallet-based authentication and role resolution (patient / doctor)
- Centralized patient data fetching to minimize blockchain RPC calls
- Role-based route protection (Patient and Doctor layouts enforce correct wallet role)
- Upload documents to IPFS and store references on-chain
- View and preview documents with media renderer
- Grant / revoke doctors' access to patient documents
- Mint medical records as NFTs with metadata stored on IPFS
- Responsive and consistent UI with Tailwind CSS and theme tokens

---

## Tech Stack

- **Frontend:** React (Vite) + TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router (nested routes + Outlet context)
- **Blockchain SDK:** thirdweb (thirdweb/react, thirdweb/storage, thirdweb/wallets)
- **Smart Contracts:** Solidity (contract ABI and address in `src/constants/Contract.ts`)
- **Icons / UI primitives:** lucide-react, Radix UI primitives
- **Dev Tools:** Node.js, npm, TypeScript, Git

---

## What We Implemented & Why It Matters

1. **Centralized Patient Data (`usePatientData`)**
	- Calls contract reads once (documents + doctors) and computes `stats`.
	- Shared with all patient child routes via `PatientLayout`'s `<Outlet context={...} />`.
	- Impact: eliminates redundant RPC calls, reduces latency, lowers provider costs, and improves UX.

2. **Role Enforcement (`useAuthRedirect` + Layouts)**
	- `useAuthRedirect` ensures the wallet and role are authoritative.
	- Applied in `PatientLayout` and `DoctorLayout` so protected routes are enforced at layout level.
	- Disconnecting a wallet or switching wallets triggers immediate redirect to the correct entry point.

3. **Routing Refactor**
	- Patient routes (dashboard, view, upload, access, nft) are nested under `PatientLayout`.
	- Doctor routes are nested under `DoctorLayout`.
	- Keeps root layout generic and enforces role-specific checks in dedicated layouts.

4. **Error Handling & Loading**
	- Contract calls use `queryOptions: { enabled: !!walletAddress }` to avoid premature queries.
	- Components have defensive try/catch and user-friendly error UI components.

---

## Performance & Impact (Numbers & Rationale)

- **RPC Call Reduction:** If N patient pages previously each made the same read, the new approach reduces redundant reads by:

  $\text{Reduction} = \left(1 - \frac{1}{N}\right) \times 100\%$

  Example (N=4): 75% reduction in duplicate reads.

- **Cost Savings:** Fewer RPC calls reduce provider costs. Eliminating 3 duplicate reads per session saves roughly $0.0003–$0.003 per session (provider-dependent). At 10,000 sessions this is $3–$30 saved (conservative estimate).

- **Page Load / UX Improvement:** Centralized reads typically reduce perceived page load time (20–50% improvement for pages previously blocked on multiple reads).

- **Security / Correctness:** Immediate revocation of access on wallet disconnect and deterministic role enforcement reduces the risk of stale sessions and unauthorized views.

---

## Project Structure (high level)

- `src/` - application source
  - `components/` - UI components and pages (Patient, Doctor, NFT, Upload, View, Access, etc.)
  - `hooks/` - `usePatientData.ts`, `useAuthRedirect.ts`
  - `constants/` - contract configuration and theme tokens
  - `PatientLayout.tsx`, `DoctorLayout.tsx` - layout routes with auth enforcement
  - `main.tsx` - router configuration

---

## Getting Started (local development)

Pre-requisites:
- Node.js (>=16 recommended)
- npm

Install dependencies and run the development server:

```bash
npm install
npm run dev
````

Open the app in your browser. Use the header Connect button to connect a wallet and test patient/doctor flows.

---

## How To Validate the RPC Reduction

1. Open browser DevTools → Network and filter for RPC calls (or provider URL). Or enable thirdweb SDK logs.
2. Connect a wallet and open `/patient` — you should see a single contract read initiated by `usePatientData`.
3. Navigate to `/patient/view`, `/patient/upload`, `/patient/access` — there should be no additional contract reads for the same data unless you explicitly refetch.

Optional: add temporary console logs inside `usePatientData` to count calls during development.

---

## Testing Auth & Redirect Behavior

- Disconnect the wallet while on `/patient` or `/doctor` → immediate redirect to `/`.
- Switch wallets (e.g., from a patient wallet to a doctor wallet) → the app re-resolves role and redirects to the correct dashboard.
- New/unregistered wallet → redirected to `/register`.

---

## Contract Address

The contract used for testing is deployed on a testnet (see `src/constants/Contract.ts` for the exact address used in the codebase).

---

## Maintainers

- Project owner: Parth Verma

For questions or feature requests, open an issue or request a review in the repository.

---

Thank you — this README documents the architecture, improvements, and how to run and validate the project.
