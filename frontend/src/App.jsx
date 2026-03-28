import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OfficerDashboard from "./pages/OfficerDashboard";
import CitizenDashboard from "./pages/CitizenDashboard";
import ViewComplaints from "./pages/ViewComplaints";
import ComplaintDetails from "./pages/ComplaintDetails";
import ComplaintMap from "./pages/ComplaintMap";
import CreateComplaint from "./pages/CreateComplaint";
import Home from "./pages/Home";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<Layout />}>
          {/* Citizen */}
          <Route
            path="/citizen"
            element={
              <ProtectedRoute roles={["citizen"]}>
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/create"
            element={
              <ProtectedRoute roles={["citizen"]}>
                <CreateComplaint />
              </ProtectedRoute>
            }
          />

          {/* Officer */}
          <Route
            path="/officer"
            element={
              <ProtectedRoute roles={["officer"]}>
                <OfficerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/complaints"
            element={
              <ProtectedRoute roles={["officer"]}>
                <ViewComplaints />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/complaints/:id"
            element={
              <ProtectedRoute roles={["officer"]}>
                <ComplaintDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/map"
            element={
              <ProtectedRoute roles={["officer"]}>
                <ComplaintMap />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;