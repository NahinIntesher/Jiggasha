"use client";
import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function HeaderAlt({ title, subtitle }) {
  const router = useRouter();

  function handleBackButtonClick() {
    router.back(); // Navigate back to the previous page
  }

  return (
    <div className="headerAlt">
      {/* Title and Subtitle */}
      <div className="backButton onclick" onClick={handleBackButtonClick}>
        <FaArrowLeft className="icon" />
      </div>
      <div className="titleContainer">
        <h1 className="title">{title}</h1>
        {/* {subtitle && <p className="subTitle">{subtitle}</p>} */}
      </div>
    </div>
  );
}
