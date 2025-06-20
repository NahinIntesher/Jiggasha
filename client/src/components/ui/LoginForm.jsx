"use client";
import { useState } from "react";
import { Eye, EyeOff, AlertCircle, X } from "lucide-react"; // Added AlertCircle and X icons
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://jiggasha.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("Response from server:", result);

      if (result.status === "Success") {
        localStorage.setItem("token", result.token);
        router.replace("/dashboard");
      } else {
        setErrors({
          general:
            result.Error ||
            result.message ||
            "Invalid username or password. Please try again.",
        });
      }
    } catch (error) {
      console.log("Error during login:", error);
      setErrors({
        general:
          "Unable to connect to server. Please check your internet connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const dismissError = () => {
    setErrors({});
  };

  // Error Alert Component
  const ErrorAlert = ({ message, onDismiss }) => (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
      <AlertCircle className="text-red-500 w-5 h-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        {/* <p className="text-red-700 text-sm font-medium">Error</p> */}
        <p className="text-red-600 text-sm">{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-red-400 hover:text-red-600 flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );

  // Field Error Component
  const FieldError = ({ message }) => (
    <div className="mt-1 flex items-center space-x-1">
      <AlertCircle className="text-red-500 w-4 h-4" />
      <p className="text-red-500 text-xs">{message}</p>
    </div>
  );

  return (
    <div className="bg-white md:w-sm px-8 py-6 flex flex-col justify-center rounded-xl shadow-xl overflow-hidden border border-gray-300">
      {/* Header */}
      <div className="mb-4 text-center">
        <h2 className="text-3xl font-bold text-black mb-4">Login</h2>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      {/* General Error Alert */}
      {errors.general && (
        <ErrorAlert message={errors.general} onDismiss={dismissError} />
      )}

      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-black text-sm font-medium mb-1"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="example145"
            value={formData.username}
            onChange={handleChange}
            className={`w-full py-2 px-3 border rounded-lg bg-gray-100 mt-1 focus:ring-0 focus:outline-none transition-colors ${
              errors.username
                ? "border-red-300 focus:border-red-400 bg-red-50"
                : "border-gray-300 focus:border-orange-400 text-black"
            }`}
            required
          />
          {errors.username && <FieldError message={errors.username} />}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-black text-sm font-medium mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="•••••••••••••"
              value={formData.password}
              onChange={handleChange}
              className={`w-full py-2 px-3 border rounded-lg bg-gray-100 focus:ring-0 focus:outline-none pr-10 transition-colors ${
                errors.password
                  ? "border-red-300 focus:border-red-400 bg-red-50"
                  : "border-gray-300 focus:border-orange-400 text-black"
              }`}
              minLength="6"
              maxLength="36"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-gray-200 rounded-r-lg transition-colors"
            >
              {showPassword ? (
                <EyeOff className="text-gray-600 w-5 h-5" />
              ) : (
                <Eye className="text-gray-600 w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && <FieldError message={errors.password} />}
        </div>

        {/* Remember Me and Forgot Password */}
        <div className="flex items-center justify-between mb-6 text-xs">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                className="w-3 h-3 text-orange-600 focus:ring-orange-500 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="remember" className="text-black sm:text-xs">
                Remember me
              </label>
            </div>
          </div>

          <Link
            href="/forget-password"
            className="text-xs font-medium text-orange-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <div className="mb-2 mt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-3 rounded-lg transition duration-300 font-medium ${
              isLoading
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              "Login"
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="my-4 flex items-center justify-center">
          <div className="w-1/4 border-t border-gray-400"></div>
          <span className="mx-2 text-sm text-gray-600">or</span>
          <div className="w-1/4 border-t border-gray-400"></div>
        </div>

        {/* Google Login Button */}
        <div className="mb-4 mt-2">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className={`w-full p-3 rounded-lg transition duration-300 font-medium ${
              isLoading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-300 text-black hover:bg-gray-400"
            }`}
          >
            Continue with Google
          </button>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm font-light text-black mb-2">
            Don't have an account yet?{" "}
            <Link
              href="/signup"
              className="font-medium text-orange-600 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
