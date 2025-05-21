"use client";
import React from "react";
import { useState } from "react";
import SearchBoxOn from "./SearchBarOn";
import { FaGear, FaBell, FaAngleDown } from "react-icons/fa6";
import { FaBars, FaSearch } from "react-icons/fa";
import { useLayout } from "../Contexts/LayoutProvider";

export default function Header({ title, subtitle }) {
  const { toggleMenu } = useLayout();

  const [secondaryMenu, setSecondaryMenu] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  function toggleSecondaryMenu() {
    setSecondaryMenu((prev) => !prev);
  }
  return (
    <div className="header">
      {/* Title and Subtitle */}

      <div className="mobileViewContainer">
        <div className="titleButtonContainer">
          <div className="menuButton" onClick={toggleMenu}>
            <FaBars className="icon" />
          </div>
          <div className="titleContainer">
            <h1 className="title">{title}</h1>
            {subtitle && <p className="subTitle">{subtitle}</p>}
          </div>
        </div>
        <div onClick={toggleSecondaryMenu} className={ secondaryMenu ? "secondaryMenuButton rotate" : "secondaryMenuButton" }><FaAngleDown className="icon" /></div>
      </div>


      {/* Search and Icons */}
      <div className={secondaryMenu? "iconContainer active" : "iconContainer"}>
        <div className="searchBox">
          <FaSearch className="icon" />
          <input type="text" placeholder="Search" />
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
