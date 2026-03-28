# Smart City Management System

A professional full-stack MERN (MongoDB, Express, React, Node.js) web application designed to streamline urban services and city administration. The system provides separate portals for citizens and officers to manage city-related issues, service requests, and administrative tasks with robust validation and error handling.

##  Project Overview

The Smart City Management System is a comprehensive platform that bridges the gap between citizens and city administration. It enables citizens to report issues like waste management, electricity complaints, and road maintenance, while allowing officers to manage these requests efficiently through a streamlined workflow.

##  Tech Stack

- **Frontend**: React.js (Vite), React Router, Tailwind CSS, Axios, Chart.js, React-Leaflet, i18next (Internationalization)
- **Backend**: Node.js, Express.js (ES Modules)
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Authentication**: JSON Web Token (JWT) with Role-Based Access Control
- **Security**: bcryptjs for password hashing, express-validator for request validation
- **Development**: ESLint, PostCSS, Vite, Nodemon

##  Features

### For Citizens:
- **Secure Registration & Login**: Detailed registration including phone numbers.
- **Issue Reporting**: Submit service requests/complaints with categories (Waste, Water, Roads, etc.) and location pinning.
- **Dashboard**: Track the status of submitted complaints in real-time.
- **Multilingual Support**: Available in English, Hindi, and Kannada.

### For Officers:
- **Admin Dashboard**: Overview of all city complaints with real-time analytics.
- **Issue Management**: View, track, and update the status of citizen requests (**Pending → In Progress → Resolved**).
- **Interactive Maps**: View exact complaint locations using Leaflet.
- **Department Oversight**: Officers are categorized by departments (Water, Road, Electricity, etc.).

### General:
- **Professional Validation**: Comprehensive backend validation using `express-validator`.
- **Robust Error Handling**: Detailed API error responses and frontend alerts.
- **Role-Based Access Control (RBAC)**: Distinct permissions for Citizens, Officers, and Admins.
- **Persistent Sessions**: Secure JWT-based authentication persisted in localStorage.
- **Responsive Design**: Optimized for all device sizes using Tailwind CSS.

##  System Architecture

The application follows a clean client-server architecture:
1.  **Frontend (React)**: Handles the UI, routing, state management, and internationalization.
2.  **Backend (Express/Node)**: Follows MVC pattern, provides RESTful API endpoints, and handles business logic.
3.  **Database (MongoDB)**: Stores user data, complaints, and service logs with strict schemas.
4.  **Auth (JWT)**: Ensures secure communication between client and server.

##  Installation and Setup Instructions

### Prerequisites:
- Node.js (v18+ recommended)
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
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory based on `.env.example`.

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory based on `.env.example`.

4. **Run the Application:**
   
   *In the backend directory:*
   ```bash
   npm run dev
   ```
   *In the frontend directory:*
   ```bash
   npm run dev
   ```

##  Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

##  API Endpoints (Examples)

### Auth Routes (`/api/auth`)
- `POST /register`: Register a new user (Requires: `name`, `email`, `password`, `role`, `phone`, and `department` for officers)
- `POST /login`: Login and receive JWT token

### Complaint Routes (`/api/complaints`)
- `GET /`: List complaints (Filtered by role)
- `POST /`: Create a new complaint (Requires: `title`, `description`, `category`, `ward`, `location`)
- `GET /:id`: Get detailed complaint info
- `PUT /:id/status`: Update status (Officer only: **Pending → In Progress → Resolved**)

### Dashboard Routes (`/api/dashboard`)
- `GET /stats`: Get real-time statistics for analytics

##  Folder Structure

```
smart-city-management/
├── backend/                 # Node.js + Express API (ES Modules)
│   ├── config/              # DB connection & Configuration
│   ├── controllers/         # Business Logic (Auth, Complaint, Dashboard, User)
│   ├── middleware/          # Auth, Validation, & Uploads
│   ├── models/              # Mongoose Schemas (User, Complaint)
│   ├── routes/              # Express Routes
│   └── server.js            # Entry point
├── frontend/                # React.js + Vite app
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Auth state management
│   │   ├── pages/           # Main views (Citizen/Officer Dashboards)
│   │   ├── services/        # Axios API configuration
│   │   └── App.jsx          # Routing & Layout
│   └── vite.config.js
└── README.md
```

##  Screenshots
   <img width="1596" height="852" alt="image" src="https://github.com/user-attachments/assets/c7e4d5a3-2013-46fa-958b-9f2ff91bd24f" />

- **Citizen Dashboard**: Real-time tracking of issues.
  <img width="1600" height="844" alt="image" src="https://github.com/user-attachments/assets/50d15866-db7e-4a91-aa9d-1b2ff9e7fb8a" />

- **Officer Dashboard**: Cross-department visibility and analytics.
  <img width="1600" height="836" alt="image" src="https://github.com/user-attachments/assets/4248a759-ff7a-47f7-97df-33a6b4b94fff" />

- **Interactive Map**: Geographical distribution of complaints.
  <img width="1600" height="852" alt="image" src="https://github.com/user-attachments/assets/23e2439a-30d0-4f39-a89b-faa5cd0b8ff0" />


##  Future Improvements

- [ ] AI-based automated complaint categorization.
- [ ] Real-time chat between Citizens and Officers.
- [ ] Email/SMS notifications for every status update.
- [ ] Mobile application (React Native).

##  Author

**Pallavi**  
- GitHub: [pallavi-shankarappa](https://github.com/pallavi-shankarappa)
- Live Demo: [Smart City Platform](https://smart-city-management-system-kappa.vercel.app/)

---
*Developed with ❤️ for a Smarter City.*
