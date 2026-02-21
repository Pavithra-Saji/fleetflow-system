# FleetFlow - Modular Fleet & Logistics Management System

A centralized, rule-based digital platform that manages vehicles, drivers, trips, maintenance, fuel, and operational analytics. Built with the MERN stack (MongoDB, Express, React, Node.js) and Tailwind CSS.

## 🚀 Features
- **Role-Based Access Control**: Manager, Dispatcher, Safety Officer, Financial Analyst.
- **Vehicle Registry**: Manage fleet, capacity, and current statuses.
- **Driver Management**: Track licenses, expiry dates, and driver statuses.
- **Trip Dispatcher**: Core logic system with strict validation (status, capacities, licenses). Updates driver and vehicle states automatically.
- **Maintenance System**: Record service history and toggle vehicles in/out of the shop.
- **Analytics Dashboard**: View aggregate operational costs, utilization rates, fuel efficiency, and vehicle ROI. Includes CSV Export.

## 📂 Project Structure
```
fleetflow-system/
 ├── backend/            # Express REST API
 │    ├── config/        # DB Configuration
 │    ├── models/        # Mongoose Schemas
 │    ├── routes/        # API Routes
 │    ├── controllers/   # Business Logic
 │    ├── middleware/    # Auth & RBAC
 │    └── server.js      # App Entry
 │
 ├── frontend/           # React + Vite UI
 │    ├── src/
 │    │    ├── pages/    # Main Views
 │    │    ├── components/ # Reusable UI (Layout)
 │    │    ├── services/ # Axios API Configuration
 │    │    ├── context/  # Auth Context
 │    │    └── App.jsx   # Routing
```

## 🔐 Built-in Roles (Demo Data)
- **Manager**: `manager@fleetflow.com`
- **Dispatcher**: `dispatcher@fleetflow.com`
- **Safety Officer**: `safety@fleetflow.com`
- **Financial Analyst**: `finance@fleetflow.com`
*(Password for all seeded accounts is `password123`)*

## 🛠 Setup Instructions

### 1. Prerequisites
- **Node.js**: v16+
- **MongoDB**: Ensure MongoDB is running locally on port 27017 or update the `MONGODB_URI` in `backend/.env`.

### 2. Backend Setup
Open a terminal and navigate to the backend directory:
```bash
cd fleetflow-system/backend
npm install
```
*(Optional) Seed the database with sample data:*
```bash
node seeder.js
```
Start the backend server:
```bash
npm run dev
# or
npm start
```

### 3. Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd fleetflow-system/frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```

### 4. Access the App
Open your browser and navigate to the provided Vite URL (usually `http://localhost:5173`).
Login with `manager@fleetflow.com` / `password123` to access all features.
