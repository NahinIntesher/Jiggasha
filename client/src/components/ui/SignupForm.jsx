"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminRegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    username: "", // Added username field that was missing in state but used in form
    role: "student",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    classLevel: "",
    group: "",
    department: "",
  });
  const [errors, setErrors] = useState({});

  // List of available departments for University level
  const availableDepartments = [
    "Computer Science and Engineering",
    "Electrical and Electronics Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Biotechnology",
    "Industrial and Production Engineering",
    "Bachelor of Business Administration",
    "English Literature",
    "Physics",
    "Mathematics",
    "Law",
    "Pharmacy",
    "Architecture",
    "History",
    "Sociology",
    "Political Science",
    "Psychology",
    "Economics",
    "Accounting",
    "Marketing",
    "Finance",
    "Genetics",
    "Environmental Science",
    "Marine Engineering",
    "Nursing",
  ];

  // Validation functions here
  const validateName = (name) => /^[a-zA-Z\s]{1,30}$/.test(name);
  const validateMobileNumber = (mobile) => {
    const regex = /^(01[3-9])\d{8}$/;
    return regex.test(mobile);
  };
  const validateEmail = (email) => {
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return regex.test(email);
  };
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field when user starts typing again
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleClassLevelChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      classLevel: value,
      group: value === "9-12" ? formData.group : "", // Clear group if not 9-12
      department: value === "University" ? formData.department : "", // Clear department if not University
    });

    // Clear class level error when changed
    if (errors.classLevel) {
      setErrors({ ...errors, classLevel: undefined });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate fields
    if (!validateName(formData.name)) newErrors.name = "Invalid name.";
    if (!validateMobileNumber(formData.mobile))
      newErrors.mobile = "Invalid mobile number.";
    if (!validateEmail(formData.email))
      newErrors.email = "Invalid email address.";
    if (!validatePassword(formData.password))
      newErrors.password = "Password must meet requirements.";
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

      if (
        response.status === 400 &&
        result.Error === "Username already taken"
      ) {
        newErrors.username = "Username already taken";
        setErrors(newErrors);
      } else if (result.status === "Success") {
        console.log("Signup successful.");
        router.push("/login");
      } else {
        setErrors({ general: result.Error || "Signup failed." });
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setErrors({ general: "An error occurred, please try again later." });
    }
  };

  // Helper function to determine input field border style
  const getInputClassName = (fieldName) => {
    const baseClasses =
      "w-full py-2 px-3 border text-black rounded-lg bg-gray-100 mt-1 focus:ring-0 focus:outline-none focus:border-orange-400";
    return errors[fieldName]
      ? `${baseClasses} border-red-500`
      : `${baseClasses} border-gray-300`;
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
            className={getInputClassName("name")}
            required
          />
          {errors.name && (
            <p className="text-red-500 mt-1 text-xs">{errors.name}</p>
          )}
        </div>

        {/* Username */}
        <div className="mb-2">
          <label htmlFor="username" className="block text-black text-sm">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className={getInputClassName("username")}
            required
          />
          {errors.username && (
            <p className="text-red-500 mt-1 text-xs">{errors.username}</p>
          )}
        </div>

        {/* Class Level */}
        <div className="mb-2">
          <label htmlFor="classLevel" className="block text-black text-sm">
            Class Level
          </label>
          <select
            id="classLevel"
            name="classLevel"
            value={formData.classLevel}
            onChange={handleClassLevelChange}
            className={getInputClassName("classLevel")}
            required
          >
            <option value="">Select Class Level</option>
            <option value="6-8">6-8</option>
            <option value="9-12">9-12</option>
            <option value="University">University</option>
          </select>
          {errors.classLevel && (
            <p className="text-red-500 mt-1 text-xs">{errors.classLevel}</p>
          )}
        </div>

        {/* Group (Only for 9-12) */}
        {formData.classLevel === "9-12" && (
          <div className="mb-2">
            <label htmlFor="group" className="block text-black text-sm">
              Group
            </label>
            <input
              type="text"
              id="group"
              name="group"
              placeholder="e.g., Science, Commerce, Arts"
              value={formData.group}
              onChange={handleChange}
              className={getInputClassName("group")}
              required
            />
            {errors.group && (
              <p className="text-red-500 mt-1 text-xs">{errors.group}</p>
            )}
          </div>
        )}

        {/* Department (Only for University) */}
        {formData.classLevel === "University" && (
          <div className="mb-2">
            <label htmlFor="department" className="block text-black text-sm">
              Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={getInputClassName("department")}
              required
            >
              <option value="">Select Department</option>
              {availableDepartments.map((department, index) => (
                <option key={index} value={department}>
                  {department}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="text-red-500 mt-1 text-xs">{errors.department}</p>
            )}
          </div>
        )}

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
            className={getInputClassName("mobile")}
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
            className={getInputClassName("email")}
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
            className={getInputClassName("password")}
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
            className={getInputClassName("confirmPassword")}
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
