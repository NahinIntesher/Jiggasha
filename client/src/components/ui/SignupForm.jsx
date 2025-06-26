"use client";
import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminRegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldValidation, setFieldValidation] = useState({});

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
  // Validation functions
  const validateName = (name) => {
    if (!name || name.trim() === "") return false;
    return /^[a-zA-Z\s]{1,30}$/.test(name.trim());
  };

  const validateUsername = (username) => {
    if (!username || username.trim() === "") return false;
    return username.trim().length >= 3;
  };

  const validateMobileNumber = (mobile) => {
    if (!mobile) return false;
    const regex = /^(01[3-9])\d{8}$/;
    return regex.test(mobile);
  };

  const validateEmail = (email) => {
    if (!email || email.trim() === "") return false;
    if (!email.includes("@")) return false;
    if ((email.match(/@/g) || []).length !== 1) return false;
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email.trim());
  };

  const validatePassword = (password) => {
    if (!password) return false;
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time validation
    let isValid = false;
    switch (name) {
      case "name":
        isValid = validateName(value);
        break;
      case "username":
        isValid = validateUsername(value);
        break;
      case "mobile":
        isValid = validateMobileNumber(value);
        break;
      case "email":
        isValid = validateEmail(value);
        break;
      case "password":
        isValid = validatePassword(value);
        break;
      case "confirmPassword":
        isValid = value === formData.password && value !== "";
        break;
      default:
        isValid = value !== "";
    }

    setFieldValidation((prev) => ({ ...prev, [name]: isValid }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleClassLevelChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      classLevel: value,
      group: value === "9-12" ? formData.group : "",
      department: value === "University" ? formData.department : "",
    });

    setFieldValidation((prev) => ({ ...prev, classLevel: value !== "" }));

    if (errors.classLevel) {
      setErrors((prev) => ({ ...prev, classLevel: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate all required fields
    if (!validateName(formData.name)) {
      newErrors.name =
        "Name must contain only letters and spaces (1-30 characters).";
    }
    if (!validateUsername(formData.username)) {
      newErrors.username = "Username must be at least 3 characters long.";
    }
    if (!formData.classLevel) {
      newErrors.classLevel = "Please select a class level.";
    }
    if (formData.classLevel === "9-12" && !formData.group.trim()) {
      newErrors.group = "Group is required for class level 9-12.";
    }
    if (formData.classLevel === "University" && !formData.department) {
      newErrors.department = "Department is required for University level.";
    }
    if (!validateMobileNumber(formData.mobile)) {
      newErrors.mobile =
        "Please enter a valid Bangladeshi mobile number of 11 digits (e.g., 01723456789).";
    }
    if (!validateEmail(formData.email)) {
      newErrors.email =
        "Invalid email format. Email must contain @ symbol and valid domain (e.g., user@example.com).";
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = "Password must meet requirements";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    // If validation errors exist, show them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors and proceed with API call
    setErrors({});
    console.log("Form data is valid");

    try {
      const response = await fetch("https://jiggasha.onrender.com/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok && result.status === "Success") {
        // Success case
        console.log("Signup successful.");
        router.push("/login");
      } else {
        // Error case - map backend errors to form fields
        const errorMessage = result.error || "Signup failed";
        const apiErrors = {};

        if (errorMessage.includes("Username already exists")) {
          apiErrors.username = "Username already exists";
        } else if (errorMessage.includes("Email already registered")) {
          apiErrors.email = "Email already registered";
        } else if (errorMessage.includes("Mobile number already registered")) {
          apiErrors.mobile = "Mobile number already registered";
        } else {
          apiErrors.general = errorMessage;
        }

        setErrors(apiErrors);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setErrors({ general: "Network error. Please try again later." });
    }
  };

  const getInputClassName = (fieldName) => {
    const baseClasses =
      "w-full py-2 px-3 border text-black rounded-lg bg-gray-100 mt-1 focus:ring-0 focus:outline-none transition-all duration-200";

    if (errors[fieldName]) {
      return `${baseClasses} border-red-500 bg-red-50 focus:border-red-500 pr-10`;
    } else if (fieldValidation[fieldName] && formData[fieldName]) {
      return `${baseClasses} border-green-500 bg-green-50 focus:border-green-600 pr-10`;
    } else {
      return `${baseClasses} border-gray-300 focus:border-orange-400`;
    }
  };

  const getValidationIcon = (fieldName) => {
    if (errors[fieldName]) {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    } else if (fieldValidation[fieldName] && formData[fieldName]) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return null;
  };

  return (
    <div className="bg-white max-w-2xl mx-auto px-8 py-6 flex flex-col justify-center rounded-xl shadow-xl overflow-hidden border border-gray-300">
      {/* Header */}
      <div className="mb-4 text-center">
        <h2 className="text-3xl font-bold text-black mb-4">Signup</h2>
        <p className="text-gray-600">Create your account</p>
      </div>

      {/* General Errors */}
      {errors.general && (
        <div className="text-red-500 text-center text-sm mb-4 p-3 bg-red-50 rounded-lg border border-red-200 flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-black text-sm font-medium">
            Full Name *
          </label>
          <div className="relative">
            <input
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className={getInputClassName("name")}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {getValidationIcon("name")}
            </div>
          </div>
          {errors.name && (
            <p className="text-red-500 mt-1 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-black text-sm font-medium">
            Username *
          </label>
          <div className="relative">
            <input
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              className={getInputClassName("username")}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {getValidationIcon("username")}
            </div>
          </div>
          {errors.username && (
            <p className="text-red-500 mt-1 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.username}
            </p>
          )}
        </div>

        {/* Class Level */}
        <div className="mb-4">
          <label
            htmlFor="classLevel"
            className="block text-black text-sm font-medium"
          >
            Class Level *
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
          <div className="mb-4">
            <label
              htmlFor="group"
              className="block text-black text-sm font-medium"
            >
              Group *
            </label>
            <input
              // type="text"
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
          <div className="mb-4">
            <label
              htmlFor="department"
              className="block text-black text-sm font-medium"
            >
              Department *
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
        <div className="mb-4">
          <label
            htmlFor="mobile"
            className="block text-black text-sm font-medium"
          >
            Mobile Number *
          </label>
          <input
            // type="tel"
            id="mobile"
            name="mobile"
            placeholder="e.g., 01723456789"
            value={formData.mobile}
            onChange={handleChange}
            className={getInputClassName("mobile")}
            // minLength="11"
            maxLength="11"
            required
          />
          {errors.mobile && (
            <p className="text-red-500 mt-1 text-xs">{errors.mobile}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-black text-sm font-medium"
          >
            Email Address *
          </label>
          <input
            // type="email"
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
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-black text-sm font-medium"
          >
            Password *
          </label>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="•••••••••••••"
              value={formData.password}
              onChange={handleChange}
              className={`${getInputClassName("password")} pr-10`}
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
          <p className="text-gray-500 mt-1 text-xs">
            Password must contain at least one uppercase letter, one lowercase
            letter, one number, and one special character.
          </p>
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-black text-sm font-medium"
          >
            Confirm Password *
          </label>
          <div className="relative mt-1">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="•••••••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`${getInputClassName("confirmPassword")} pr-10`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showConfirmPassword ? (
                <EyeOff className="text-gray-600 w-5 h-5" />
              ) : (
                <Eye className="text-gray-600 w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 mt-1 text-xs">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="mb-4">
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
