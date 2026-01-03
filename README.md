# Task Management App (PERN Stack)

A premium, full-stack Task Management application built with **PostgreSQL, Express, React, and Node.js**.
Features include user authentication (JWT), task CRUD operations, and a visual dashboard with a modern Dark Mode & Glassmorphism design.

## 🚀 Tech Stack

- **Frontend**: React, Redux Toolkit, Chart.js (Dark Mode Optimized)
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT & Bcrypt

## 🎨 UI Highlights

- **Glassmorphism**: Translucent cards with blur effects.
- **Dark Mode**: Deep blue/purple gradient background (`#1e1e2f`).
- **Animations**: Smooth fade-ins and hover effects.
- **Interactivity**: Dynamic chart updates and instant status toggling.

## 🛠️ Setup Instructions

### Prerequisites
- Node.js installed
- PostgreSQL installed and running

### 1. Start Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm start
```

## 📡 API Endpoints

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET/POST/PUT/DELETE /api/tasks`

## 🌍 Deployment

- **Frontend**: Deploy to Vercel (Ensure build command is `npm run build`).
- **Backend**: Deploy to Render/Railway.
- **Database**: Use Supabase for cloud PostgreSQL.

## 📸 Screenshots
*(Placeholders for new UI)*
- **Login Page**: Centered glass card on gradient background.
- **Dashboard**: Two-column layout with Chart on left, Tasks on right.

---
**Author**: Built with ❤️ for the assignment.
