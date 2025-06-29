"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import logo from "../../../public/images/JiggashaLogo.png";
import SearchBox from "./SearchBar";
import ThemeSwitcher from "../ThemeSwitcherButton";
import { FaBookOpen } from "react-icons/fa6";

const navItems = ["Home", "About Us", "Contact Us", "Our Services"];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const hasLogged = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleItemClick = (item) => {
    setActiveItem(item);
    setIsOpen(false);
  };

  const getLink = (item) => {
    const linkMap = {
      Home: "/",
      "About Us": "/about-us",
      "Contact Us": "/contact-us",
      "Our Services": "/our-services",
    };

    const link = linkMap[item] || "/";
    return link;
  };

  return (
    <nav
      className={`bg-white backdrop-blur-3xl sticky top-0 z-50 w-full border-b border-gray-400 ${
        scrolled ? "shadow-md bg-opacity-25 py-2" : "py-2 bg-opacity-90 "
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="relative group flex flex-1">
          <Link
            href="/"
            className="group flex items-center gap-2 text-sm font-extrabold transition-all duration-300"
          >
            {/* <Image
              src={logo}
              alt="Jiggasha"
              className="h-11 w-11 rounded-full transition-transform duration-300 group-hover:scale-105"
            /> */}
            <FaBookOpen className="text-orange-500 h-7 w-7"/>
            
            <span className="my-3 mx-1 hidden font-extrabold text-xl md:inline-block">
              Jiggasha
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-4 lg:space-x-6 text-gray-700 font-medium mr-4">
          {navItems.map((item) => {
            const link = getLink(item);
            return (
              <li key={item} className="relative group">
                <Link
                  href={link}
                  className={`px-2 lg:px-3 py-2 text-sm transition-all duration-300 hover:text-orange-500 ${
                    activeItem === item ? "text-orange-600" : ""
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  {item}
                  <span
                    className={`absolute left-0 bottom-[-4px] h-0.5 bg-orange-500 w-0 group-hover:w-full transition-all duration-300 ease-in-out ${
                      activeItem === item ? "w-full" : ""
                    }`}
                  ></span>
                </Link>
              </li>
            );
          })}
        </ul>

        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        {/* Right Side Controls */}
        <Link
          href={"/login"}
          className="bg-orange-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-orange-600 transition-all duration-300 transform"
        >
          Get Started
        </Link>
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-orange-500 focus:outline-none transition-all duration-300 hover:text-orange-600 transform hover:scale-110"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden flex flex-col bg-white py-4 px-6 absolute top-full left-0 w-full shadow-md transition-all duration-300 ease-in-out ${
          isOpen
            ? "translate-y-0 opacity-100 visible"
            : "-translate-y-full opacity-0 invisible"
        }`}
      >
        {navItems.map((item) => (
          <Link
            key={item}
            href={getLink(item)}
            className={`text-gray-700 py-2 transition-all duration-300 hover:text-orange-500 hover:pl-2 ${
              activeItem === item ? "text-orange-500 font-medium" : ""
            }`}
            onClick={() => handleItemClick(item)}
          >
            {item}
          </Link>
        ))}

        <button
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all duration-300 mt-3 transform hover:scale-105"
          aria-label="Get Started"
        >
          Get Started"
        </button>
      </div>
    </nav>
  );
}