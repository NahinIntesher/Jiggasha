"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaTrash,
  FaFlag,
  FaMusic,
  FaPlay,
} from "react-icons/fa6";
import dp from "../../../public/images/demo_profile_image.jpg";

export default function PostCard({
  postId,
  posterId,
  posterName,
  posterPicture,
  content,
  postTimeAgo,
  postMediaArray,
  isPostReacted,
  postReactionCount,
  postCommentCount,
  postTime,
  setUpdatePost,
}) {
  const [isReacted, setIsReacted] = useState(isPostReacted);
  const [reactionCount, setReactionCount] = useState(postReactionCount);

  function getPMTime(datetime) {
    let time = new Date(datetime);
    return time.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }

  function getDate(datetime) {
    let time = new Date(datetime);
    return time.toLocaleString("en-US", { dateStyle: "long" });
  }

  function reactPost() {
    fetch("http://localhost:8000/communities/post/react", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: postId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "Success") {
          if (data.message === "Liked") {
            setIsReacted(true);
            setReactionCount((prevCount) => prevCount + 1);
          } else {
            setIsReacted(false);
            setReactionCount((prevCount) => prevCount - 1);
          }
          setUpdatePost((prevData) => prevData + 1);
        } else {
          alert(data.Error);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="postBox bg-white p-4 rounded-lg border border-gray-200 shadow">
      <div className="profile flex items-center mb-4">
        <Link href={"/profile/" + posterId} className="profilePicture">
          <img
            src={posterPicture ? posterPicture : dp}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        </Link>
        <div className="profileDetail ml-3">
          <Link
            href={"/profile/" + posterId}
            className="name font-semibold text-gray-900 hover:text-blue-600"
          >
            {posterName}
          </Link>
          <div className="detail text-sm text-gray-500">{postTimeAgo}</div>
        </div>
      </div>

      <div className="postContentContainer">
        <div className="postContent text-gray-800 mb-4">{content}</div>
        {postMediaArray && postMediaArray.length > 0 && (
          <div className="mediaContainer mb-4">
            {postMediaArray.map(function (postMedia, index) {
              if (postMedia.media_type === "image") {
                return (
                  <img
                    key={index}
                    src={postMedia.media_url}
                    alt="Post media"
                    className="w-full rounded-lg object-cover max-h-96"
                  />
                );
              } else if (postMedia.media_type === "audio") {
                return (
                  <div
                    key={index}
                    className="audioContainer bg-gray-100 p-4 rounded-lg flex flex-col items-center"
                  >
                    <FaMusic className="text-4xl text-gray-600 mb-2" />
                    <audio controls className="w-full">
                      <source src={postMedia.media_url} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                );
              } else if (postMedia.media_type === "video") {
                return (
                  <video
                    controls
                    key={index}
                    className="w-full rounded-lg max-h-96"
                  >
                    <source src={postMedia.media_url} type="video/mp4" />
                    Your browser does not support the video element.
                  </video>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>

      <div className="postDetails flex items-center text-sm text-gray-500 mb-4 space-x-4">
        <div className="detail">{reactionCount} Likes</div>
        <div className="detail">{postCommentCount} Comments</div>
        <div className="detail">{getDate(postTime)}</div>
        <div className="detail">{getPMTime(postTime)}</div>
      </div>

      <div className="postActionBoxContainer flex items-center space-x-4 pt-3 border-t border-gray-200">
        {isReacted ? (
          <button
            className="postActionBox flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            onClick={reactPost}
          >
            <FaHeart className="text-lg" />
            <span className="text">Liked</span>
          </button>
        ) : (
          <button
            className="postActionBox flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={reactPost}
          >
            <FaRegHeart className="text-lg" />
            <span className="text">Like</span>
          </button>
        )}
        <Link
          href={"/communities/post/" + postId}
          className="postActionBox flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <FaComment className="text-lg" />
          <span className="text">Comment</span>
        </Link>
      </div>
    </div>
  );
}
