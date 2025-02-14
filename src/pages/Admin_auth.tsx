import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

export default function AdminAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    adminName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
      navigate("/Admin_auth");
      return;
    }

    const checkAdminSession = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3001/api/admin/profile",
          {
            headers: { Authorization: `Bearer ${adminToken}` },
          },
        );

        if (data.admin) {
          localStorage.setItem("admin", JSON.stringify(data.admin));
          navigate("/admin-dashboard");
        }
      } catch (error) {
        console.error("Invalid admin session", error);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        navigate("/Admin_auth");
      }
    };

    checkAdminSession();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Email and password are required.");
      return;
    }

    if (!isLogin && !formData.adminName) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const endpoint = isLogin ? "/api/admin/login" : "/api/admin/signup";
      const { data } = await axios.post(
        `http://localhost:3001${endpoint}`, // Ensure the backend is correctly handling this route
        formData,
        {
          headers: {
            "Content-Type": "application/json", // Ensure the content type is set correctly
          },
          withCredentials: true, // Ensure your backend allows cross-origin requests if needed
        },
      );

      // Store token and admin data in localStorage
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("admin", JSON.stringify(data.admin));

      window.location.reload();
      navigate("/admin-dashboard");
    } catch (error: unknown) {
      console.error("Admin authentication error:", error);
      // Type casting the error to AxiosError
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          alert(
            isLogin
              ? "Admin login failed. Invalid credentials."
              : "Admin signup failed. Please try again.",
          );
        } else {
          alert(
            isLogin
              ? "An error occurred during login."
              : "An error occurred during signup.",
          );
        }
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Admin Login" : "Create Admin Account"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Admin Name
              </label>
              <input
                type="text"
                name="adminName"
                value={formData.adminName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {isLogin ? "Login as Admin" : "Create Admin Account"}
          </button>

          <p className="text-sm text-center mt-4">
            {isLogin
              ? "Need an admin account?"
              : "Already have an admin account?"}{" "}
            <button
              type="button"
              className="text-indigo-600"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>

          <p className="text-sm text-center mt-2">
            Not an admin?{" "}
            <button
              type="button"
              className="text-indigo-600"
              onClick={() => navigate("/")}
            >
              User Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
