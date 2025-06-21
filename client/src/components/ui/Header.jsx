"use client";
import React from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import SearchBoxOn from "./SearchBarOn";
import { FaGear, FaBell, FaAngleDown } from "react-icons/fa6";
import { FaBars, FaSearch } from "react-icons/fa";
import { useLayout } from "../Contexts/LayoutProvider";
import Link from "next/link";
const pageMeta = {
  "/dashboard": {
    title: "Dashboard",
  },
  "/blogs": {
    title: "Blogs",
  },
  "/communities": {
    title: "Communities",
  },
  "/courses": {
    title: "Courses",
  },

  "/leaderboard": {
    title: "Leaderboard",
  },
  play: {
    title: "Learn Through Play",
  },
  "/quests": {
    title: "Quests",
  },
  "/profile": {
    title: "Profile",
  },

  "/settings": {
    title: "Settings",
  },
};
export default function Header({ title, subtitle }) {
  const pathname = usePathname();
  const { toggleMenu } = useLayout();

  const [secondaryMenu, setSecondaryMenu] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const meta = pageMeta[pathname] || {
    title: "Page",
  };

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
            {title ? (
              <h1 className="title">{title}</h1>
            ) : (
              <h1 className="metaTitle">{meta.title}</h1>
            )}
          </div>
        </div>
        <div
          onClick={toggleSecondaryMenu}
          className={
            secondaryMenu ? "secondaryMenuButton rotate" : "secondaryMenuButton"
          }
        >
          <FaAngleDown className="icon" />
        </div>
      </div>

      {/* Search and Icons */}
      <div className={secondaryMenu ? "iconContainer active" : "iconContainer"}>
        <div className="searchBox">
          <FaSearch className="icon" />
          <input type="text" placeholder="Search" />
        </div>
        <div className="iconButton">
          <div className="count">4</div>
          <FaBell className="icon" />
        </div>
        <Link href={"/settings"} className="iconButton">
          <FaGear className="icon" />
        </Link>
      </div>
    </div>
  );
}
