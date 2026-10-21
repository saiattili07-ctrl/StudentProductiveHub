# Student Productivity Hub

A full-stack web app for students to manage tasks, track study sessions
and view productivity analytics.

## Features
- Register / login with secure cookie-based authentication
- Task manager (create, edit, complete, delete, filter by subject)
- Study session tracking
- Dashboard summary and Analytics charts (7 / 14 / 30 days)
- Profile page (edit details, change password)

## Tech Stack
- Client: React, Vite, React Router, Bootstrap, Recharts, Axios
- Server: Node.js, Express, MongoDB Atlas (Mongoose), JWT, bcryptjs,
  express-validator

## Setup

### 1. Server
```bash
cd server
npm install
```
Create `server/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
```
```bash
npm run dev
```

### 2. Client
```bash
cd client
npm install
```
Create `client/.env`:
```
VITE_API_URL=http://localhost:5000/api
```
```bash
npm run dev
```
Open http://localhost:5173

## API Overview
| Area | Endpoints |
|---|---|
| Auth | `/api/auth/register`, `/login`, `/logout`, `/me`, `/csrf-token` |
| Tasks | `/api/tasks` |
| Study | `/api/study` |
| Dashboard | `/api/dashboard`, `/api/dashboard/analytics?days=7` |
| Profile | `/api/profile`, `/api/profile/password` |

## Project Structure
```
Student Productivity Hub/
├── client/   React app
└── server/   Express API
```