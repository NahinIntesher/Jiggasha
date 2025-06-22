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
        const blogResponse = await fetch("http://localhost:8000/blogs/search/" + (value ? value : "_"), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const courseResponse = await fetch("http://localhost:8000/courses/search/" + (value ? value : "_"), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const communityResponse = await fetch("http://localhost:8000/communities/search/" + (value ? value : "_"), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!blogResponse.ok || !courseResponse.ok || !communityResponse.ok) {
          throw new Error(`HTTP error! Status: ${blogResponse.status}, ${courseResponse.status}, ${communityResponse.status}`);
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
    <div className="header bg-white shadow-md px-4 py-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between relative">
      {/* Title and Subtitle */}
      <div className="mobileViewContainer flex items-center justify-between md:justify-start w-full md:w-auto">
        <div className="titleButtonContainer flex items-center gap-2">
          <div
            className="menuButton p-2 rounded-md hover:bg-gray-100 cursor-pointer md:hidden"
            onClick={toggleMenu}
          >
            <FaBars className="icon text-xl text-gray-700" />
          </div>
          <div className="titleContainer">
            {title ? (
              <h1 className="title text-lg font-bold text-gray-800">{title}</h1>
            ) : (
              <h1 className="metaTitle text-lg font-bold text-gray-800">{meta.title}</h1>
            )}
          </div>
        </div>
        <div
          onClick={toggleSecondaryMenu}
          className={`secondaryMenuButton ml-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-transform duration-200 ${
            secondaryMenu ? "rotate-180" : ""
          } md:hidden`}
        >
          <FaAngleDown className="icon text-lg text-gray-700" />
        </div>
      </div>

      {/* Search and Icons */}
      <div
        className={`iconContainer flex items-center gap-3 transition-all duration-200 ${
          secondaryMenu ? "block" : "hidden"
        } md:flex`}
      >
        <div className="searchBox relative flex items-center bg-gray-100 rounded-md px-2 py-1 w-48 md:w-64">
          <FaSearch className="icon text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search"
            onChange={handleSearch}
            className="bg-transparent outline-none w-full text-sm"
          />
          <div
            className={`searchResultContainer absolute left-0 top-10 w-full bg-white shadow-lg rounded-md z-20 ${
              searchShow ? "" : "hidden"
            }`}
          >
            {blogs.length == 0 && communities.length == 0 && courses.length == 0 ? (
              <div className="notFound flex flex-col items-center py-6 text-gray-400">
                <FaSearch className="icon text-2xl mb-2" />
                <div className="text">Nothing Found!</div>
              </div>
            ) : (
              <>
                {blogs.length > 0 && (
                  <>
                    <div className="segmentName px-4 py-1 text-xs font-semibold text-gray-500">Blogs</div>
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
                    <div className="segmentName px-4 py-1 text-xs font-semibold text-gray-500">Communities</div>
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
                    <div className="segmentName px-4 py-1 text-xs font-semibold text-gray-500">Courses</div>
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
        <div
          className="iconButton relative p-2 rounded-md hover:bg-gray-100 cursor-pointer"
          onClick={() => setToggleNotification(!toggelNotification)}
        >
          <div className="count absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">0</div>
          <FaBell className="icon" />
        </div>
        <Link
          href={"/settings"}
          className="iconButton p-2 rounded-md hover:bg-gray-100 cursor-pointer"
        >
          <FaGear className="icon text-xl text-gray-700" />
        </Link>
      </div>
      <div
        className={`notificationContainer absolute right-4 top-16 w-80 bg-white shadow-lg rounded-md z-30 ${
          toggelNotification ? "" : "hidden"
        }`}
      >
        <div className="title px-4 py-2 border-b border-b-gray-400 font-semibold text-gray-700">Notification</div>
        <div className="notificationList max-h-60 overflow-y-auto">
          <div className="notificationItem flex items-start gap-3 px-4 py-3 hover:bg-gray-100">
            <FaBell className="icon text-lg text-orange-500 mt-1" />
            <div className="notificationContent">
              <div className="notificationTitle font-medium text-gray-800">Nahin Intesher comment on your post in your community</div>
              <div className="notificationTime text-xs text-gray-400">1 days ago</div>
            </div>
          </div>
          <div className="notificationItem flex items-start gap-3 px-4 py-3 hover:bg-gray-50">
            <FaBell className="icon text-lg text-orange-500 mt-1" />
            <div className="notificationContent">
              <div className="notificationTitle font-medium text-gray-800">Mueen Ishraq Ananta upvoted your blogs</div>
              <div className="notificationTime text-xs text-gray-400">1 days ago</div>
            </div>
          </div>
          <div className="notificationItem flex items-start gap-3 px-4 py-3 hover:bg-gray-50">
            <FaBell className="icon text-lg text-orange-500 mt-1" />
            <div className="notificationContent">
              <div className="notificationTitle font-medium text-gray-800">Nahin Intesher upvoted your blogs</div>
              <div className="notificationTime text-xs text-gray-400">23 hours ago</div>
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