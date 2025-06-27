"use client";
import React from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import SearchBoxOn from "./SearchBarOn";
import { FaGear, FaBell, FaAngleDown } from "react-icons/fa6";
import { FaBars, FaSearch } from "react-icons/fa";
import { useLayout } from "../Contexts/LayoutProvider";
import Link from "next/link";
const pageMeta = {
  "/dashboard": {
    title: "Dashboard",
  },
  "/blogs": {
    title: "Blogs",
  },
  "/communities": {
    title: "Communities",
  },
  "/courses": {
    title: "Courses",
  },

  "/leaderboard": {
    title: "Leaderboard",
  },
  play: {
    title: "Learn Through Play",
  },
  "/quests": {
    title: "Quests",
  },
  "/profile": {
    title: "Profile",
  },

  "/settings": {
    title: "Settings",
  },
};
export default function Header({ title, subtitle }) {
  const pathname = usePathname();
  const { toggleMenu } = useLayout();

  const [secondaryMenu, setSecondaryMenu] = useState(false);

  const [blogs, setBlogs] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [courses, setCourses] = useState([]);

  const [toggelNotification, setToggleNotification] = useState(false);

  const [searchShow, setSearchShow] = useState(false);

  const meta = pageMeta[pathname] || {
    title: "Page",
  };

  const handleSearch = (e) => {
    const { value } = e.target;

    if (value.length > 0) {
      setSearchShow(true);
    } else {
      setSearchShow(false);
    }

    const fetchData = async () => {
      try {
        const blogResponse = await fetch(
          "http://localhost:8000/blogs/search/" + (value ? value : "_"),
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        const courseResponse = await fetch(
          "http://localhost:8000/courses/search/" + (value ? value : "_"),
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        const communityResponse = await fetch(
          "http://localhost:8000/communities/search/" + (value ? value : "_"),
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!blogResponse.ok || !courseResponse.ok || !communityResponse.ok) {
          throw new Error(
            `HTTP error! Status: ${blogResponse.status}, ${courseResponse.status}, ${communityResponse.status}`
          );
        }

        const blogsData = await blogResponse.json();
        const coursesData = await courseResponse.json();
        const communitiesData = await communityResponse.json();

        setCommunities(communitiesData);
        setCourses(coursesData);
        setBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  };

  function toggleSecondaryMenu() {
    setSecondaryMenu((prev) => !prev);
  }
  return (
    <div className="header">
      {/* Title and Subtitle */}
      <div className="mobileViewContainer">
        <div className="titleButtonContainer">
          <div className="menuButton" onClick={toggleMenu}>
            <FaBars className="icon" />
          </div>
          <div className="titleContainer">
            {title ? (
              <h1 className="title">{title}</h1>
            ) : (
              <h1 className="metaTitle">{meta.title}</h1>
            )}
          </div>
        </div>
        <div
          onClick={toggleSecondaryMenu}
          className={
            secondaryMenu ? "secondaryMenuButton rotate" : "secondaryMenuButton"
          }
        >
          <FaAngleDown className="icon" />
        </div>
      </div>

      {/* Search and Icons */}
      <div className={secondaryMenu ? "iconContainer active" : "iconContainer"}>
        <div className="searchBox">
          <FaSearch className="icon" />
          <input type="text" placeholder="Search" onChange={handleSearch}/>
          <div
            className={`searchResultContainer ${searchShow ? "" : "hidden"
              }`}
          >
            {blogs.length == 0 &&
              communities.length == 0 &&
              courses.length == 0 ? (
              <div className="notFound ">
                <FaSearch className="icon" />
                <div className="text">Nothing Found!</div>
              </div>
            ) : (
              <>
                {blogs.length > 0 && (
                  <>
                    <div className="segmentName">
                      Blogs
                    </div>
                    {blogs.map((blog) => (
                      <SearchResult
                        key={blog.blog_id}
                        name={blog.title}
                        imageUrl={blog.cover_image_url}
                        link={`/blogs/${blog.blog_id}`}
                        description={blog.content}
                      />
                    ))}
                  </>
                )}
                {communities.length > 0 && (
                  <>
                    <div className="segmentName">
                      Communities
                    </div>
                    {communities.map((community) => (
                      <SearchResult
                        key={community.community_id}
                        name={community.name}
                        imageUrl={community.cover_image_url}
                        link={`/communities/${community.community_id}`}
                        description={community.description}
                      />
                    ))}
                  </>
                )}
                {courses.length > 0 && (
                  <>
                    <div className="segmentName">
                      Courses
                    </div>
                    {courses.map((course) => (
                      <SearchResult
                        key={course.course_id}
                        name={course.name}
                        imageUrl={course.cover_image_url}
                        link={`/courses/${course.course_id}`}
                        description={course.description}
                      />
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <div className="iconButton" onClick={() => setToggleNotification(!toggelNotification)}>
          <div className="count">4</div>
          <FaBell className="icon" />
        </div>
        <Link href={"/settings"} className="iconButton">
          <FaGear className="icon" />
        </Link>
      </div>
      <div
        className={`notificationContainer absolute right-4 top-16 w-80 bg-white shadow-lg rounded-md z-30 ${toggelNotification ? "" : "hidden"
          }`}
      >
        <div className="title px-4 py-2 border-b border-b-gray-400 font-semibold text-gray-700">
          Notification
        </div>
        <div className="notificationList max-h-60 overflow-y-auto">
          <div className="notificationItem flex items-start gap-3 px-4 py-3 hover:bg-gray-100">
            <FaBell className="icon text-lg text-orange-500 mt-1" />
            <div className="notificationContent">
              <div className="notificationTitle font-medium text-gray-800">
                Nahin Intesher comment on your post in your community
              </div>
              <div className="notificationTime text-xs text-gray-400">
                1 days ago
              </div>
            </div>
          </div>
          <div className="notificationItem flex items-start gap-3 px-4 py-3 hover:bg-gray-50">
            <FaBell className="icon text-lg text-orange-500 mt-1" />
            <div className="notificationContent">
              <div className="notificationTitle font-medium text-gray-800">
                Mueen Ishraq Ananta upvoted your blogs
              </div>
              <div className="notificationTime text-xs text-gray-400">
                1 days ago
              </div>
            </div>
          </div>
          <div className="notificationItem flex items-start gap-3 px-4 py-3 hover:bg-gray-50">
            <FaBell className="icon text-lg text-orange-500 mt-1" />
            <div className="notificationContent">
              <div className="notificationTitle font-medium text-gray-800">
                Nahin Intesher upvoted your blogs
              </div>
              <div className="notificationTime text-xs text-gray-400">
                23 hours ago
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchResult({ name, imageUrl, link, description }) {
  return (
    <Link href={link} className="searchResult">
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="previewImage" />
      ) : (
        <div className="psudoPreviewImage">
          <FaSearch className="icon" />
        </div>
      )}
      <div className="details">
        <div className="name">{name}</div>
        <div className="description">{description}</div>
      </div>
    </Link>
  );
}
