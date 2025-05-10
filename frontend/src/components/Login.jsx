import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  // ——— Validation helpers ———
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // same strong password rule
  const isValidPassword = (pw) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      pw
    );

  // ——— Form & errors ———
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "patient",
  });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // ——— Validate a single field ———
  const validateField = (field, value) => {
    let msg = "";
    if (field === "email") {
      if (!value.trim()) msg = "Email is required";
      else if (!isValidEmail(value)) msg = "Invalid email format";
    }
    if (field === "password") {
      if (!value) msg = "Password is required";
      // else if (!isValidPassword(value))
      //   msg =
      //     "Must be ≥8 chars, include uppercase, lowercase, number & special char";
    }
    setErrors((prev) => ({ ...prev, [field]: msg }));
  };

  // ——— Handle changes ———
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // ——— Check form validity ———
  const isFormValid = () =>
    form.email &&
    form.password &&
    Object.values(errors).every((e) => e === "");

  // ——— Submit ———
  const handleSubmit = async (e) => {
    e.preventDefault();
    validateField("email", form.email);
    validateField("password", form.password);
    if (!isFormValid()) {
      toast.error("Please fix the errors before signing in");
      return;
    }

    try {
      const userData = await login(
        form.email,
        form.password,
        form.role
      );
      toast.success("Login successful!");

      switch (userData.role) {
        case "admin":
          localStorage.setItem("adminAuth", userData.token);
          navigate("/admin/dashboard");
          break;
        case "doctor":
          localStorage.setItem("token", userData.token);
          navigate("/doctor/dashboard");
          break;
        case "patient":
          localStorage.setItem("patientAuth", userData.token);
          navigate("/patient/dashboard");
          break;
        default:
          toast.error("Unknown role");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md px-6 py-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center">
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-gray-600 text-center">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-3 border rounded-lg focus:outline-none transition ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-red-600 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-3 border rounded-lg focus:outline-none transition ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-red-600 text-sm">{errors.password}</p>
            )}
            <div className="flex justify-end mt-1">
              <button
                type="button"
                className="text-xs text-blue-600 hover:text-blue-500"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isFormValid()}
            className={`w-full py-3 rounded-lg text-white font-medium transition-transform transform ${
              isFormValid()
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
