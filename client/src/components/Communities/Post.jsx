"use client";
import React, { useEffect, useState } from "react";
import dp from "../../../public/images/demo_profile_image.jpg";
import CommentBox from "../../components/Communities/CommentBox";
import NotFound from "../../components/ui/NotFound";
import HeaderAlt from "../../components/ui/HeaderAlt";
import PostCard from "./PostCard";

import { useParams } from "next/navigation";

export default function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [commentators, setCommentators] = useState([]);
  const [commentContent, setCommentContent] = useState("");

  const [updatePost, setUpdatePost] = useState(0);

  const handleChange = (e) => {
    const { value } = e.target;
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
    setCommentContent(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!commentContent.trim()) {
      alert("Write something in the comment box!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/communities/post/comments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            commentContent,
            postId,
          }),
        }
      );

      const contentType = response.headers.get("content-type");

      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        alert("Unexpected response from server.");
        return;
      }

      if (response.ok && data.status === "Success") {
        console.log("Comment submitted successfully!");
        setCommentContent("");
        setUpdatePost((prev) => prev + 1);
      } else {
        alert(data?.Error || "Failed to submit comment.");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Something went wrong while submitting your comment.");
    }
  };

  useEffect(() => {
    fetch("http://localhost:8000/communities/singlePost/" + postId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Post Data:", data);
        const postData = data?.post || {};
        const commentsData = data?.post?.commentators || [];

        setPost(postData);
        setCommentators(commentsData);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
      });
  }, [updatePost]);

  return (
    <div className="mainContent">
      <HeaderAlt title={`${post.author_name || "Anonymous"}'s Post`} />
      <div className="postBoxContainer">
        {Object.keys(post).length > 0 && (
          <PostCard
            key={post.post_id}
            postId={post.post_id}
            posterId={post.member_id}
            posterName={post.author_name || "Anonymous"}
            posterPicture={post.author_picture}
            content={post.content}
            postTimeAgo={post.created_at}
            postMediaArray={post.media || []}
            isPostReacted={!!post.is_reacted}
            postReactionCount={parseInt(post.reaction_count)}
            postCommentCount={parseInt(post.comment_count)}
            postTime={post.created_at}
            setUpdatePost={setUpdatePost}
            commentators={commentators}
          />
        )}
        <div className="giveCommentBox bg-white rounded-xl shadow-sm border border-gray-300 p-4 mt-6">
          <form onSubmit={handleSubmit} className="flex items-start gap-3">
            {/* Comment Input Area */}
            <div className="flex-1">
              <textarea
                id="content"
                name="content"
                placeholder="Share your thoughts..."
                onChange={handleChange}
                value={commentContent}
                className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg  outline-none"
                rows="3"
              />

              <div className="flex justify-end">
                <button
                  className={`px-5 py-2 rounded-xl font-medium transition-all mt-6 ${
                    commentContent
                      ? "bg-orange-400 text-white hover:bg-orange-300"
                      : "bg-orange-100 text-orange-300 cursor-not-allowed"
                  }`}
                  type="submit"
                  disabled={!commentContent}
                >
                  Post Comment
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
