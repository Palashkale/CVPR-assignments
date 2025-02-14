import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Shield } from "lucide-react";
import axios from "axios";

// Adjust interface to handle both user and admin data
interface User {
  name: string;
}

interface Admin {
  adminName: string; // Updated field to match API response
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  const [admin, setAdmin] = useState<Admin | null>(
    JSON.parse(localStorage.getItem("admin") || "null"),
  );
  const navigate = useNavigate();
  const location = useLocation(); // Track location changes

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const { data } = await axios.get<{ user: User; token: string }>(
          "http://localhost:3000/api/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (data.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));

          // Update token in case it's refreshed
          if (data.token) {
            localStorage.setItem("token", data.token);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    };

    fetchUser();
  }, [location]);

  // Fetch admin data
  useEffect(() => {
    const fetchAdmin = async () => {
      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) {
        setAdmin(null);
        return;
      }

      try {
        const { data } = await axios.get<{ admin: Admin; token: string }>(
          "http://localhost:3001/api/admin/profile",
          {
            headers: { Authorization: `Bearer ${adminToken}` },
          },
        );

        if (data.admin) {
          setAdmin(data.admin);
          localStorage.setItem("admin", JSON.stringify(data.admin));

          // Update token in case it's refreshed
          if (data.token) {
            localStorage.setItem("adminToken", data.token);
          }
        }
      } catch (error) {
        console.error("Failed to fetch admin data", error);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        setAdmin(null);
      }
    };

    fetchAdmin();
  }, [location]);

  // Handle logout for both user and admin
  const handleLogout = async () => {
    try {
      // Check if it's an admin or regular user and call the appropriate logout API
      if (admin) {
        await axios.post("http://localhost:3001/api/admin/logout", {});
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        setAdmin(null);
      } else if (user) {
        await axios.post("http://localhost:3000/api/logout", {});
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }

      navigate("/home");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/home" className="flex items-center">
            <Shield className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">
              HealthCare Assistant
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            {admin ? (
              <>
                <span className="text-gray-900 font-medium">
                  Welcome, Admin {admin.adminName} {/* Displaying Admin Name */}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : user ? (
              <>
                <span className="text-gray-900 font-medium">
                  Welcome, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
