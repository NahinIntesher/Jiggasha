"use client";
import { subjectName } from "@/utils/Constant";
import { classLevelName, dateFormat, stripHTML } from "@/utils/Functions";
import Link from "next/link";
import React, { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import {
  FaEye,
  FaCaretDown,
  FaCaretUp,
  FaComment,
  FaBook,
  FaUser,
  FaChalkboardUser,
} from "react-icons/fa6";

const CourseCard = ({
  id,
  name,
  subject,
  classLevel,
  description,
  createdAt,
  coverImage,
  instructorName,
  instructorPicture,
  totalStudent,
  isJoined,
  view,
}) => {
  const [enrollStatus, setEnrollStatus] = useState(false);

  return (
    <Link href={`/admin/course/${id}`} className={`card ${view}Box`}>
      {coverImage ? (
        <img className="previewImage" src={coverImage} />
      ) : (
        <div className="psudoPreviewImage">
          <FaBook />
        </div>
      )}
      <div className="details">
        <div className="cardContentContainer">
          <div className="titleContainer">
            <div className="title">{name}</div>
            <div className="tags">
              <div className="orangeTag">{subjectName[subject]}</div>
              <div className="grayTag">{classLevelName(classLevel)}</div>
            </div>
            <div className="description">{description}</div>
          </div>
        </div>
        <hr />
        <div className="informationContainer">
          <div className="author">
            <div className="profilePicture">
              {instructorPicture ? (
                <img src={instructorPicture} />
              ) : (
                <div className="psudoProfilePicture">{instructorName[0]}</div>
              )}
            </div>
            <div className="nameContainer">
              <div className="createdBy">Created By</div>
              <div className="name">{instructorName}</div>
            </div>
          </div>

          <hr className="gridOnly" />
          <div className="informations">
            <div className="information">
              <FaUser className="icon" />
              <div className="text">{totalStudent} Students</div>
            </div>
            <div className="information">
              <FaChalkboardUser className="icon" />
              <div className="text">{3} Lectures</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
