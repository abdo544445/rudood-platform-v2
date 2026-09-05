# ⚛️ Rudood Platform — React 19 Frontend SPA

> **Version**: 2.0  
> **Framework**: React 19 (`19.0.0`) with TypeScript 5.7  
> **Build Tool**: Vite 6  
> **Styling**: Vanilla CSS Design System with Dark Luxury Glassmorphism & Gold Highlights (`#080d19` / `#d4af37`)  
> **Typography**: Cairo (Arabic / Latin Google Fonts)  

---

## 🏗️ Architecture Overview

The Rudood frontend is an independent Single Page Application (SPA) designed to communicate seamlessly with the Laravel 11 Backend API (`/api/v1/*`) using Axios and token-based authentication.

```
src/
├── assets/                  # Brand logos, icons, and hero illustrations
├── components/
│   ├── common/              # ProtectedRoute, CommandPalette, AmbientCanvas
│   └── layout/              # AppLayout, Sidebar, Header, PublicNavbar, PublicFooter
├── pages/
│   ├── admin/               # Super Admin 8-module suite (AdminPage.tsx)
│   ├── auth/                # LoginPage, RegisterPage
│   ├── channels/            # ChannelsPage (WhatsApp, Telegram, Instagram, Web)
│   ├── chat/                # LiveChatPage with conversation simulator
│   ├── dashboard/           # DashboardPage with live KPIs and quick actions
│   ├── knowledge/           # KnowledgeBasePage with FAQ auto-extraction & RAG
│   ├── playground/          # PlaygroundPage (AI model tester with latency benchmark)
│   ├── public/              # HomePage, FeaturesPage, PricingPage, HowItWorksPage, DemoPage, ContactPage, BlogPage
│   └── settings/            # BotSettingsPage (AI engine, temperature, tokens, provider)
├── services/
│   └── apiClient.ts         # Central Axios instance with auth headers & error interceptors
├── store/
│   └── useAuthStore.ts      # Zustand auth state manager with persistence
├── App.tsx                  # Root application router with protected and public routes
├── index.css                # Global design tokens, animations, glassmorphism, RTL utilities
└── main.tsx                 # React entry point
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
The application will start on `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```
Creates an optimized production bundle in the `dist/` directory.

---

## 🔑 Route Structure & Protection

| Route | Page Component | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `/` | `HomePage` | Public | High-converting landing page with hero animations |
| `/features` | `FeaturesPage` | Public | Multi-channel features and benefits |
| `/how-it-works`| `HowItWorksPage` | Public | 3-step setup guide and onboarding flow |
| `/pricing` | `PricingPage` | Public | Subscription tiers and feature comparison |
| `/demo` | `DemoPage` | Public | Interactive bot simulator |
| `/blog` | `BlogPage` | Public | Articles and single article reader with social share |
| `/contact` | `ContactPage` | Public | Contact form with instant confirmation feedback |
| `/login` | `LoginPage` | Public | Store owner and admin login |
| `/register` | `RegisterPage` | Public | Merchant registration |
| `/dashboard` | `DashboardPage` | Protected | Merchant KPI counters, quick actions, channel status |
| `/chat` | `LiveChatPage` | Protected | Unified omnichannel live inbox and takeover |
| `/channels` | `ChannelsPage` | Protected | WhatsApp, Telegram, and Instagram channel setup |
| `/knowledge` | `KnowledgeBasePage`| Protected | RAG documents, Q&A pairs, and AI FAQ auto-extractor |
| `/playground`| `PlaygroundPage` | Protected | AI prompt workbench with latency metrics |
| `/settings` | `BotSettingsPage` | Protected | Tone, creativity slider, max tokens, and provider |
| `/admin` | `AdminPage` | Protected (Admin) | Full 8-module Super Admin Command Center |
