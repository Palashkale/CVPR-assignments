import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/Admin_auth";
import AdminDashboard from "./pages/admin-dashboard";

import { HealthDashboard } from "./pages/HealthDashboard";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Navbar />
        <Routes>
          <Route path="/home" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/Admin_auth" element={<AdminAuth />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <HealthDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
