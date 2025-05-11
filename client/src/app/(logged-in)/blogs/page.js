"use client";

import BlogCard from "@/components/Blogs/BlogCard";
import Header from "@/components/ui/Header";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { FaAngleDown, FaCalendarAlt, FaEye, FaList, FaArrowUpWideShort, FaCaretDown, FaCaretUp, FaGrip, FaPenToSquare } from "react-icons/fa6";

export default function Blogs() {
  const [activeTab, setActiveTab] = useState("browseBlogs");

  const [blogs, setBlogs] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/blogs", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const blogsData = await response.json();
        setBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        {blogs.map((blog) => (
          <BlogCard
            key={blog.blog_id}
            title={blog.title}
            classLevel={blog.class_level}
            subject={blog.subject}
            content={blog.content}
            coverImage={blog.cover_image_url}
            viewCount={blog.view_count}
            voteCount={blog.vote_count}
            createdAt={blog.created_at}
            authorName={blog.author_name}
            authorPicture={blog.author_picture_url}
          />
        ))}
      </div>
    </>
  );
}
