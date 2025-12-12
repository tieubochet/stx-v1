# 💎 Teeboo App

**Teeboo App** is a next-generation personal wallet application concept that leverages the authentication power of **Stacks Blockchain**.

The app simulates basic financial functions such as Daily Check-ins for rewards and Token Transfers in a secure and modern interface.

![Stacks](https://img.shields.io/badge/Secured%20by-Stacks-5546FF?style=flat-square&logo=stacks)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react)

## ✨ Key Features

1.  **Stacks Wallet Connection (Authentication):**
    *   Supports logging in with popular wallets in the Stacks ecosystem like **Leather** and **Xverse**.
    *   Displays the user's Mainnet wallet address.

2.  **Daily Check-in:**
    *   Users check in every 24 hours to receive reward tokens (Simulated).
    *   Cooldown mechanism prevents spamming check-ins.

3.  **Transaction Management:**
    *   Send Tokens (Transfer) to others (Simulated UI & State).
    *   Detailed transaction history (Check-in, Deposit, Withdrawal).

4.  **Optimized Interface (UI/UX):**
    *   Modern Glassmorphism design.
    *   Fully responsive on Mobile and Desktop.
    *   Smooth animation effects.

---

## 🛠️ Tech Stack

*   **Core:** React 18, TypeScript, Vite.
*   **Styling:** Tailwind CSS.
*   **Blockchain SDK:** `@stacks/connect`, `@stacks/auth` (for wallet connection).
*   **Polyfills:** `vite-plugin-node-polyfills` (to run crypto libraries in the browser).

---

## 🚀 Installation Guide (Local)

Follow these steps to run the project locally:

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd stx-v1
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the project

```bash
npm run dev
```
Access `http://localhost:5173` to experience the app.

---

## 🌐 Deployment Guide (Vercel)

This project is optimized for deployment on **Vercel**.

1.  Push your code to **GitHub**.
2.  Go to the [Vercel Dashboard](https://vercel.com/) and select **Add New Project**.
3.  Import your GitHub repository.
4.  Click **Deploy**.

Once deployed, Vercel will provide a URL (domain) to access the application.

---

## ⚠️ Important Notes

*   **Transaction Simulation:** Currently, functions like *Balance Increase on Check-in* and *Token Transfer* operate on **Local State** and **LocalStorage** to demonstrate UX logic. They do **not** yet execute actual Smart Contract (Clarity) calls on the Stacks Blockchain (on-chain).

---

## 🤝 Contributing

All contributions are welcome! Please open a Pull Request or Issue if you find any bugs or want to improve features.

## 📄 License

MIT License.