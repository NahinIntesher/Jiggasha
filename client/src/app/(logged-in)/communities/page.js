"use client";
import OverviewCommunityCard from "@/components/Communities/OverviewCommunityCard";
import Header from "@/components/ui/Header";
import { useState, useEffect } from "react";
import { FaArrowUpWideShort, FaSpinner } from "react-icons/fa6";

export default function Communities() {
  const [activeTab, setActiveTab] = useState("joinedCommunities");
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch communities from backend
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/communities", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add authorization header if needed
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debug log

        // Handle different response formats
        let communitiesArray = [];

        if (Array.isArray(data)) {
          // Direct array response
          communitiesArray = data;
        } else if (data.communities && Array.isArray(data.communities)) {
          // Nested array response: { communities: [...] }
          communitiesArray = data.communities;
        } else if (data.data && Array.isArray(data.data)) {
          // Nested array response: { data: [...] }
          communitiesArray = data.data;
        } else if (data.success && data.data && Array.isArray(data.data)) {
          // Nested success response: { success: true, data: [...] }
          communitiesArray = data.data;
        } else {
          console.error("Unexpected API response format:", data);
          throw new Error("Invalid response format from server");
        }

        // Map the backend data to match your component props
        const mappedCommunities = communitiesArray.map((community) => ({
          id: community.id,
          name: community.name || community.title,
          description: community.description,
          subject: community.subject,
          class_level: community.class_level || community.classLevel,
          rating: community.rating || 0,
          total_members: community.total_members || community.totalMembers || 0,
          creator_name:
            community.creator_name || community.creatorName || "Unknown",
          creator_image:
            community.creator_image || community.creatorImage || null,
          isJoined: community.isJoined || false,
        }));

        setCommunities(mappedCommunities);
        setError(null);
      } catch (error) {
        console.error("Error fetching communities:", error);
        setError("Failed to load communities. Please try again.");
        // Fallback to empty array or show error message
        setCommunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  const handleJoinSuccess = (communityId, newMemberCount) => {
    // Update the local state to reflect the joined status
    setCommunities((prevCommunities) =>
      prevCommunities.map((community) =>
        community.id === communityId
          ? {
              ...community,
              isJoined: true,
              total_members: newMemberCount || community.total_members + 1,
            }
          : community
      )
    );
  };

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
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center gap-3 text-gray-600">
              <FaSpinner className="animate-spin" size={20} />
              <span>Loading communities...</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : communities.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-600">No communities found.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
            {communities.map((community) => (
              <OverviewCommunityCard
                key={community.id}
                community_id={community.id}
                name={community.name}
                description={community.description}
                subject={community.subject}
                class_level={community.class_level}
                rating={community.rating}
                total_members={community.total_members}
                creator_name={community.creator_name}
                creator_image={community.creator_image}
                isJoined={community.isJoined}
                onJoinSuccess={handleJoinSuccess}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
