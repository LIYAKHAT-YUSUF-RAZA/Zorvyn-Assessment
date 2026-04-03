# 💎 Zorvyn Finance Dashboard

> **A premium, high-performance financial analytics platform built with React 19 and Tailwind 4.**

![Zorvyn Finance Dashboard](https://images.unsplash.com/photo-1611974714012-7063fcca5bc8?q=80&w=2070&auto=format&fit=crop)

Zorvyn is a modern fintech dashboard designed for power users who need deep insights into their financial health. It combines elegant design with robust analytical tools to provide a comprehensive view of transactions, wealth management, and spending patterns.

## ✨ Features

- 📈 **Advanced Analytics**: Interactive charts (Recharts) with weekly spending trends, heatmaps, and cash flow projections.
- 💳 **Wallet Management**: Full card lifecycle management (Add, Freeze, Remove) with premium physical card designs.
- 🏦 **Connected Banks**: Secure bank account integration and quick transfer capabilities.
- 🔐 **RBAC Security**: Role-Based Access Control (Admin/Viewer) to protect sensitive financial actions.
- 🌓 **Dynamic Themes**: Seamless light and dark mode integration with persistent user preferences.
- 💬 **Integrated Messages**: A built-in messaging system for financial support and peer-to-peer requests.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/) (Vite)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & Vanilla CSS Tokens
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (with Persistence)
- **Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/) (8/8 Core Tests Passed)

## 📦 Project Structure

```text
src/
├── components/   # Reusable UI components & modals
├── pages/        # Main dashboard sections (Insights, Wallet, etc.)
├── store/        # Zustand state & analytical logic
├── data/         # Mock datasets & constants
└── assets/       # Static resources
```

## 🛠️ Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/LIYAKHAT-YUSUF-RAZA/Zorvyn-Assessment.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run in development**:
   ```bash
   npm run dev
   ```

4. **Run tests**:
   ```bash
   npm test
   ```

## 🛡️ Security & Roles

Zorvyn implements a strict Permission-Based system:
- **Admin**: Full access to transfers, card management, and settings.
- **Viewer**: Read-only access to analytics and transactions.

---

*This project was developed by [Liyakhat Yusuf Raza](https://github.com/LIYAKHAT-YUSUF-RAZA) to demonstrate high-end frontend engineering principles and modern aesthetic standards.*
