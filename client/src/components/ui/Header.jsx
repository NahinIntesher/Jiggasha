"use client";
import React from "react";
import { useState } from "react";
import { Bell, Settings } from "lucide-react";
import SearchBoxOn from "./SearchBarOn";

export default function Header({ title, subtitle }) {
  const [language, setLanguage] = useState("en");
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md">
      {/* Title and Subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>

      {/* Search and Icons */}
      <div className="flex items-center gap-4">
        <SearchBoxOn
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          language={language}
          setLanguage={setLanguage}
        />
        <div className="relative">
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full px-1">
            4
          </span>
          <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
        </div>
        <Settings className="w-6 h-6 text-gray-600 cursor-pointer" />
      </div>
    </div>
  );
}
