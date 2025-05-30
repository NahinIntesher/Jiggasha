"use client";

import CommunityCard from "@/components/Communities/CommunityCard";
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

export default function MyCommunities() {
  const [view, setView] = useState("list");

  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortMenu, setSortMenu] = useState(false);

  const [sorting, setSorting] = useState({
    classLevel: "",
    group: "",
    subject: "",
    sortBy: "mostMembers",
  });

  function toggleSortMenu() {
    setSortMenu((prev) => !prev);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "classLevel") {
      setSorting((prev) => ({
        ...prev,
        classLevel: value,
        group: "",
        subject: "",
      }));
    } else if (name === "group") {
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
    const fetchMyCommunities = async () => {
      try {
        const response = await fetch("http://localhost:8000/communities/my", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCommunities(data);
      } catch (error) {
        console.error("Error fetching my communities:", error);
        setCommunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCommunities();
  }, []);

  // Filter & sort logic similar to BrowseCommunities
  const filteredCommunities = communities
    .filter((c) => {
      if (sorting.classLevel && c.class_level !== sorting.classLevel)
        return false;

      if (sorting.group) {
        // Adjust filtering if community data has a group/department field
        // Example: if (c.group !== sorting.group) return false;
        // If not available, skip or modify accordingly
      }

      if (sorting.subject && c.subject !== sorting.subject) return false;
      return true;
    })
    .sort((a, b) => {
      if (sorting.sortBy === "mostMembers") {
        return parseInt(b.total_members || 0) - parseInt(a.total_members || 0);
      } else if (sorting.sortBy === "newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return 0;
    });

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="filterContainer">
        <div className="filters">
          <div className="filterButton" onClick={toggleSortMenu}>
            <FaArrowUpWideShort className="icon" />
            <div className="title">Filter</div>
          </div>
          <div
            className={
              sortMenu
                ? "selectMainContainer activeSelectMainContainer"
                : "selectMainContainer"
            }
          >
            <div className="selectContainer">
              <select
                name="classLevel"
                value={sorting.classLevel}
                onChange={handleChange}
              >
                <option value="">All Class</option>
                {classLevel.map((level) => (
                  <option key={level} value={level}>
                    {level === "admission"
                      ? "Admission"
                      : level === "undergraduate"
                      ? "Undergraduate"
                      : `Class ${level}`}
                  </option>
                ))}
              </select>
              <FaAngleDown className="downIcon" />
            </div>

            {(sorting.classLevel === "9-10" ||
              sorting.classLevel === "11-12" ||
              sorting.classLevel === "admission") && (
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
            )}

            {sorting.classLevel === "undergraduate" && (
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
            )}

            {(sorting.classLevel === "9-10" ||
              sorting.classLevel === "11-12" ||
              sorting.classLevel === "admission" ||
              sorting.classLevel === "undergraduate") &&
              sorting.group !== "" && (
                <div className="selectContainer">
                  <select
                    name="subject"
                    value={sorting.subject}
                    onChange={handleChange}
                  >
                    <option value="">All Subject</option>
                    {subject[sorting.classLevel]?.[sorting.group]?.map(
                      (level) => (
                        <option key={level} value={level}>
                          {subjectName[level]}
                        </option>
                      )
                    )}
                  </select>
                  <FaAngleDown className="downIcon" />
                </div>
              )}

            {sorting.classLevel !== "" &&
              !["9-10", "11-12", "admission", "undergraduate"].includes(
                sorting.classLevel
              ) && (
                <div className="selectContainer">
                  <select
                    name="subject"
                    value={sorting.subject}
                    onChange={handleChange}
                  >
                    <option value="">All Subject</option>
                    {subject[sorting.classLevel]?.map((level) => (
                      <option key={level} value={level}>
                        {subjectName[level]}
                      </option>
                    ))}
                  </select>
                  <FaAngleDown className="downIcon" />
                </div>
              )}

            <div className="selectContainer">
              <select
                name="sortBy"
                value={sorting.sortBy}
                onChange={handleChange}
              >
                <option value="mostMembers">Most Members</option>
                <option value="newest">Newest</option>
              </select>
              <FaAngleDown className="downIcon" />
            </div>
          </div>
        </div>
        <div className="views">
          <div
            className={view === "list" ? "viewIcon activeIcon" : "viewIcon"}
            onClick={() => setView("list")}
          >
            <FaList />
          </div>
          <div
            className={view === "grid" ? "viewIcon activeIcon" : "viewIcon"}
            onClick={() => setView("grid")}
          >
            <FaGrip />
          </div>
        </div>
      </div>

      <div className="cardContainer">
        {filteredCommunities.length === 0 && (
          <p className="noResults">No communities found.</p>
        )}
        {filteredCommunities.map((community) => (
          <CommunityCard
            key={community.community_id}
            id={community.community_id}
            name={community.name}
            description={community.description}
            subject={community.subject}
            classLevel={community.class_level}
            totalMembers={parseInt(community.total_members)}
            isJoined={community.is_member === 1}
            coverImage={community.cover_image_url}
            view={view}
          />
        ))}
      </div>
    </>
  );
}
