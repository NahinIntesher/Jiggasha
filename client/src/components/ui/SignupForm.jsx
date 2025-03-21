"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminRegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  // Validation functions here
  const validateName = (name) => /^[a-zA-Z\s]{1,30}$/.test(name);
  const validateMobileNumber = (mobile) => /^\d{11}$/.test(mobile);
  const validateEmail = (email) =>
    /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email);
  const validatePassword = (password) =>
    password.length >= 10 && password.length <= 36;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateName(formData.name)) newErrors.name = "Invalid name.";
    if (!validateMobileNumber(formData.mobile))
      newErrors.mobile = "Invalid mobile.";
    if (!validateEmail(formData.email)) newErrors.email = "Invalid email.";
    if (!validatePassword(formData.password))
      newErrors.password = "Password too short.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const result = await response.json();

      if (result.status === "Success") {
        console.log("Signup successful.");
      } else {
        setErrors({ general: result.Error || "Signup failed." });
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setErrors({ general: "An error occurred, please try again later." });
    }
  };

  return (
    <div className="bg-white md:w-sm px-8 py-6 flex flex-col justify-center rounded-xl shadow-xl md:min-w-3xl sm:min-w-xl overflow-hidden border border-gray-300">
      {/* Header */}
      <div className="mb-4 text-center">
        <h2 className="text-3xl font-bold text-black mb-4">Signup</h2>
        <p className="text-gray-600">Create your account</p>
      </div>

      {/* General Errors */}
      {errors.general && (
        <p className="text-red-500 text-center text-sm mb-1">
          {errors.general}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-2">
          <label htmlFor="name" className="block text-black text-sm">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full py-2 px-3 border text-black border-gray-300 rounded-lg bg-gray-100 mt-1 focus:ring-0 focus:outline-none focus:border-orange-400"
            required
          />
          {errors.name && (
            <p className="text-red-500 mt-1 text-xs">{errors.name}</p>
          )}
        </div>

        {/* Mobile */}
        <div className="mb-2">
          <label htmlFor="mobile" className="block text-black text-sm">
            Mobile Number
          </label>
          <input
            type="text"
            id="mobile"
            name="mobile"
            placeholder="e.g., 01723456789"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full py-2 px-3 border text-black border-gray-300 rounded-lg bg-gray-100 mt-1 focus:ring-0 focus:outline-none focus:border-orange-400"
            required
          />
          {errors.mobile && (
            <p className="text-red-500 mt-1 text-xs">{errors.mobile}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-2">
          <label htmlFor="email" className="block text-black text-sm">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="e.g., example@example.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full py-2 px-3 border text-black border-gray-300 rounded-lg bg-gray-100 mt-1 focus:ring-0 focus:outline-none focus:border-orange-400"
            required
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
            className="w-full py-2 px-3 border text-black border-gray-300 rounded-lg bg-gray-100 mt-1 focus:ring-0 focus:outline-none focus:border-orange-400"
            minLength="10"
            maxLength="36"
            required
          />
          {errors.password && (
            <p className="text-red-500 mt-1 text-xs">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-black text-sm">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="•••••••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full py-2 px-3 border text-black border-gray-300 rounded-lg bg-gray-100 mt-1 focus:ring-0 focus:outline-none focus:border-orange-400"
            required
          />
          {errors.confirmPassword && (
            <p className="text-red-500 mt-1 text-xs">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="mb-4 mt-5">
          <button
            type="submit"
            className="w-full p-3 font-bold bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300"
          >
            Sign Up
          </button>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm font-light text-black mb-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-orange-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
