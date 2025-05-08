"use client";
import Header from "@/components/ui/Header";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";

// Custom FilterDropdown Component to replace the one from lucide-react
export const FilterDropdown = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md border border-gray-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value}</span>
        <FaChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          {options.map((option) => (
            <div
              key={option}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
