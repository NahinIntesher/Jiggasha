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
    <div className="postBox bg-white p-6 rounded-xl border-2 border-gray-300 shadow-md mb-6">
      <div className="profile flex items-center mb-5">
        <div className="profilePicture">
          <img
            src={posterPicture == null ? dp : posterPicture}
            className="w-12 h-12 rounded-full object-cover border-3 border-gray-200 hover:border-gray-400 transition-colors"
          />
        </div>
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
        <div className="postContent text-black mb-5 text-base leading-relaxed">
          {content}
        </div>
        {postMediaArray && postMediaArray.length > 0 && (
          <div className=" mb-5">
            {postMediaArray?.length > 0 && (
              <div className="">
                {postMediaArray.map((media, index) => {
                  const url = media.media_url;
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
                              <audio controls preload="auto" className="w-full">
                                <source src={url} type="audio/mpeg" />
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
                              preload="metadata"
                              playsInline
                              className="w-full max-h-[500px] bg-black"
                              poster={
                                media.thumbnail_url || "/video-thumbnail.jpg"
                              }
                            >
                              <source src={url} type="video/mp4" />
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

      <div className="postDetails flex items-center text-sm text-black  space-x-6 font-medium">
        <div className="detail transition-colors">{reactionCount} Likes</div>
        <div className="detail transition-colors">
          {postCommentCount} Comments
        </div>
        <div className="detail">{getDate(postTime)}</div>
        <div className="detail">{getPMTime(postTime)}</div>
      </div>

      {commentators && commentators.length > 0 && (
        <div className="commentsSection mt-4 pt-5 border-t-2 border-gray-300">
          <h4 className="text-base font-bold text-orange-700 mb-4">
            Comments ({commentators.length})
          </h4>
          <div className="space-y-4">
            {commentators.map((commentator, index) => (
              <div
                key={index}
                className="commentBox flex items-start space-x-3 hover:bg-orange-25 p-2 rounded-lg transition-colors"
              >
                <div className="profilePicture">
                  {commentator?.user_picture ? (
                    <img src={commentator.user_picture} alt="User" />
                  ) : (
                    <div className="psudoProfilePicture">
                      <span>{commentator?.full_name?.[0] || "U"}</span>
                    </div>
                  )}
                </div>
                <div className="commentContentBox flex-1">
                  <div className="bg-orange-100 rounded-xl px-4 py-3 border border-orange-200">
                    <div className="name text-sm font-bold text-orange-800 hover:text-orange-600 transition-colors">
                      {commentator.full_name}
                    </div>
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
const MediaContainer = ({ children }) => (
  <div className="media-container my-4 rounded-xl overflow-hidden shadow border-2 border-orange-200 bg-orange-50">
    {children}
  </div>
);
