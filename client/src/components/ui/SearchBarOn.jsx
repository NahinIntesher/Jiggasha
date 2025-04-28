"use client";
import "../../app/globals.css";
import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const SearchBoxOn = ({
  searchQuery,
  setSearchQuery,
  language,
  setLanguage,
}) => {
  const inputRef = useRef(null);

  const clearSearch = () => {
    setSearchQuery("");
    inputRef.current.focus();
  };

  const handleLanguageToggle = () => {
    setLanguage(language === "en" ? "bn" : "en");
  };

  const placeholderText =
    language === "en" ? "Search something..." : "কিছু খুঁজুন...";
  const clearText = language === "en" ? "Clear" : "পরিষ্কার";

  return (
    <div className="px-2 flex justify-end">
      <div className="relative flex items-center w-full md:w-64">
        <div className="search-icon-container absolute left-0 cursor-pointer p-4 rounded-full hover:bg-gray-200 transition-all duration-300 z-10">
          <FaSearch className="transition-all duration-300 hover:text-orange-500" />
        </div>

        <input
          ref={inputRef}
          type="text"
          placeholder={placeholderText}
          className="w-full pl-10 pr-10 py-3 text-xs rounded-xl border border-orange-500 bg-white text-gray-700 focus:outline-none focus:border-orange-500 shadow-xs transition-all duration-300 ease-in-out"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {searchQuery && (
        <button
          onClick={clearSearch}
          className="ml-2 text-gray-50 hover:text-orange-500 transition-colors duration-300 p-2 rounded-full"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export default SearchBoxOn;
