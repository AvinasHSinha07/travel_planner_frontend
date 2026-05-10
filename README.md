# TRIPPLANNERAI - Frontend ✈️

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-FF4B4B?style=for-the-badge&logo=auth0&logoColor=white)](https://better-auth.com/)

> **TRIPPLANNERAI Frontend** is a luxury, AI-driven travel planning interface. Built with **Next.js 16** and **Tailwind CSS 4**, it provides a seamless, high-performance experience for travelers and administrators alike.

---

## 📖 Table of Contents
- [Project Overview](#-project-overview)
- [Live Demo & Deployment](#-live-demo--deployment)
- [Key Features in Detail](#-key-features-in-detail)
- [Project Structure](#-project-structure)
- [AI Experience](#-ai-experience)
- [Tech Stack](#-tech-stack)
- [Advanced Implementation](#-advanced-implementation)
- [Environment Variables](#-environment-variables)
- [Setup & Installation](#-setup--installation)
- [Demo Credentials](#-demo-credentials)

---

## 🌟 Project Overview
TRIPPLANNERAI is not just a travel app; it's a personal AI travel concierge. It solves the problem of tedious trip planning by offering an intuitive interface where users can describe their dream vacation and receive a fully tailored, bookable itinerary in seconds. The frontend is designed with a "Luxury Startup" aesthetic—clean, fast, and interactive.

## 🌐 Live Demo & Deployment
- **Live Application:** [https://travel-planner-frontend-silk.vercel.app/](https://travel-planner-frontend-silk.vercel.app/)
- **API Documentation:** [https://travel-planner-backend-1-57c6.onrender.com/](https://travel-planner-backend-1-57c6.onrender.com/)

---

## ✨ Key Features in Detail

### 1. Smart Itinerary Builder
A multi-step, intelligent wizard that allows users to input their destination, budget, and travel style. The UI provides real-time feedback and skeleton states while the AI generates a personalized day-by-day schedule.

### 2. Multi-Role Dashboards
Dedicated layouts and functionalities for different users:
- **User Dashboard:** View upcoming trips, saved destinations, and personalized recommendations.
- **Admin Dashboard:** Comprehensive management of destinations, activities, accommodations, and user reviews.
- **Analytics:** Visual data representation using Recharts for booking trends and user growth.

### 3. Integrated Travel Chatbot
A persistent, context-aware chatbot available on all pages. It can answer questions about specific trips, suggest local hidden gems, or help with booking issues using the underlying Gemini model.

### 4. Interactive Destination Discovery
A high-performance grid system with AI-driven recommendations. Users can "heart" destinations to save them and receive better suggestions over time.

---

## 📂 Project Structure
Built with **Next.js App Router** for optimal performance and SEO.

```text
src/
├── app/                        # NEXT.JS PAGES & ROUTING
│   ├── (dashboard)/            # Shared Dashboard Layouts
│   │   ├── dashboard/          # User Dashboard
│   │   └── dashboard/admin/    # Admin Control Panel
│   ├── destinations/           # Destination Explorer ([id] dynamic routes)
│   ├── login/ & register/      # Authentication Pages
│   └── ...                     # Static Pages (About, Blog, Contact, etc.)
├── components/                 # REUSABLE UI COMPONENTS
│   ├── admin/                  # Specialized Admin components (DataTables, Uploaders)
│   ├── chat/                   # TravelChatbot logic & UI
│   ├── dashboard/              # Shared dashboard widgets
│   ├── shared/                 # Navbar, Footer, ModeToggle
│   └── ui/                     # Shadcn UI (Radix base components)
├── lib/                        # Auth-client, AxiosInstance, Utils
├── providers/                  # Theme, Query, and Lenis Scroll Providers
├── store/                      # Zustand State (App & Notifications)
└── styles/                     # Tailwind & Global CSS
```

---

## 🤖 AI Experience
We've integrated AI into the very core of the user journey:
- **Natural Language Planning:** Simply type "A 5-day food tour in Tokyo" and let the AI build your schedule.
- **AI Recommendations:** Smart suggestions for hotels and activities based on your travel history and preferences.
- **Generative UI:** Dynamic components that adapt based on AI-generated data.
- **Progressive Loading:** Smooth transitions and skeletons while the AI "thinks" and generates content.

## 🛠 Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion & GSAP
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod
- **UI Components:** Shadcn UI (Radix UI)
- **Authentication:** Better Auth (Client)
- **Icons:** Lucide React

## 🚀 Advanced Implementation
- **Optimistic Updates:** Using TanStack Query for instant UI feedback on actions.
- **Custom Smooth Scroll:** Integrated Lenis for a premium feel.
- **Role-Based Routing:** Sophisticated middleware to protect routes based on user roles.
- **Theme Support:** Fully functional Dark/Light mode with optimized contrast ratios.
- **Performance:** Dynamic imports and image optimization for sub-second load times.

---

## 🔑 Environment Variables
Create a `.env.local` file in the root directory:

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Optional Demo Login
NEXT_PUBLIC_DEMO_LOGIN_EMAIL=user@tripplanner.com
NEXT_PUBLIC_DEMO_LOGIN_PASSWORD=password123
```

---

## 🚀 Setup & Installation

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Start Development Server**
   ```bash
   npm run dev
   ```
4. **Build for Production**
   ```bash
   npm run build
   ```

---

## 👥 Demo Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | admin@tripplanner.com | password123 |
| **Travel Agent** | agent@tripplanner.com | password123 |
| **Regular User** | user@tripplanner.com | password123 |

---

© 2026 TRIPPLANNERAI. All rights reserved.
