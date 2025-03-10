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
      className="fixed right-4 top-4 p-3 rounded-full bg-gray-300 dark:bg-gray-700"
    >
      {theme === "dark" ? (
        <SunIcon size={24} className="text-yellow-300" />
      ) : (
        <MoonIcon size={24} className="text-white" />
      )}
    </button>
  );
};

export default ThemeSwitcher;
