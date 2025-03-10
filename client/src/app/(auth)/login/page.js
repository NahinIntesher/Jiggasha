"use client";
import Image from "next/image";
import React, { useState } from "react";
// import desert from "/images/loginImage.jpg";
import Link from "next/link";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (formData.password.length < 10) {
      newErrors.password = "Password must be at least 10 characters long.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log("Successfully submitted");
      console.log("Submitted Data:", formData);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-2 bg-sky-100 font-popins text-black">
      {/* Form Section */}
      <div className="bg-white md:w-sm px-8 py-6 flex flex-col justify-center rounded-xl shadow-xl overflow-hidden border border-gray-300">
        {/* Header */}
        <div className="mb-4 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Login</h2>
          <p className="text-gray-600">Sign in to your account </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-2">
            <label htmlFor="email" className="block text-black text-sm">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full py-2 px-3 border text-black border-gray-300 rounded-lg bg-gray-100 mt-1"
              required
              title="Please enter a valid email address."
            />
            {errors.email && (
              <p className="text-red-500 mt-1 text-xs">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-2">
            <label htmlFor="password" className="block text-black text-sm">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="•••••••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full py-2 px-3 border text-black border-gray-300 rounded-lg bg-gray-100 mt-1"
              minLength="10"
              maxLength="36"
              required
            />
            {errors.password && (
              <p className="text-red-500 mt-1 text-xs">{errors.password}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between mb-6 text-xs">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  className="w-3 h-3 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="remember" className="text-black sm:text-xs">
                  Remember me
                </label>
              </div>
            </div>

            {/* Forgot Password */}
            <a
              href="#"
              className="text-xs font-medium text-blue-800 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <div className="mb-4 mt-5">
            <button
              type="submit"
              className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Login
            </button>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm font-light text-black mb-2">
              Don't have an account yet?{" "}
              <Link
                href="/signup"
                className="font-medium text-blue-800 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
