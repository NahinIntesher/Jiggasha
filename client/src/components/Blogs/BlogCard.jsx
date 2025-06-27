"use client";
import { subjectName } from "@/utils/Constant";
import { classLevelName, dateFormat, stripHTML } from "@/utils/Functions";
import Link from "next/link";
import React, { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { FaEye, FaCaretDown, FaCaretUp, FaComment } from "react-icons/fa6";

const BlogCard = ({
  id,
  title,
  content,
  subject,
  classLevel,
  viewCount,
  voteCount,
  createdAt,
  coverImage,
  authorName,
  authorPicture,
  isVoted,
  view,
}) => {
  const [totalVote, setTotalVote] = useState(voteCount);
  const [votingStatus, setVotingStatus] = useState(isVoted);

  const vote = async (e, vote) => {
    try {
      e.stopPropagation();
      e.preventDefault();

      const response = await fetch("https://jiggasha.onrender.com/blogs/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({
          blogId: id,
          vote: vote,
        }),
      });

      const result = await response.json();

      if (result.status === "Success") {
        setTotalVote(
          (prev) => parseInt(prev) + parseInt(vote) - parseInt(votingStatus)
        );
        setVotingStatus(vote);
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const unvote = async (e) => {
    try {
      e.stopPropagation();
      e.preventDefault();

      const response = await fetch("https://jiggasha.onrender.com/blogs/unvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({
          blogId: id,
        }),
      });

      const result = await response.json();

      if (result.status === "Success") {
        setTotalVote((prev) => parseInt(prev) - parseInt(votingStatus));
        setVotingStatus(0);
      } else {
        console.error("Error:", result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Link href={`/blogs/${id}`} className={`card ${view}Box`}>
      {coverImage ? (
        <img className="previewImage" src={coverImage} />
      ) : (
        <div className="psudoPreviewImage">
          <FaComment />
        </div>
      )}
      <div className="details">
        <div className="cardContentContainer">
          <div className="titleContainer">
            <div className="title">{title}</div>
            <div className="tags">
              <div className="orangeTag">{subjectName[subject]}</div>
              <div className="grayTag">{classLevelName(classLevel)}</div>
            </div>
            <div className="description">{stripHTML(content)}</div>
          </div>
          <div className="voting">
            {votingStatus == 1 ? (
              <div
                onClick={(e) => {
                  unvote(e);
                }}
                className="button active"
              >
                <FaCaretUp className="icon" />
              </div>
            ) : (
              <div
                onClick={(e) => {
                  vote(e, 1);
                }}
                className="button"
              >
                <FaCaretUp className="icon" />
              </div>
            )}
            <div className="count">{totalVote}</div>
            {votingStatus == -1 ? (
              <div
                onClick={(e) => {
                  unvote(e);
                }}
                className="button active"
              >
                <FaCaretDown className="icon" />
              </div>
            ) : (
              <div
                onClick={(e) => {
                  vote(e, -1);
                }}
                className="button"
              >
                <FaCaretDown className="icon" />
              </div>
            )}
          </div>
        </div>
        <hr />
        <div className="informationContainer">
          <div className="author">
            <div className="profilePicture">
              {authorPicture ? (
                <img src={authorPicture} />
              ) : (
                <div className="psudoProfilePicture">{authorName[0]}</div>
              )}
            </div>
            <div className="nameContainer">
              <div className="createdBy">Created By</div>
              <div className="name">{authorName}</div>
            </div>
          </div>

          <hr className="gridOnly" />
          <div className="informations">
            <div className="information">
              <FaCalendarAlt className="icon" />
              <div className="text">{dateFormat(createdAt)}</div>
            </div>
            <div className="information">
              <FaEye className="icon" />
              <div className="text">{viewCount}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
