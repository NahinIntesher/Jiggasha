import "../../app/globals.css";
import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchBox = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="p-4">
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search chats..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-button-hover-light"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBox;
