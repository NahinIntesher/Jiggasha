"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Gamepad2,
  BookOpen,
  MessageSquare,
  Bot,
  Users,
  Trophy,
  LogOut,
} from "lucide-react";

export default function Sidebar({ user, handleLogout }) {
  const router = useRouter();
  const [activeLink, setActiveLink] = useState("");

  const links = [
    { icon: LayoutDashboard, label: "Dashboard", href: "#" },
    { icon: Gamepad2, label: "Play", href: "/play" },
    { icon: BookOpen, label: "Courses", href: "/courses" },
    { icon: MessageSquare, label: "Blogs", href: "/blogs" },
    { icon: Bot, label: "Srijona AI", href: "/srijona-ai" },
    { icon: Users, label: "Communities", href: "/communities" },
    { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
  ];

  useEffect(() => {
    // Check localStorage for saved active tab
    const savedActiveLink = localStorage.getItem("activeLink");
    if (savedActiveLink) {
      setActiveLink(savedActiveLink);
    } else {
      setActiveLink(router.pathname);
    }
  }, [router.pathname]);

  const handleLinkClick = (href) => {
    setActiveLink(href);
    localStorage.setItem("activeLink", href);
    router.push(href);
  };

  return (
    <div className="flex flex-col justify-between h-screen w-64 bg-white border-r border-gray-300 shadow-md p-4">
      {/* Logo */}
      <div>
        <div className="text-2xl font-extrabold mb-8 text-orange-500">
          Jiggasha
        </div>

        {/* Navigation Links */}
        <div className="space-y-3 ">
          {links.map((link, index) => (
            <button
              key={index}
              className={`flex items-center w-full text-gray-700 px-3 py-2 hover:text-orange-500 transition-all ${
                activeLink === link.href
                  ? "text-orange-600 bg-orange-200 rounded-xl"
                  : ""
              }`}
              onClick={() => handleLinkClick(link.href)}
            >
              <link.icon className="w-5 h-5 mr-3" />
              <span className="truncate text-left">{link.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* User Profile and Logout */}
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-4">
          {user?.user_picture ? (
            <img
              src={user.user_picture}
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-600">
                {user?.full_name?.[0] || "U"}
              </span>
            </div>
          )}
          <div>
            <p className="text-sm font-semibold">{user?.full_name || "User"}</p>
            <p className="text-xs text-gray-500">
              Level {user?.user_rating || 0}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

// Sidebar Link Component
function SidebarLink({ Icon, text, active = false }) {
  return (
    <a
      href=""
      className={`flex items-center gap-2 p-2 rounded-md ${
        active ? "bg-orange-100 text-orange-600" : "hover:bg-purple-100"
      }`}
    >
      <Icon size={20} />
      {text}
    </a>
  );
}
