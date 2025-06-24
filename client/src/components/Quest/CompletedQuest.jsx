"use client";
import { useState } from "react";
import NotFoundPage from "../ui/NotFound";
import QuestCard from "./QuestCard";

export default function CompletedQuests({ quests, onClaim, view, setView }) {
  if (!quests.length) return <NotFoundPage type="quest" />;

  return (
    <div>
      {view === "list" ? (
        <div className="grid grid-cols-1 gap-4 px-5 mt-5">
          {quests.map((quest) => (
            <QuestCard
              key={quest.quest_id}
              quest={quest}
              onClaim={onClaim}
              view={view}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-5 mt-5">
          {quests.map((quest) => (
            <QuestCard
              key={quest.quest_id}
              quest={quest}
              onClaim={onClaim}
              view={view}
            />
          ))}
        </div>
      )}
    </div>
  );
}
