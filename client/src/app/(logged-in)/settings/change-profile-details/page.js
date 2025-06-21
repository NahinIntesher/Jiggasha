"use client";

import HeaderAlt from "@/components/ui/HeaderAlt";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { classLevel, group, department } from "@/utils/Constant";
import { FaImages, FaXmark } from "react-icons/fa6";

export default function NewBlog() {
  const router = useRouter();

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    classLevel: "6",
    group: "all",
    mobileNumber: "",
    department: "all",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("classLevel", formData.classLevel);
      formDataToSend.append("group", formData.group);
      formDataToSend.append("mobile", formData.mobileNumber);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("department", formData.department);

      console.log("Form Data to Send:", formDataToSend);
      const response = await fetch(
        "http://localhost:8000/update-profile-details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(Object.fromEntries(formDataToSend)),
        }
      );

      console.log(response);

      const result = await response.json();

      if (result.status === "Success") {
        alert("Profile Successfully Updated!");
        router.back();
      } else {
        console.error("Error updating profile:", result);
      }
    } catch (error) {
      console.error("Error during profile update:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8000/", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const userData = await response.json();
        setFormData({
          ...formData,
          name: userData.full_name || "",
          classLevel: userData.user_class_level || "6",
          group: userData.user_group || "all",
          mobileNumber: userData.mobile_no || "",
          email: userData.email || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <HeaderAlt title="Change Profile Details" />

      <form onSubmit={handleSubmit} className="formBox">
        <div className="title">Update Your Profile Details</div>

        <label>
          <div className="name">Your Name</div>
          <input
            type="text"
            name="name"
            placeholder="Enter Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <div className="multipleLabel">
          <label>
            <div className="name">Class</div>
            <select
              name="classLevel"
              value={formData.classLevel}
              onChange={handleChange}
            >
              {classLevel.map((level) => (
                <option key={level} value={level}>
                  {level == "admission"
                    ? "Admission"
                    : level == "undergraduate"
                    ? "Undergraduate"
                    : `Class ${level}`}
                </option>
              ))}
            </select>
          </label>
          {formData.classLevel == "9-10" ||
          formData.classLevel == "11-12" ||
          formData.classLevel == "admission" ? (
            <label>
              <div className="name">Group</div>
              <select
                name="group"
                value={formData.group}
                onChange={handleChange}
              >
                <option value="all">All Group</option>
                {group.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>
          ) : formData.classLevel == "undergraduate" ? (
            <label>
              <div className="name">Department</div>
              <select
                name="group"
                value={formData.group}
                onChange={handleChange}
              >
                <option value="all">All Department</option>
                {department.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <></>
          )}
        </div>

        <label>
          <div className="name">Your Mobile Number</div>
          <input
            type="text"
            name="mobileNumber"
            placeholder="Enter Your Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          <div className="name">Your Email Address</div>
          <input
            type="text"
            name="email"
            placeholder="Enter Your Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <button className="submit" type="submit">
          Update Your Profile
        </button>
      </form>
    </>
  );
}
