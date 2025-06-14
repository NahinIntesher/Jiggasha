"use client";
import { useState } from "react";

export default function GivePostBox({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setLoading(true);
    const newPost = {
      post_id: crypto.randomUUID(),
      title: title || "Untitled Post",
      content,
      member_id: "3466f295-7469-4524-ad33-6feacf2ad719", // Replace with dynamic user ID
      is_pinned: false,
      view_count: 0,
      approval_status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      reaction_count: "0",
      comment_count: "0",
      media: [],
    };

    // Simulate API call
    await new Promise((res) => setTimeout(res, 500));
    onPostCreated(newPost);
    setContent("");
    setTitle("");
    setLoading(false);
  };

  return (
    <div className="bg-white shadow p-4 rounded-xl border border-gray-200">
      <input
        type="text"
        placeholder="Title (optional)"
        className="w-full mb-2 p-2 border border-gray-300 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="What's on your mind?"
        className="w-full p-2 border border-gray-300 rounded resize-none"
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-end mt-2">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
