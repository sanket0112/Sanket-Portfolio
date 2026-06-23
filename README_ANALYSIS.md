# Project Analysis: MERN Stack Portfolio

This document contains a comprehensive statistical analysis of the MERN Stack Portfolio project, designed to be used directly in engineering presentations and architectural documentation.

---

## 1. Project Overview

| Category | Value |
| :--- | :--- |
| **Project Name** | Sanket Portfolio (MERN Monorepo) |
| **Tech Stack** | React.js, Node.js, Express.js, MongoDB, Vite |
| **Total Files** | 74 |
| **Total Folders** | 19 |
| **Total Lines of Code** | 10,241 |
| **Total Assets** | 13 |

---

## 2. Language Usage (%)

Calculated based on exact line counts across the entire repository.

| Language / Format | Lines of Code | Percentage |
| :--- | :--- | :--- |
| **JSON (inc. package-locks)** | 6,200 | 60.5% |
| **JSX (React Templates)** | 1,249 | 12.2% |
| **JavaScript** | 844 | 8.2% |
| **CSS** | 580 | 5.7% |
| **HTML** | 14 | 0.1% |
| **Other (MD, SVG, etc.)** | 1,354 | 13.2% |

*Note: JSON percentage is heavily influenced by strict dependency locking (`package-lock.json`). If excluding lock files, JSX and JavaScript represent >75% of the written logic.*

---

## 3. Frontend vs Backend Code (%)

Calculated based on architectural directory splits.

| Architecture Layer | Lines of Code | Percentage |
| :--- | :--- | :--- |
| **Frontend (Client)** | 7,315 | 71.4% |
| **Backend (Server)** | 2,385 | 23.3% |
| **Shared / Root Configs** | 541 | 5.3% |

---

## 4. Framework & Technology Usage (Estimated Contribution)

Based on module imports, dependency weight, and file allocation.

| Technology | Role | Percentage |
| :--- | :--- | :--- |
| **React.js & Vite** | Frontend UI & Build Tooling | 45% |
| **Node.js** | Runtime Environment | 15% |
| **Express.js** | Backend Routing & API | 10% |
| **MongoDB / Mongoose** | Database & ODM | 8% |
| **CSS / UI Libraries** | Styling & Glassmorphism | 10% |
| **JWT & bcryptjs** | Authentication & Security | 4% |
| **Axios** | Client-Server Communication | 3% |
| **Other Libraries** | Framer Motion, Particles, etc. | 5% |

---

## 5. React (Frontend) Statistics

| Category | Value |
| :--- | :--- |
| **Total Components** | 7 |
| **Total Pages** | 7 |
| **Reusable Components** | 7 |
| **Custom Hooks** | 1 |

---

## 6. Backend (Node/Express) Statistics

| Category | Value |
| :--- | :--- |
| **API Endpoints** | 13 |
| **Route Modules** | 6 |
| **Controllers** | 5 |
| **Database Models** | 5 |
| **Middleware** | 2 |

---

## 7. UI & Interaction Statistics

| UI Element / Feature | Count |
| :--- | :--- |
| **Responsive Grid/Flex Sections**| 54 |
| **Framer Motion Animations** | 50 |
| **Glassmorphism Cards/Panels** | 19 |
| **Interactive Buttons** | 12 |
| **Input Forms** | 4 |

---

## 8. Implemented Project Features

* **Full MERN Stack Architecture**: Complete integration of MongoDB, Express, React, and Node.
* **JWT Authentication**: Secure user login, registration, and session management using JSON Web Tokens.
* **Role-Based Access Control**: Separation of standard users and Administrator privileges.
* **Admin Dashboard**: Specialized route for managing site analytics, reading contact messages, and toggling user block/ban status.
* **Dynamic Database Routing**: Express routers and controllers handling CRUD operations.
* **Advanced UI Animations**: Page transitions and micro-interactions powered by Framer Motion.
* **Responsive Glassmorphism**: Premium frosted-glass UI aesthetic with custom CSS tokens.
* **Secure Monorepo Deployment**: Configured for Vercel (Frontend) and Render (Backend) with proxy rewrites.

