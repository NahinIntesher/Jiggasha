"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (status.message) {
      setStatus({ type: "", message: "" });
    }
  };

  const validateEmail = (email) => {
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://jiggasha.onrender.com/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Password reset instructions have been sent to your email.",
        });
        setEmail("");
      } else {
        setStatus({
          type: "error",
          message:
            result.Error || "Failed to send reset email. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error during password reset request:", error);
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
      <div className="bg-white md:w-sm w-full max-w-md px-8 py-6 flex flex-col justify-center rounded-xl shadow-xl overflow-hidden border border-gray-300">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">
            Forgot Password
          </h2>
          <p className="text-gray-600">
            Enter your email to reset your password
          </p>
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

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-black text-sm mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={handleChange}
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
                "Sending..."
              ) : (
                <>
                  <Send size={18} /> Send Reset Link
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
