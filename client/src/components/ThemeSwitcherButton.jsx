"use client";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { SunIcon } from "@/components/SunIcon";
import { MoonIcon } from "@/components/MoonIcon";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  const handleThemeChange = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={handleThemeChange}
      className="p-3 rounded-full bg-[#d9d9d9] hover:bg-[#b9b9b9] transition duration-300 ease-in-out"
    >
      {theme === "dark" ? (
        <SunIcon size={24} className="text-black-200" />
      ) : (
        <MoonIcon size={24} className="text-black" />
      )}
    </button>
  );
};

export default ThemeSwitcher;
