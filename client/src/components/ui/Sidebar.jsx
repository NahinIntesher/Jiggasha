"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  FaBookOpen,
  FaWandMagicSparkles,
  FaUserGroup,
  FaListOl,
  FaComment,
  FaPlay,
  FaSquare,
  FaBook,
  FaRightFromBracket,
  FaClipboardQuestion,
} from "react-icons/fa6";
import SidebarOption from "./SidebarOption";
import { FaAngleDown, FaStar, FaUser } from "react-icons/fa";
import Link from "next/link";
import { useLayout } from "../Contexts/LayoutProvider";
import { useUser } from "../Contexts/UserProvider";

export default function Sidebar() {
  const { user, loading, logout } = useUser();
  const { menu, toggleMenu } = useLayout();
  const router = useRouter();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      router.push("/login");
    } else {
      alert("Logout failed. Please try again.");
    }
  };

  // Define links conditionally based on user_role
  const links = React.useMemo(() => {
    if (!user) return [];

    return user.user_role === "admin"
      ? [
          { icon: FaSquare, label: "Dashboard", href: "/admin/dashboard" },
          { icon: FaBook, label: "Course", href: "/admin/course" },
          { icon: FaListOl, label: "Reports", href: "/admin/reports" },
          { icon: FaUserGroup, label: "Users", href: "/admin/user-management" },
        ]
      : [
          { icon: FaSquare, label: "Dashboard", href: "/dashboard" },
          { icon: FaPlay, label: "Play", href: "/play" },
          { icon: FaBook, label: "Courses", href: "/courses" },
          { icon: FaComment, label: "Blogs", href: "/blogs" },
          {
            icon: FaWandMagicSparkles,
            label: "Jiggasha AI",
            href: "/srijona-ai",
          },
          { icon: FaUserGroup, label: "Communities", href: "/communities" },
          { icon: FaListOl, label: "Leaderboard", href: "/leaderboard" },
          { icon: FaClipboardQuestion, label: "Quests", href: "/quests" },
        ];
  }, [user]);

  if (loading) {
    return (
      <div className={menu ? "sidebar activeSidebar" : "sidebar"}>
        <div className="sidebarContent">
          <div className="logo">
            <div className="icon">
              <FaBookOpen />
            </div>
            <div className="text">Jiggasha</div>
          </div>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {menu && <div className="sidebarBackground" onClick={toggleMenu}></div>}
      <div className={menu ? "sidebar activeSidebar" : "sidebar"}>
        <div className="sidebarContent">
          <div className="logo">
            <div className="icon">
              <FaBookOpen />
            </div>
            <div className="text">Jiggasha</div>
          </div>

          <div className="menuOptions">
            {links.map((link, index) => (
              <SidebarOption
                key={index}
                label={link.label}
                href={link.href}
                Icon={link.icon}
              />
            ))}
          </div>
          <div className="copyright">© 2025 Jiggasha</div>
        </div>

        {user && (
          <div className="profile">
            <div className="profilePicture">
              {user.user_picture_url ? (
                <img src={user.user_picture_url} alt="User" className="" />
              ) : (
                <div className="psudoProfilePicture">
                  <span>{user.full_name?.[0] || "U"}</span>
                </div>
              )}
            </div>
            <div className="profileDetails">
              <p className="name">{user.full_name || "User"}</p>
              <div className="level">
                <div className="icon">
                  <FaStar />
                </div>
                <div>Level {user.level || 0}</div>
              </div>
            </div>
            <div className="moreOptions">
              <div className="moreOptionsButton">
                <div className="icon">
                  <FaAngleDown />
                </div>
              </div>
              <div className="moreOptionsContent">
                <Link
                  href={
                    user.user_role === "admin" ? "/admin/profile" : "/profile"
                  }
                  className="option"
                >
                  <div className="icon">
                    <FaUser />
                  </div>
                  <div className="text">Profile</div>
                </Link>
                <div className="option" onClick={handleLogout}>
                  <div className="icon">
                    <FaRightFromBracket />
                  </div>
                  <div className="text">Logout</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
