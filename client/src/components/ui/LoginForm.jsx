"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Importing Eye icons from lucide-react
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    try {
      console.log("Form data before submission");
      const response = await fetch("https://jiggasha.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status === "Success") {
        router.replace("/dashboard");
      } else {
        setErrors({ general: result.Error || "Invalid username or password" });
      }
    } catch (error) {
      console.log("Error during login:", error);
      setErrors({ general: "An error occurred, please try again later." });
    }
  };

  const handleGoogleLogin = () => {
    signIn("google");
  };

  return (
    <div className="bg-white md:w-sm px-8 py-6 flex flex-col justify-center rounded-xl shadow-xl overflow-hidden border border-gray-300">
      {/* Header */}
      <div className="mb-4 text-center">
        <h2 className="text-3xl font-bold text-black mb-4">Login</h2>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      {/* General Errors */}
      {errors.general && (
        <p className="text-red-500 text-center text-sm mb-1">
          {errors.general}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div className="mb-2">
          <label htmlFor="username" className="block text-black text-sm">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="example145"
            value={formData.username}
            onChange={handleChange}
            className="w-full py-2 px-3 border text-black border-gray-300 rounded-lg bg-gray-100 mt-1 focus:ring-0 focus:outline-none focus:border-orange-400"
            required
          />
          {errors.username && (
            <p className="text-red-500 mt-1 text-xs">{errors.username}</p>
          )}
        </div>

        {/* Password - Fixed icon alignment */}
        <div className="mb-2">
          <label htmlFor="password" className="block text-black text-sm">
            Password
          </label>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="•••••••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full py-2 px-3 border text-black border-gray-300 rounded-lg bg-gray-100 focus:ring-0 focus:outline-none focus:border-orange-400 pr-10"
              minLength="6"
              maxLength="36"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showPassword ? (
                <EyeOff className="text-gray-600 w-5 h-5" />
              ) : (
                <Eye className="text-gray-600 w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 mt-1 text-xs">{errors.password}</p>
          )}
        </div>

        {/* Remember Me and Forgot Password */}
        <div className="flex items-center justify-between mb-6 text-xs">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                className="w-3 h-3 text-orange-600 focus:ring-orange-500"
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
            className="w-full p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300"
          >
            Login
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
            className="w-full p-3 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition duration-300"
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
