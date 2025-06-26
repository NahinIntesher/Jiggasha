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
    currentPassword: "",
    newPassword: "",
    repeatNewPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("newPassword", formData.newPassword);

      const response = await fetch(
        "https://jiggasha.onrender.com/update-profile-details",
        {
          method: "POST",
          mode: "cors",
          body: formDataToSend,
          credentials: "include",
        }
      );

      console.log(response);

      const result = await response.json();

      if (result.status === "Success") {
        alert("Your Password Successfully Updated!");
        router.back();
      } else {
        console.error("Error adding blog:", result);
      }
    } catch (error) {
      console.error("Error during blog creation:", error);
      setErrors("An error occurred, please try again later.");
    }
  };

  return (
    <>
      <HeaderAlt title="Change Your Password" />

      <form onSubmit={handleSubmit} className="formBox">
        <div className="title">Update Your Password</div>

        <label>
          <div className="name">Current Password</div>
          <input
            type="password"
            name="currentPassword"
            placeholder="Enter Your Current Password"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          <div className="name">New Password</div>
          <input
            type="password"
            name="newPassword"
            placeholder="Enter Your New Password"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          <div className="name">Repeat New Password</div>
          <input
            type="password"
            name="repeatNewPassword"
            placeholder="Repeat Your New Password"
            value={formData.repeatNewPassword}
            onChange={handleChange}
            required
          />
        </label>

        <button className="submit" type="submit">
          Update Your Password
        </button>
      </form>
    </>
  );
}
