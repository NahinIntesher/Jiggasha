"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { useParams } from "next/navigation";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    if (status.message) {
      setStatus({ type: "", message: "" });
    }
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setStatus({
        type: "error",
        message: "Password must be at least 6 characters long.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({
        type: "error",
        message: "Passwords do not match.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8000/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Your password has been reset successfully!",
        });
        setPassword("");
        setConfirmPassword("");
      } else {
        setStatus({
          type: "error",
          message:
            result.Error || "Failed to reset password. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      setStatus({
        type: "error",
        message: "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-10 px-2 bg-[#fffaf3] font-popins text-black">
      <div className="bg-white md:w-sm px-8 py-6 flex flex-col justify-center rounded-xl shadow-xl overflow-hidden border border-gray-300">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Reset Password</h2>
          <p className="text-gray-600">Enter your new password below</p>
        </div>

        {/* Status Message */}
        {status.message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              status.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-black text-sm mb-2">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter new password"
              value={password}
              onChange={handleChange(setPassword)}
              className="w-full py-3 px-4 border text-black border-gray-300 rounded-lg bg-gray-100 focus:ring-0 focus:outline-none focus:border-orange-400"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-black text-sm mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={handleChange(setConfirmPassword)}
              className="w-full py-3 px-4 border text-black border-gray-300 rounded-lg bg-gray-100 focus:ring-0 focus:outline-none focus:border-orange-400"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="mb-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300 flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                "Resetting..."
              ) : (
                <>
                  <Lock size={18} /> Reset Password
                </>
              )}
            </button>
          </div>

          {/* Back to Login Link */}
          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-orange-600 hover:text-orange-700"
            >
              <ArrowLeft size={16} className="mr-1" /> Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
