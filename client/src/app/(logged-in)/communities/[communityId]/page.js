"use client";
import HeaderAlt from "@/components/ui/HeaderAlt";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaCalendarAlt } from "react-icons/fa";
import { subjectName } from "@/utils/Constant";
import { classLevelName, dateFormat } from "@/utils/Functions";

export default function SingleCommunity() {
  const { communityId } = useParams();

  const [community, setCommunity] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/communities/single/" + communityId,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCommunity(data);
      } catch (error) {
        console.error("Error fetching community:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, []);

  if (loading) return <>Loading...</>;

  return (
    <>
      <HeaderAlt title={community.name} />

      <div className="blogBox">
        {community.cover_image_url ? (
          <img className="previewImage" src={community.cover_image_url} />
        ) : (
          <div className="psudoPreviewImage">No Image</div>
        )}

        <div className="details">
          <div className="titleContainer">
            <div className="title">{community.name}</div>
            <div className="tags">
              {community.subject && (
                <div className="orangeTag">
                  {subjectName[community.subject]}
                </div>
              )}
              <div className="grayTag">
                {classLevelName(community.class_level)}
              </div>
            </div>
          </div>
        </div>

        <hr />

        <div className="informationContainer">
          <div className="author">
            <div className="profilePicture">
              {community.admin_picture ? (
                <img src={community.admin_picture} />
              ) : (
                <div className="psudoProfilePicture">
                  {community.admin_name?.[0]}
                </div>
              )}
            </div>
            <div className="nameContainer">
              <div className="createdBy">Created By</div>
              <div className="name">{community.admin_name}</div>
            </div>
          </div>
          <div className="informations">
            <div className="information">
              <FaCalendarAlt className="icon" />
              <div className="text">{dateFormat(community.created_at)}</div>
            </div>
            <div className="information">
              <span className="icon">👥</span>
              <div className="text">{community.total_members ?? 0} members</div>
            </div>
          </div>
        </div>

        <hr />

        <div className="content">
          <p>{community.description || "No description provided."}</p>
        </div>
      </div>
    </>
  );
}