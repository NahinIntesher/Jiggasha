"use client";
import OverviewCommunityCard from "@/components/Communities/OverviewCommunityCard";
import CommunityCard from "@/components/Communities/OverviewCommunityCard";
import Header from "@/components/ui/Header";
import { use, useState } from "react";
import { FaArrowUpWideShort } from "react-icons/fa6";

export default function Communities() {
  const [activeTab, setActiveTab] = useState("joinedCommunities");
  const communities = [
    {
      name: "Physics Adda",
      description:
        "Welcome to the Physics Adda community! In this community we will be discuss about physics.",
      subject: "Physics",
      class_level: "Class 12",
      rating: 4.5,
      total_members: 1420,
      creator_name: "Nahin Intesher",
      // creator_image: "/path/to/creator-image.jpg",
    },
    {
      name: "Chemistry Lab",
      description:
        "Join our Chemistry Lab community to discuss experiments, formulas and exam preparation.",
      subject: "Chemistry",
      class_level: "Class 11",
      rating: 4.2,
      total_members: 980,
      creator_name: "Samiul Ahmed",
      // creator_image: "",
    },
  ];

  return (
    <div className="">
      <Header title="Communities" />
      <div className="tabs">
        <div
          onClick={() => setActiveTab("joinedCommunities")}
          className={activeTab == "joinedCommunities" ? "tab tabActive" : "tab"}
        >
          Joined Communities
        </div>
        <div
          onClick={() => setActiveTab("browseCommunities")}
          className={activeTab == "browseCommunities" ? "tab tabActive" : "tab"}
        >
          Browse Communities
        </div>
      </div>

      <div className="filterContainer">
        <FaArrowUpWideShort className="filterIcon" />
        <div className="filterTitle">Filter</div>
      </div>

      <div className="communitiesContainer p-5">
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
          {communities.map((community, index) => (
            <OverviewCommunityCard
              key={index}
              name={community.name}
              description={community.description}
              subject={community.subject}
              class_level={community.class_level}
              rating={community.rating}
              total_members={community.total_members}
              creator_name={community.creator_name}
              creator_image={community.creator_image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
