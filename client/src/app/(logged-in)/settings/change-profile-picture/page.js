"use client";

import HeaderAlt from "@/components/ui/HeaderAlt";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

import { FaImages } from "react-icons/fa6";

export default function NewBlog() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    profileImage: null,
    profileImageUrl: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      coverImage: files[0],
      coverImageUrl: URL.createObjectURL(files[0]),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("profilePicture", formData.coverImage);

      const response = await fetch(
        "https://jiggasha.onrender.com/profile/update/picture",
        {
          method: "POST",
          body: formDataToSend,
          mode: "cors",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (result.status === "Success") {
        alert("Profile Picture Succesfully Updated!");
        router.back();
      } else {
        console.error("Error updating profile picture:", result);
      }
    } catch (error) {
      console.error("Error during blog creation:", error);
    }
  };

  return (
    <>
      <HeaderAlt title="Change Profile Picture" />

      <form onSubmit={handleSubmit} className="formBox">
        <div className="title">Update Your Profile Picture</div>
        <label>
          <div className="profilePictureContainer">
            {formData.coverImageUrl ? (
              <img className="previewImage" src={formData.coverImageUrl} />
            ) : (
              <div className="psudoPreviewImage">N</div>
            )}

            <div className="uploadImage">
              <FaImages className="icon" />
              <div className="name">Upload Image</div>
              <input
                type="file"
                name="coverImage"
                onChange={handleChange}
                accept="image/*"
              />
            </div>
          </div>
        </label>
        <button className="submit" type="submit">
          Update Profile Picture
        </button>
      </form>
    </>
  );
}
