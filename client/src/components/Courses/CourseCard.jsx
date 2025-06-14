"use client";
import { subjectName } from "@/utils/Constant";
import { classLevelName, dateFormat, stripHTML } from "@/utils/Functions";
import Link from "next/link";
import React, { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { FaEye, FaCaretDown, FaCaretUp, FaComment, FaBook } from "react-icons/fa6";

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
  view,
}) => {
  const [enrollStatus, setEnrollStatus] = useState(false);


  return (
    <Link href={`/courses/${id}`} className={`card ${view}Box`}>
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
              <FaCalendarAlt className="icon" />
              <div className="text">{dateFormat(createdAt)}</div>
            </div>
            <div className="information">
              <FaEye className="icon" />
              <div className="text">{0}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
