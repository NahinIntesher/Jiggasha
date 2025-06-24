"use client";
import Link from "next/link";

export default function QuestPreview() {
  return (
    <div className="m-4 p-4 rounded-lg bg-white border border-gray-300 shadow-md">
      <h2 className="text-lg font-semibold mb-2">🎯 Quests</h2>
      <p className="text-sm text-black mb-2">
        Complete tasks and earn rewards!
      </p>
      <Link
        href="/quests"
        className="inline-block mt-2 text-orange-500 text-sm"
      >
        View All Quests →
      </Link>
    </div>
  );
}
