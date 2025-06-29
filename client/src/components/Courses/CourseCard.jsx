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
  totalMaterial,
  coverImage,
  instructorName,
  instructorPicture,
  totalStudent,
  completed,
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
              <FaUser className="icon" />
              <div className="text">{totalStudent} Students</div>
            </div>
            <div className="information">
              <FaChalkboardUser className="icon" />
              <div className="text">{totalMaterial} Lectures</div>
            </div>
          </div>
        </div>
        {completed &&
          <>
            <hr />
            <div className="w-full p-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-400">Progress</span>
                <span className="text-xs font-semibold text-green-700">{completed}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${completed}%` }}
                ></div>
              </div>
            </div>
          </>
        }
      </div>
    </Link>
  );
};

export default CourseCard;
