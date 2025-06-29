"use client";

import BlogCard from "@/components/Blogs/BlogCard";
import {
  classLevel,
  group,
  department,
  subject,
  subjectName,
} from "@/utils/Constant";
import { useEffect, useState } from "react";
import {
  FaAngleDown,
  FaList,
  FaArrowUpWideShort,
  FaGrip,
} from "react-icons/fa6";
import Loading from "../ui/Loading";

export default function MyBlogs() {
  const [view, setView] = useState("list");

  const [blogs, setBlogs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [sorting, setSorting] = useState({
    classLevel: "",
    group: "",
    subject: "",
    sortBy: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "classLevel") {
      setSorting((prev) => ({
        ...prev,
        classLevel: value,
        group: "",
        subject: "",
      }));
    } else if (name == "group") {
      setSorting((prev) => ({
        ...prev,
        group: value,
        subject: "",
      }));
    } else {
      setSorting((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/blogs/my", {
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

  if (loading) {
    return <Loading />;
  } else {
    return (
      <>
        <div className="filterContainer">
          <div className="filters">
            <FaArrowUpWideShort className="icon" />
            <div className="title">Filter</div>
            <div className="selectContainer">
              <select
                name="classLevel"
                value={sorting.classLevel}
                onChange={handleChange}
              >
                <option value="">All Class</option>
                {classLevel.map((level) => (
                  <option key={level} value={level}>
                    {level == "admission"
                      ? "Admission"
                      : level == "undergraduate"
                      ? "Undergraduate"
                      : `Class ${level}`}
                  </option>
                ))}
              </select>
              <FaAngleDown className="downIcon" />
            </div>
            {sorting.classLevel == "9-10" ||
            sorting.classLevel == "11-12" ||
            sorting.classLevel == "admission" ? (
              <div className="selectContainer">
                <select
                  name="group"
                  value={sorting.group}
                  onChange={handleChange}
                >
                  <option value="">All Group</option>
                  {group.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <FaAngleDown className="downIcon" />
              </div>
            ) : sorting.classLevel == "undergraduate" ? (
              <div className="selectContainer">
                <select
                  name="group"
                  value={sorting.group}
                  onChange={handleChange}
                >
                  <option value="">All Department</option>
                  {department.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <FaAngleDown className="downIcon" />
              </div>
            ) : (
              <></>
            )}
            {sorting.classLevel == "9-10" ||
            sorting.classLevel == "11-12" ||
            sorting.classLevel == "admission" ||
            sorting.classLevel == "undergraduate" ? (
              sorting.group != "" && (
                <div className="selectContainer">
                  <select
                    name="subject"
                    value={sorting.subject}
                    onChange={handleChange}
                  >
                    <option value="">All Subject</option>
                    {subject[sorting.classLevel][sorting.group].map((level) => (
                      <option key={level} value={level}>
                        {subjectName[level]}
                      </option>
                    ))}
                  </select>
                  <FaAngleDown className="downIcon" />
                </div>
              )
            ) : sorting.classLevel != "" ? (
              <div className="selectContainer">
                <select
                  name="subject"
                  value={sorting.subject}
                  onChange={handleChange}
                >
                  <option value="">All Subject</option>
                  {subject[sorting.classLevel].map((level) => (
                    <option key={level} value={level}>
                      {subjectName[level]}
                    </option>
                  ))}
                </select>
                <FaAngleDown className="downIcon" />
              </div>
            ) : (
              <></>
            )}
            <div className="selectContainer">
              <select
                name="sortBy"
                value={sorting.sortBy}
                onChange={handleChange}
              >
                <option value="highestView">Highest View</option>
                <option value="mostLiked">Most Liked</option>
                <option value="newest">Newest</option>
              </select>
              <FaAngleDown className="downIcon" />
            </div>
          </div>
          <div className="views">
            <div
              className={view == "list" ? "viewIcon activeIcon" : "viewIcon"}
              onClick={() => {
                setView("list");
              }}
            >
              <FaList />
            </div>
            <div
              className={view == "grid" ? "viewIcon activeIcon" : "viewIcon"}
              onClick={() => {
                setView("grid");
              }}
            >
              <FaGrip />
            </div>
          </div>
        </div>

        <div className="cardContainer">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.blog_id}
              id={blog.blog_id}
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
              isVoted={blog.is_voted}
              view={view}
            />
          ))}
        </div>
      </>
    );
  }
}
