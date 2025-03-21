"use client";
import "../../app/globals.css";
import React, { useState, useRef, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const SearchBox = ({ searchQuery, setSearchQuery, language, setLanguage }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const toggleSearch = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    inputRef.current.focus();
  };

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 300);
    }
  }, [isExpanded]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && searchQuery === "") {
        setIsExpanded(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [searchQuery]);

  const handleBlur = () => {
    setTimeout(() => {
      if (!inputRef.current || !inputRef.current.value) {
        setIsExpanded(false);
      }
    }, 200);
  };

  const handleLanguageToggle = () => {
    setLanguage(language === "en" ? "bn" : "en");
  };

  const placeholderText =
    language === "en" ? "Search something..." : "কিছু খুঁজুন...";
  const clearText = language === "en" ? "Clear" : "পরিষ্কার";

  return (
    <div className="px-2 flex justify-end" ref={containerRef}>
      <div
        className={`relative flex items-center transition-all duration-500 ease-in-out ${
          isExpanded ? "w-full md:w-64" : "w-10"
        }`}
      >
        <div
          className={`search-icon-container absolute left-0 cursor-pointer p-2 rounded-full hover:bg-gray-200 transition-all duration-300 z-10 ${
            isExpanded ? "text-orange-500" : "text-gray-600"
          }`}
          onClick={toggleSearch}
        >
          <FaSearch className="transition-all duration-300 hover:text-orange-500" />
        </div>

        <input
          ref={inputRef}
          type="text"
          placeholder={placeholderText}
          className={`w-full pl-10 pr-10 py-2  text-xs rounded-lg border border-orange-500 bg-white text-gray-700 focus:outline-none focus:border-orange-500 shadow-xs transition-all duration-300 ease-in-out ${
            isExpanded
              ? "opacity-100 scale-100 shadow-xl"
              : "opacity-0 scale-95"
          }`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            pointerEvents: isExpanded ? "auto" : "none",
            transform: isExpanded ? "translateX(0)" : "translateX(20px)",
          }}
          onFocus={() => setIsExpanded(true)}
          onBlur={handleBlur}
        />
      </div>

      {searchQuery && isExpanded && (
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

export default SearchBox;
