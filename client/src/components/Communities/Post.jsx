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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (commentContent == "") {
      alert("Write something in comment box!");
      return;
    }

    fetch("http://localhost:8000/communities/post/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        commentContent: commentContent,
        postId: postId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "Success") {
          console.log("Comment Success!");
          setCommentContent("");
          setUpdatePost((prevData) => prevData + 1);
        } else {
          alert(data.Error);
        }
      })
      .catch((err) => console.error("Error submitting comment:", err));
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
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 mt-6">
          <form onSubmit={handleSubmit} className="flex items-start gap-3">
            {/* Profile Picture */}
            <div className="profilePicture shrink-0">
              <img
                src={post.author_picture == null ? dp : post.author_picture}
                className="w-10 h-10 rounded-full object-cover border-2 border-orange-200"
              />
            </div>

            {/* Comment Input Area */}
            <div className="flex-1 space-y-3">
              <textarea
                id="content"
                name="content"
                placeholder="Share your thoughts..."
                onChange={handleChange}
                value={commentContent}
                className="w-full p-3 text-gray-800 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300 outline-none transition-all resize-none min-h-[80px] placeholder-orange-300"
                rows="3"
              />

              <div className="flex justify-end">
                <button
                  className={`px-5 py-2 rounded-full font-medium transition-all ${
                    commentContent
                      ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-200 transform hover:scale-105"
                      : "bg-orange-100 text-orange-400 cursor-not-allowed"
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
