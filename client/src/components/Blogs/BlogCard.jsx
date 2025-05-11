"use client";
import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { FaEye, FaCaretDown, FaCaretUp, FaComment } from "react-icons/fa6";

const BlogCard = ({
  title,
  content,
  subject,
  classLevel,
  viewCount,
  voteCount,
  createdAt,
  coverImage,
  authorName,
  authorPicture
}) => {
  function classLevelName() {
    if (classLevel == "admission") return "Admission";
    else if (classLevel == "undergraduate") return "Undergraduate";
    else return `Class ${classLevel}`;
  }

  function dateFormat(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="card blogListCard">
      {coverImage ? <img
        className="previewImage"
        src={coverImage}
      /> : <div className="psudoPreviewImage"><FaComment /></div>}
      <div className="details">
        <div className="title">{title}</div>
        <div className="tags">
          <div className="orangeTag">{subject}</div>
          <div className="grayTag">{classLevelName(classLevel)}</div>
        </div>
        <div className="description">
          {content}
        </div>
        <hr />
        <div className="informationContainer">
          <div className="author">
            <div className="profilePicture">
              {authorPicture ? (
                <img
                  src={authorPicture}
                />
              ) : (
                <div className="psudoProfilePicture">
                  {authorName[0]}
                </div>
              )}
            </div>
            <div className="createdBy">Created By</div>
            <div className="name">{authorName}</div>
          </div>
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
      <div className="voting">
        <div className="button">
          <FaCaretUp className="icon" />
        </div>
        <div className="count">
          {voteCount}
        </div>
        <div className="button">
          <FaCaretDown className="icon" />
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
