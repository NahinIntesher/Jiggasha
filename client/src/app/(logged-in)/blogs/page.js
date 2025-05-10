"use client";

import BlogCard from "@/components/Blogs/BlogCard";
import Header from "@/components/ui/Header";
import Link from "next/link";
import { use, useState } from "react";
import { FaAngleDown, FaCalendarAlt, FaEye, FaList, FaArrowUpWideShort, FaCaretDown, FaCaretUp, FaGrip, FaPenToSquare } from "react-icons/fa6";

export default function Blogs() {
  const [activeTab, setActiveTab] = useState("browseBlogs");

  return (
    <>
      <Header title="Blogs" />
      <div className="tabs">
        <div
          onClick={() => setActiveTab("myBlogs")}
          className={activeTab == "myBlogs" ? "tab tabActive" : "tab"}
        >
          My Blogs
        </div>
        <div
          onClick={() => setActiveTab("browseBlogs")}
          className={activeTab == "browseBlogs" ? "tab tabActive" : "tab"}
        >
          Browse Blogs
        </div>
      </div>

      <div className="filterContainer">
        <div className="filters">
          <FaArrowUpWideShort className="icon" />
          <div className="title">Filter</div>
          <div className="selectContainer">
            <select>
              <option value="6">Class 6</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </select>
            <FaAngleDown className="downIcon" />
          </div>
          <div className="selectContainer">
            <select>
              <option value="all">Highest Student</option>
              <option value="myBlogs">Lowest Price</option>
            </select>
            <FaAngleDown className="downIcon" />
          </div>
        </div>
        <div className="views">
          <div className="viewIcon activeIcon"><FaList /></div>
          <div className="viewIcon"><FaGrip /></div>
          <Link href="/blogs/new-blog" className="button">
            <FaPenToSquare className="icon" />
            <div className="text">Write New Blog</div>
          </Link>
        </div>
      </div>

      <div className="cardContainer">
        <BlogCard />
        <BlogCard />
        <BlogCard />
        <BlogCard />
      </div>
    </>
  );
}