---

## 9. Suggested Charts for PowerPoint Presentation

To effectively present this data to stakeholders or interviewers, the following chart types are highly recommended:

1. **Doughnut Chart**: **Frontend vs Backend Split**
   * *Why:* Highlights the UI-heavy nature of the portfolio (71.4% Frontend) while showing a solid backend foundation.
2. **Pie Chart**: **Technology Usage**
   * *Why:* Perfect for showing the 45% React, 15% Node, 10% Express breakdown in a classic "Tech Stack" visual.
3. **Bar Chart**: **Backend Capabilities**
   * *Why:* Displaying Models (5), Controllers (5), Routes (6), and API Endpoints (13) side-by-side proves structural backend complexity.
4. **Progress Bars**: **UI Statistics**
   * *Why:* Visually impressive way to show 50+ Animations and 54+ Responsive Sections to emphasize frontend polish.

---

## 10. Professional AI System Prompt to Recreate This Project

Below is a highly specific, production-ready system prompt that can be fed into any advanced AI coding assistant to rebuild this exact workspace from scratch:

```text
Act as a Principal Full-Stack Engineer and UI/UX Designer. Build a premium, production-ready MERN Stack (MongoDB, Express, React, Node.js) Professional Developer Portfolio with a built-in Administration Dashboard.

### Technical & Architectural Stack
1. **Frontend**: React.js built with Vite, utilizing React Router DOM (v6+), Axios for API requests, Framer Motion for premium micro-animations/page transitions, and tsparticles (react-particles) for an interactive background.
2. **Backend**: Node.js & Express.js server utilizing a RESTful architecture, Mongoose ODM for MongoDB, CORS, Dotenv, and standard error-handling middlewares.
3. **Authentication**: JWT-based session security with bcryptjs for password hashing. Implement separate user authentication and admin-only credentials/privileges.
4. **Styling**: Modern, responsive dark-themed Glassmorphism aesthetic. Use CSS variables, frosted-glass filters (`backdrop-filter: blur()`), glowing borders, and flexbox/grid for cross-device responsiveness. No generic/plain colors.

### Database Schema (Mongoose Models)
1. **User**: Name, Email, Password, Role (User/Admin), Status (Active/Blocked), Timestamps.
2. **Admin**: Username, Email, Password, Security Logs, Timestamps.
3. **Project**: Title, Description, Image URL, Technologies (Array), Live Link, GitHub Link, Category.
4. **Message**: Name, Email, Subject, Message, Status (Read/Unread), SentAt.
5. **Analytics**: Views (Number), DeviceStats (Object), DailyVisits (Array), LastResetDate.

### Backend Endpoints (/api/...)
- `/api/users`: Registration, Login, Profile, Block/Unblock, Delete.
- `/api/admin`: Login, Statistics, Activity Logs.
- `/api/projects`: Public GET (all), Admin POST/PUT/DELETE.
- `/api/messages`: Contact Form POST (public), Admin GET/PUT/DELETE.
- `/api/analytics`: GET stats, POST page-visit increment.
- `/api/resume`: Public GET resume download.

### Frontend Pages & Features
1. **Home**: Hero section, interactive social cards, skills matrix with icons, education timeline, and professional experience timeline.
2. **Projects**: Filterable gallery of projects with search, hover effects, and cards showcasing links and tags.
3. **Contact**: Interactive form with validator connecting to the message POST endpoint.
4. **Auth Pages**: Login and signup with error/success alerts.
5. **Admin Dashboard**: Secure metrics panel (total users, unread messages, projects count), active user management table (toggle block status, delete user), and an inbox to read/delete incoming contact messages.

### Project Layout (Monorepo)
- Root: `package.json` utilizing `concurrently` to run backend and frontend simultaneously.
- `/server`: Core Express setup, MongoDB connection config, controllers, middlewares, models, routes, and `.env` template.
- `/client`: Vite configuration, `src/components`, `src/pages`, `src/services` (API integrations), `src/hooks`, stylesheet (`index.css`, `App.css`), and assets.
```
