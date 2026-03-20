# Smart City Management System

A full-stack MERN (MongoDB, Express, React, Node.js) web application designed to streamline urban services and city administration. The system provides separate portals for citizens and officers to manage city-related issues, service requests, and administrative tasks.

## 🚀 Project Overview

The Smart City Management System is a comprehensive platform that bridges the gap between citizens and city administration. It enables citizens to report issues like waste management, electricity complaints, and road maintenance, while allowing officers to manage these requests efficiently.

## 🛠 Tech Stack

- **Frontend**: React.js (Vite), React Router, Tailwind CSS, Axios, Chart.js, React-Leaflet
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Authentication**: JSON Web Token (JWT)
- **Security**: bcryptjs for password hashing
- **Development**: ESLint, PostCSS, Vite

## ✨ Features

### For Citizens:
- **Secure Registration & Login**: Create accounts and log in securely.
- **Issue Reporting**: Submit service requests/complaints with categories (Waste, Water, Roads, etc.).
- **Dashboard**: Track the status of submitted complaints in real-time.
- **Profile Management**: Manage personal details and view history.

### For Officers:
- **Admin Dashboard**: Overview of all city complaints and analytics.
- **Issue Management**: View, track, and update the status of citizen requests (Pending, In Progress, Resolved).
- **Interactive Maps**: View complaint locations using Leaflet.
- **Service Oversight**: Manage different city departments efficiently.

### General:
- **Role-Based Access Control (RBAC)**: Distinct permissions for Citizens and Officers.
- **Persistent Sessions**: Stay logged in across refreshes using localStorage.
- **RESTful APIs**: Well-structured backend endpoints.
- **Responsive Design**: Fully functional across all device sizes.

## 🏗 System Architecture

The application follows a client-server architecture:
1.  **Frontend (React)**: Handles the UI, routing, and state management.
2.  **Backend (Express/Node)**: Provides RESTful API endpoints, handles business logic, and authentication.
3.  **Database (MongoDB)**: Stores user data, complaints, and service logs.
4.  **Auth (JWT)**: Ensures secure communication between client and server.

## ⚙️ Installation and Setup Instructions

### Prerequisites:
- Node.js (v16+ recommended)
- MongoDB Atlas account
- Git

### Steps:

1. **Clone the Repository:**
   ```bash
   git clone <your-repository-url>
   cd "smart city management"
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory and add the environment variables listed below.

3. **Frontend Setup:**
   ```bash
   cd ../smart-city-frontend
   npm install
   ```
   Create a `.env` file in the `smart-city-frontend` directory.

4. **Run the Application:**
   
   *In the server directory:*
   ```bash
   npm run dev
   ```
   *In the frontend directory:*
   ```bash
   npm run dev
   ```

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_ORIGIN=http://localhost:5174
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🛣 API Endpoints (Examples)

### Auth Routes (`/api/auth`)
- `POST /register`: Register a new user (Citizen/Officer)
- `POST /login`: Login and receive JWT token

### Complaint Routes (`/api/complaints`)
- `GET /`: Get all complaints (Officer) or user-specific (Citizen)
- `POST /`: Create a new complaint
- `PUT /:id`: Update complaint status (Officer)

### Dashboard Routes (`/api/dashboard`)
- `GET /stats`: Get complaint statistics for analytics

## 📂 Folder Structure

```
smart-city-management/
├── server/                 # Backend Node/Express app
│   ├── config/             # DB connection
│   ├── controllers/        # Route logic
│   ├── middleware/         # Auth & error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   └── server.js           # Entry point
├── smart-city-frontend/    # Frontend React app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth state management
│   │   ├── pages/          # Main views
│   │   ├── services/       # Axios API config
│   │   └── App.jsx         # Routing
│   └── vite.config.js
└── README.md
```

## 📸 Screenshots

*Add screenshots here to showcase your beautiful UI!*
- Citizen Dashboard
- Officer Dashboard
- Complaint Form
- Analytics Chart

## 🔮 Future Improvements

- [ ] Email/SMS notifications for status updates.
- [ ] Real-time chat between Citizens and Officers.
- [ ] AI-based complaint categorization.
- [ ] Mobile application version.

## 👤 Author

**Pallavi**  
<<<<<<< HEAD
- GitHub: [pallavi-github-link](https://github.com/palla)
=======
- GitHub: [pallavi-github-link](https://github.com/pallavi-shankarappa)
- Vercel:https://smart-city-management-system-kappa.vercel.app/
>>>>>>> 522c2a2f62e1ebfa3a593cf9f7d368d07b357bd4

---
*Developed with ❤️ for a Smarter City.*
