import { useState } from "react";
import API from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  // ——— Validation helpers ———
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ≥8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
  const isValidPassword = (pw) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      pw
    );

  const isValidMobile = (m) => /^\d{10}$/.test(m);
  const isPositiveNumber = (n) =>
    /^\d+$/.test(n) && Number(n) > 0;

  // ——— Only these domains are allowed ———
  const verifiedDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "yourcompany.com",
    // add more as needed
  ];

  // ——— Form state ———
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    age: "",
    mobile: "",
    gender: "Male",
  });

  // ——— Per‑field error messages ———
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    mobile: "",
  });

  const navigate = useNavigate();

  // ——— Validate a single field ———
  const validateField = (field, value) => {
    let msg = "";

    switch (field) {
      case "name":
        if (!value.trim()) msg = "Name is required";
        break;

      case "email":
        if (!value.trim()) {
          msg = "Email is required";
        } else if (!isValidEmail(value)) {
          msg = "Invalid email format";
        } else {
          const domain = value.split("@")[1]?.toLowerCase();
          if (!verifiedDomains.includes(domain)) {
            msg = `Email domain must be one of: ${verifiedDomains.join(
              ", "
            )}`;
          }
        }
        break;

      case "password":
        if (!value) msg = "Password is required";
        else if (!isValidPassword(value))
          msg =
            "Must be ≥8 chars, include uppercase, lowercase, number & special char";
        break;

      case "age":
        if (!value) msg = "Age is required";
        else if (!isPositiveNumber(value))
          msg = "Enter a valid age";
        break;

      case "mobile":
        if (!value) msg = "Mobile number is required";
        else if (!isValidMobile(value))
          msg = "Must be 10 digits";
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: msg }));
  };

  // ——— Handle input changes ———
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // ——— Check full form validity ———
  const isFormValid = () =>
    form.name.trim() &&
    isValidEmail(form.email) &&
    verifiedDomains.includes(form.email.split("@")[1]?.toLowerCase()) &&
    isValidPassword(form.password) &&
    isPositiveNumber(form.age) &&
    isValidMobile(form.mobile) &&
    Object.values(errors).every((e) => e === "");

  // ——— On submit ———
  const handleSubmit = async (e) => {
    e.preventDefault();
    // final validation
    Object.entries(form).forEach(([f, v]) => validateField(f, v));
    if (!isFormValid()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      await API.post("/auth/register", form);
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md px-6 py-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center">
          Create Account
        </h2>
        <p className="mt-2 text-sm text-gray-600 text-center">
          Join us to manage your healthcare journey
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-3 border rounded-lg focus:outline-none transition ${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-red-600 text-sm">{errors.name}</p>
            )}
          </div>

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
          </div>

          {/* Mobile & Age */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                className={`mt-1 block w-full px-4 py-3 border rounded-lg focus:outline-none transition ${
                  errors.mobile
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.mobile && (
                <p className="mt-1 text-red-600 text-sm">{errors.mobile}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
                className={`mt-1 block w-full px-4 py-3 border rounded-lg focus:outline-none transition ${
                  errors.age
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.age && (
                <p className="mt-1 text-red-600 text-sm">{errors.age}</p>
              )}
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
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
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
