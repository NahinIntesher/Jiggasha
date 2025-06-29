"use client";
import HeaderAlt from "@/components/ui/HeaderAlt";
import React, { use, useEffect, useState } from "react";
import {
  FaMusic,
  FaComment,
  FaThumbsUp,
  FaFlag,
  FaFilePdf,
  FaRegThumbsUp,
} from "react-icons/fa";

import NotFound from "@/components/ui/NotFound";
import Link from "next/link";
import { FaBucket, FaDeleteLeft } from "react-icons/fa6";

export default function ReportedPosts({ posts }) {
  const [loading, setLoading] = useState(false);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>
    );

  const handleDelete = async (postId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/communities/deleteReportedPost/${postId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      // Optionally, you can refresh the posts list or remove the deleted post from the UI
      // For now, just log success
      console.log("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="miniBreak" />

      {/* Posts List */}
      <div className="postBoxContainer">
        {posts.length === 0 ? (
          <NotFound
            title={"No Posts Yet"}
            description={
              "This community is just getting started. Be the first to share something!"
            }
          />
        ) : (
          posts.map((post) => (
            <div key={post.post_id} className="postBox">
              <div
                className="reportButton"
                onClick={() => handleDelete(post.post_id)}
              >
                <FaBucket className="icon" />
                <span className="text">Delete</span>
              </div>

              <div className="profile">
                <div className="profilePicture">
                  {post.author_picture ? (
                    <img src={post.author_picture} alt="Author" />
                  ) : (
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50px",
                        border: "3px solid #ffffff",
                        backgroundColor: "#6366f1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {post.author_name?.[0] || "?"}
                    </div>
                  )}
                </div>

                <div className="profileDetail">
                  <div className="name">{post.author_name || "Anonymous"}</div>
                  <div className="detail">
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="postContent">{post.content}</div>

              {post.media?.length > 0 && (
                <div className="p-5">
                  {post.media && post.media.length > 0 && (
                    <div className="">
                      {post.media.map((media, index) => {
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
                                      Your browser does not support the audio
                                      element.
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
                                      media.thumbnail_url ||
                                      "/video-thumbnail.jpg"
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

              <div className="postDetails">
                <span className="detail">{post.reaction_count} reactions</span>
                <span className="divider"></span>
                <span className="detail">{post.comment_count} comments</span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
