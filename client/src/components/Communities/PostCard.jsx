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
  FaFilePdf,
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
  commentators,
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

  function getTimeAgo(timestamp) {
    const date = new Date(timestamp);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  function getDate(datetime) {
    let time = new Date(datetime);
    return time.toLocaleString("en-US", { dateStyle: "long" });
  }

  

  return (
    <div className="postBox bg-white p-6 rounded-xl border-2 border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
      <div className="profile flex items-center mb-5">
        <Link href={"/profile/" + posterId} className="profilePicture">
          <img
            src={posterPicture == null ? dp : posterPicture}
            className="w-12 h-12 rounded-full object-cover border-3 border-orange-200 hover:border-orange-400 transition-colors"
          />
        </Link>
        <div className="profileDetail ml-4">
          <Link
            href={"/profile/" + posterId}
            className="name font-bold text-gray-800 hover:text-orange-600 transition-colors text-lg"
          >
            {posterName}
          </Link>
          <div className="detail text-sm text-orange-500 font-medium">
            {getPMTime(postTimeAgo)}
          </div>
        </div>
      </div>

      <div className="postContentContainer">
        <div className="postContent text-gray-700 mb-5 text-base leading-relaxed">
          {content}
        </div>
        {postMediaArray && postMediaArray.length > 0 && (
          <div className=" mb-5">
            {postMediaArray?.length > 0 && (
              <div className="">
                {postMediaArray.map((media, index) => {
                  const url = media.media_url;

                  const MediaContainer = ({ children }) => (
                    <div className="media-container my-4 rounded-xl overflow-hidden shadow border-2 border-orange-200 bg-orange-50">
                      {children}
                    </div>
                  );

                  if (!url) return null;

                  switch (media.media_type) {
                    case "image":
                      return (
                        <div key={media.media_id || index}>
                          <MediaContainer>
                            <div className="relative pt-[56.25%]">
                              <img
                                src={url}
                                alt="Post image"
                                className="absolute top-0 left-0 w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/placeholder-image.jpg";
                                }}
                              />
                            </div>
                          </MediaContainer>
                        </div>
                      );

                    case "audio":
                      return (
                        <div key={media.media_id || index}>
                          <MediaContainer>
                            <div className="p-4">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="bg-orange-100 p-2 rounded-full">
                                  <FaMusic className="text-orange-500" />
                                </div>
                                <span className="font-medium truncate text-orange-700">
                                  {media.filename || "Audio File"}
                                </span>
                              </div>
                              <audio controls className="w-full">
                                <source
                                  src={url}
                                  type={`audio/${url.split(".").pop()}`}
                                />
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          </MediaContainer>
                        </div>
                      );

                    case "video":
                      return (
                        <div key={media.media_id || index}>
                          <MediaContainer>
                            <video
                              controls
                              className="w-full max-h-[500px] bg-black"
                              poster={
                                media.thumbnail_url || "/video-thumbnail.jpg"
                              }
                            >
                              <source
                                src={url}
                                type={`video/${url.split(".").pop()}`}
                              />
                              Your browser does not support the video tag.
                            </video>
                          </MediaContainer>
                        </div>
                      );

                    case "document":
                      return (
                        <div key={media.media_id || index}>
                          <MediaContainer>
                            <div className="p-4 flex items-center gap-4">
                              <div className="bg-orange-100 p-3 rounded-lg">
                                <FaFilePdf className="text-red-500 text-2xl" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate text-orange-900">
                                  {media.filename || "Document"}
                                </p>
                                <p className="text-sm text-orange-600">
                                  {media.file_size
                                    ? `${(
                                        media.file_size /
                                        1024 /
                                        1024
                                      ).toFixed(2)} MB`
                                    : "Unknown size"}
                                </p>
                              </div>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-600 hover:underline font-semibold"
                                download
                              >
                                Download
                              </a>
                            </div>
                          </MediaContainer>
                        </div>
                      );

                    default:
                      return (
                        <div key={media.media_id || index}>
                          <MediaContainer>
                            <div className="p-4 text-center text-orange-600 font-medium">
                              Unsupported media type: {media.media_type}
                            </div>
                          </MediaContainer>
                        </div>
                      );
                  }
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="postDetails flex items-center text-sm text-orange-600  space-x-6 font-medium">
        <div className="detail hover:text-orange-800 cursor-pointer transition-colors">
          {reactionCount} Likes
        </div>
        <div className="detail hover:text-orange-800 cursor-pointer transition-colors">
          {postCommentCount} Comments
        </div>
        <div className="detail">{getDate(postTime)}</div>
        <div className="detail">{getPMTime(postTime)}</div>
      </div>

      {/* <div className="postActionBoxContainer flex items-center space-x-3 pt-4 border-t-2 border-orange-100">
        {isReacted ? (
          <button
            className="postActionBox flex items-center space-x-2 px-6 py-3 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all duration-200 font-semibold border-2 border-orange-200 hover:border-orange-300"
            onClick={reactPost}
          >
            <FaHeart className="text-lg" />
            <span className="text">Liked</span>
          </button>
        ) : (
          <button
            className=" flex items-center space-x-2 px-6 py-3 text-gray-600 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all duration-200 font-semibold border-2 border-gray-200 hover:border-orange-200"
            onClick={reactPost}
          >
            <FaRegHeart className="text-lg" />
            <span className="text">Like</span>
          </button>
        )}
        <Link
          href={"/communities/post/" + postId}
          className="postActionBox flex items-center space-x-2 px-6 py-3 text-gray-600 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all duration-200 font-semibold border-2 border-gray-200 hover:border-orange-200"
        >
          <FaComment className="text-lg" />
          <span className="text">Comment</span>
        </Link>
      </div> */}

      {commentators && commentators.length > 0 && (
        <div className="commentsSection mt-4 pt-5 border-t-2 border-orange-100">
          <h4 className="text-base font-bold text-orange-700 mb-4">
            Comments ({commentators.length})
          </h4>
          <div className="space-y-4">
            {commentators.slice(0, 3).map((commentator, index) => (
              <div
                key={index}
                className="commentBox flex items-start space-x-3 hover:bg-orange-25 p-2 rounded-lg transition-colors"
              >
                <Link
                  href={"/profile/" + commentator.commentator_name}
                  className="profilePicture flex-shrink-0"
                >
                  <img
                    src={
                      commentator.user_picture == null
                        ? dp
                        : commentator.user_picture
                    }
                    className="w-9 h-9 rounded-full object-cover border-2 border-orange-200 hover:border-orange-400 transition-colors"
                  />
                </Link>
                <div className="commentContentBox flex-1">
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl px-4 py-3 border border-orange-200">
                    <Link
                      href={"/profile/" + commentator.commentator_name}
                      className="name text-sm font-bold text-orange-800 hover:text-orange-600 transition-colors"
                    >
                      {commentator.full_name}
                    </Link>
                    <div className="text text-sm text-gray-700 mt-1 leading-relaxed">
                      {commentator.comment}
                    </div>
                  </div>
                  <div className="details text-xs text-orange-500 mt-2 ml-2 font-medium">
                    {getTimeAgo(commentator.commented_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
