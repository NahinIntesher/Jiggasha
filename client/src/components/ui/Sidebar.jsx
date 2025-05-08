"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { FaBookOpen, FaWandMagicSparkles, FaUserGroup, FaListOl, FaComment, FaPlay, FaSquare, FaBook, FaRightFromBracket } from "react-icons/fa6";
import Link from "next/link";
import SidebarOption from "./SidebarOption";
import { FaAngleDown, FaStar, FaUser } from "react-icons/fa";

export default function Sidebar({ user, handleLogout }) {
  const router = useRouter();

  //  const isActive = exact ? router.pathname === href : router.pathname.startsWith(href);


  const links = [
    { icon: FaSquare, label: "Dashboard", href: "/dashboard" },
    { icon: FaPlay, label: "Play", href: "/play" },
    { icon: FaBook, label: "Courses", href: "/courses" },
    { icon: FaComment, label: "Blogs", href: "/blogs" },
    { icon: FaWandMagicSparkles, label: "Srijona AI", href: "/srijona-ai" },
    { icon: FaUserGroup, label: "Communities", href: "/communities" },
    { icon: FaListOl, label: "Leaderboard", href: "/leaderboard" },
  ];

  const handleLinkClick = (href) => {
    setActiveLink(href);
    localStorage.setItem("activeLink", href);
    router.push(href);
  };

  return (
    <div className="sidebar">
      {/* Logo */}

      <div className="logo">
        <div className="icon"><FaBookOpen /></div>
        <div className="text">Jiggasha</div>
      </div>

      {/* Navigation Links */}
      <div className="menuOptions">
        {links.map((link, index) => (
          <SidebarOption
            key={index}
            label={link.label}
            href={link.href}
            Icon={link.icon}
          />

        ))}
      </div>

      {/* User Profile and Logout */}
      <div className="profile">
        <div className="profilePicture">
          {user?.user_picture ? (
            <img
              src={user.user_picture}
              alt="User"
              className=""
            />
          ) : (
            <div className="psudoProfilePicture">
              <span className="">
                {user?.full_name?.[0] || "U"}
              </span>
            </div>
          )}
        </div>
        <div className="profileDetails">
          <p className="name">{user?.full_name || "User"}</p>
          <div className="level">
            <div className="icon"><FaStar /></div>
            <div>Level {user?.user_rating || 0}</div>
          </div>
        </div>
        <div className="moreOptions">
          <div className="moreOptionsButton">
            <div className="icon"><FaAngleDown /></div>
          </div>
          <div className="moreOptionsContent">
            <Link href="/profile" className="option">
              <div className="icon"><FaUser /></div>
              <div className="text">Profile</div>
            </Link>
            <div className="option" onClick={handleLogout}>
              <div className="icon"><FaRightFromBracket /></div>
              <div className="text">Logout</div>
            </div>
          </div>
        </div>

        {/* <button
          onClick={handleLogout}
          className=""
        >
          Logout
        </button> */}
      </div>
    </div>
  );
}
