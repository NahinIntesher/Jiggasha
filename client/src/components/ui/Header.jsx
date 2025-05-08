"use client";
import React from "react";
import { useState } from "react";
import SearchBoxOn from "./SearchBarOn";
import { FaGear, FaBell } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

export default function Header({ title, subtitle }) {
  const [language, setLanguage] = useState("en");
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="header">
      {/* Title and Subtitle */}
      <div className="titleContainer">
        <h1 className="title">{title}</h1>
        {subtitle && <p className="subTitle">{subtitle}</p>}
      </div>

      {/* Search and Icons */}
      <div className="iconContainer">
        <div className="searchBox">
          <FaSearch className="icon" />
          <input type="text"placeholder="Search"/>
        </div> 
        <div className="iconButton">
          <div className="count">4</div>
          <FaBell className="icon" />
        </div>
        <div className="iconButton">
          <FaGear className="icon" />
        </div>
      </div>
    </div>
  );
}
