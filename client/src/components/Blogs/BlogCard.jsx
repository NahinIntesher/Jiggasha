"use client";
import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { FaEye, FaCaretDown, FaCaretUp } from "react-icons/fa6";

const BlogCard = ({
  name,
  description,
  subject,
  class_level,
  rating,
  total_members,
  creator_name,
  creator_image,
}) => {
  return (
    <div className="card blogListCard">
      <img
        className="previewImage"
        src="https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg"
      />
      <div className="details">
        <div className="title">Tips and Tricks for Physics</div>
        <div className="tags">
          <div className="orangeTag">Physics</div>
          <div className="grayTag">Class 12</div>
        </div>
        <div className="description">
          Assalamu Alaikum everyone. I am Nahin Intesher. In this blog post, I am going to explain every type of maths with enough example. I hope it will at least help you a little bit to
          Lorem ispum dolor sit amet consectetur adipisicing elit. Quisquam,
          voluptatibus, cumque, quibusdam. Quisquam voluptatibus cumque quibusdam
        </div>
        <hr />
        <div className="informationContainer">
          <div className="author">
            <img
              className="image"
              src="https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg"
            />
            <div className="createdBy">Created By</div>
            <div className="name">Nahin Intesher</div>
          </div>
          <div className="informations">
            <div className="information">
              <FaCalendarAlt className="icon" />
              <div className="text">4th April 2025</div>
            </div>
            <div className="information">
              <FaEye className="icon" />
              <div className="text">241</div>
            </div>
          </div>
        </div>
      </div>
      <div className="voting">
        <div className="button">
          <FaCaretUp className="icon" />
        </div>
        <div className="count">
          999
        </div>
        <div className="button">
          <FaCaretDown className="icon" />
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
