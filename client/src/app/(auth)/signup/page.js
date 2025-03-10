"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminRegistrationPage() {
  const [countries, setCountries] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(
          "https://countriesnow.space/api/v0.1/countries/positions"
        );
        if (!res.ok) throw new Error("Failed to fetch countries");
        const data = await res.json();
        const countryOptions = data.data.map((country) => ({
          value: country.name,
          label: country.name,
        }));
        setCountries(countryOptions);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validation Functions
  const validateName = (name) => {
    const namePattern = /^[a-zA-Z\s]{1,30}$/;
    return namePattern.test(name);
  };
  const validateMobileNumber = (mobileNumber) => {
    return /^\d{11}$/.test(mobileNumber);
  };
  const validateEmail = (email) => {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return emailPattern.test(email);
  };

  // Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!validateName(formData.name)) {
      newErrors.name =
        "Name must contain only letters and be between 1 and 30 characters long.";
    }
    if (!validateMobileNumber(formData.phone)) {
      newErrors.phone =
        "Please enter a valid mobile number with exactly 11 digits.";
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be between 10 and 36 characters long.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);

    // If no errors, proceed to submit the form
    if (Object.keys(newErrors).length === 0) {
      console.log("Successfully submitted");
      console.log("Submitted Data:", formData);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-sky-100 p-5 text-black font-popins">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-2xl w-1/2 text-black "
      >
        <h2 className="text-3xl font-bold mb-10 text-center ">Signup Form</h2>

        {/* Name */}
        <div className="mb-2">
          <label className="block text-gray-700 text-sm">
            Name <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Full Name"
              maxLength={32}
              value={formData.name}
              onChange={handleChange}
              className={`w-full py-2 px-3 border border-gray-300 rounded-lg bg-gray-100 placeholder-gray-500 ${
                errors.name ? "border-red-500" : ""
              }`}
              required
            />
          </div>
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>

        {/*  Phone Number */}
        <div className="flex space-x-2 mb-2">
          <div className="w-full">
            <label htmlFor="phone" className="block text-sm text-gray-600">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="e.g., 01723456789"
              maxLength={11}
              value={formData.phone}
              onChange={handleChange}
              className={`w-full py-2 px-3 border border-gray-300 rounded-lg bg-gray-100 mt-1 ${
                errors.phone ? "border-red-500" : ""
              }`}
              required
            />
          </div>

          {errors.phone && <p className="text-red-500 mt-1">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div className="mb-2">
          <label htmlFor="email" className="block text-gray-700 text-sm">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="e.g., example@example.com"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            value={formData.email}
            onChange={handleChange}
            className={`w-full py-2 px-3 border border-gray-300 rounded-lg bg-gray-100 mt-1 ${
              errors.email ? "border-red-500" : ""
            }`}
            required
            title="Please enter a valid email address."
          />
          {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,36}"
            value={formData.password}
            onChange={handleChange}
            className={`w-full py-2 px-3 border border-gray-300 rounded-lg bg-gray-100 mt-1 ${
              errors.password ? "border-red-500" : ""
            }`}
            minLength="10"
            maxLength="36"
            required
            title="Password must be between 10 and 36 characters long, and contain an uppercase letter, a lowercase letter, a digit, and a special character."
          />
          {errors.password && (
            <p className="text-red-500 mt-1">{errors.password}</p>
          )}

          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 mt-2 text-sm"
          >
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,36}"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full py-2 px-3 border border-gray-300 rounded-lg bg-gray-100 mt-1 ${
              errors.confirmPassword ? "border-red-500" : ""
            }`}
            minLength="10"
            maxLength="36"
            required
            title="Password must be between 10 and 36 characters long, and contain an uppercase letter, a lowercase letter, a digit, and a special character."
          />
          {errors.confirmPassword && (
            <p className="text-red-500 mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="mb-2">
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>

        {/* Do you have an account?  */}
        <div className="text-center">
          <p className="text-sm font-light text-black mb-2">
            Do you have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-800 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
