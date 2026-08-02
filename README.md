# 🏡 RentNest Frontend Client

[![Next.js](https://img.shields.io/badge/Next.js-16.2+-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-10.0+-E650A7?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)

**RentNest Client** is a modern, high-performance web application for rental property discovery, application management, and online payment processing. Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**, RentNest provides tailored experiences for **Tenants**, **Landlords**, and **Admins**.

---

## 🚀 Key Features

### 🔐 1. Role-Based Access Control (RBAC) & Next.js Middleware
- **Multi-Role Authentication**: Dedicated portals for `TENANT`, `LANDLORD`, and `ADMIN` users.
- **Session & Cookie Synchronization**: Syncs JWT auth tokens and roles via `AuthContext` and HTTP cookies (`accessToken`, `userRole`).
- **Edge Middleware Security**: Enforces automatic server-side route protection ([middleware.ts](file:///d:/Rentnest/frontend/src/middleware.ts)) preventing unauthorized access to role dashboards.

### 🏘️ 2. Property Marketplace & Advanced Search
- **Filter & Search Engine**: Real-time filtering by keyword search, city/location, property type, category, and min/max rent price range.
- **Numbered Pagination Bar**: Interactive bottom pagination (`1, 2, 3...`) with custom items-per-page limit controls (6, 10, 16) and smooth scrolling.
- **Property Details & Gallery**: Comprehensive property view featuring high-res imagery, specs, landlord contact preview, and tenant reviews.
- **Rental Request Modal**: Interactive application modal enabling tenants to select move-in dates and rental durations directly.

### 📊 3. Customized Dashboards
- **Tenant Portal** (`/dashboard/tenant`): Track rental application statuses (`PENDING`, `APPROVED`, `REJECTED`, `ACTIVE`), trigger Stripe payment checkout for approved applications, and write property reviews.
- **Landlord Portal** (`/dashboard/landlord`): Manage listed properties, review incoming rental applications with instant Approve/Reject actions, and create new property listings (`/dashboard/landlord/properties/new`).
- **Admin Portal** (`/dashboard/admin`): View site-wide analytics metrics, manage user accounts (`ACTIVE` / `BANNED` toggles), and moderate property listings.

### 💳 4. Seamless Online Payment Flow
- **Stripe Checkout Integration**: Direct redirect to secure Stripe payment sessions upon landlord approval.
- **Transaction Feedback**: Instant redirection to custom confirmation screens (`/payment-success`, `/payment-cancel`).

### 🎨 5. Premium Modern UI & Design System
- **Rich Aesthetics**: Glassmorphism, dark hero banners, subtle micro-animations, skeleton loaders, and curated fallback photography.
- **Design System Primitives**: Reusable, accessible UI components (`Button`, `Card`, `Input`, `Select`, `Badge`, `Modal`, `Skeleton`).

---

## 🛠️ Tech Stack & Dependencies

| Category | Technology / Library | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) | App Router, Server Components & Client Components |
| **UI Library** | [React 19](https://react.dev/) | Core UI rendering engine |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first CSS framework with PostCSS |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Type safety and autocompletion |
| **State Management** | React Context API | `AuthContext` for user session & JWT storage |
| **HTTP Client** | Native `fetch` wrapper | Custom `fetchApi` utility in `src/lib/api.ts` |
| **Package Manager** | [pnpm](https://pnpm.io/) | Fast, disk space efficient package manager |

---

## 📁 Directory Structure

```text
RentNest-Client/
├── public/                 # Static assets (favicons, public images)
├── src/
│   ├── app/                # Next.js App Router pages & routes
│   │   ├── auth/           # Authentication pages
│   │   │   ├── login/      # User login page
│   │   │   └── register/   # User registration page (Tenant / Landlord)
│   │   ├── dashboard/      # Role-based protected dashboards
│   │   │   ├── admin/      # Admin management & moderation
│   │   │   ├── landlord/   # Landlord property & request management
│   │   │   └── tenant/     # Tenant application tracking & payment triggers
│   │   ├── payment-cancel/ # Stripe checkout cancelled page
│   │   ├── payment-success/# Stripe checkout success page
│   │   ├── properties/     # Marketplace listing & detail pages
│   │   │   ├── [id]/       # Single property details view
│   │   │   └── page.tsx    # Property search & pagination page
│   │   ├── error.tsx       # Global error boundaries
│   │   ├── globals.css     # Global styles & Tailwind CSS v4 setup
│   │   ├── layout.tsx      # Root application layout & AuthProvider wrapper
│   │   ├── not-found.tsx   # Custom 404 page
│   │   └── page.tsx        # Homepage landing
│   ├── components/         # Design system & shared components
│   │   ├── layout/         # Layout components (Navbar, Footer, Dashboards)
│   │   └── ui/             # Reusable UI primitives (Button, Card, Input, etc.)
│   ├── context/            # Global React contexts (AuthContext.tsx)
│   ├── lib/                # API client & helper utilities (api.ts, utils.ts)
│   └── middleware.ts       # Next.js Edge Middleware for RBAC security
├── eslint.config.mjs       # ESLint configuration
├── next.config.ts          # Next.js framework configuration
├── package.json            # Project manifest & dependencies
├── postcss.config.mjs      # PostCSS configuration
├── tsconfig.json           # TypeScript configuration
└── pnpm-lock.yaml          # Dependency lockfile
```

---

## 📑 Page Routes & Access Matrix

| Route | Access Level | Description |
| :--- | :--- | :--- |
| `/` | Public | Homepage landing with search & featured properties |
| `/properties` | Public | Marketplace catalog with search, filters, & pagination |
| `/properties/[id]` | Public | Property detail view & rental booking modal |
| `/auth/login` | Guest | User login form |
| `/auth/register` | Guest | User registration form with role selector |
| `/dashboard/tenant` | `TENANT` | Tenant dashboard, booking status, & payment links |
| `/dashboard/landlord` | `LANDLORD` / `ADMIN` | Landlord properties list & request approval portal |
| `/dashboard/landlord/properties/new` | `LANDLORD` | Property creation form |
| `/dashboard/admin` | `ADMIN` | Platform metrics & analytics overview |
| `/dashboard/admin/users` | `ADMIN` | User accounts management (Ban/Unban) |
| `/dashboard/admin/moderation` | `ADMIN` | Property moderation panel |
| `/payment-success` | Authenticated | Stripe payment confirmation page |
| `/payment-cancel` | Authenticated | Stripe payment cancellation page |

---

## ⚡ Getting Started

### Prerequisites
Make sure you have the following installed on your system:
- **Node.js** (v18.x or higher)
- **pnpm** (`npm install -g pnpm`)
- **RentNest Backend API Server** running on `http://localhost:7000`

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/RentNest-Client.git
   cd RentNest-Client
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root of the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:7000/api
   ```

4. **Run Development Server**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to explore the application.

5. **Build for Production**
   ```bash
   pnpm build
   pnpm start
   ```

---

## 📜 NPM / pnpm Commands Reference

- `pnpm dev` - Launch local Next.js development server with hot reloading (`next dev`).
- `pnpm build` - Compile optimized production build (`next build`).
- `pnpm start` - Start production server (`next start`).
- `pnpm lint` - Run ESLint code checks.

---


