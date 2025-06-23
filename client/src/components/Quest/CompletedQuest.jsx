"use client";
import { useState } from "react";
import NotFoundPage from "../ui/NotFound";
import QuestCard from "./QuestCard";
import { FaList, FaGripVertical } from "react-icons/fa";

export default function CompletedQuests({ quests }) {
  const [view, setView] = useState("list");

  if (!quests.length) return <NotFoundPage type="quest" />;

  return (
    <div>
      <div className="filterContainer">
        <div className="views">
          <div
            className={view === "list" ? "viewIcon activeIcon" : "viewIcon"}
            onClick={() => setView("list")}
          >
            <FaList />
          </div>
          <div
            className={view === "grid" ? "viewIcon activeIcon" : "viewIcon"}
            onClick={() => setView("grid")}
          >
            <FaGripVertical />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1  gap-4">
        {quests.map((quest) => (
          <QuestCard
            key={quest.quest_id}
            quest={quest}
            onClaim={() => {}}
            view={view}
          />
        ))}
      </div>
    </div>
  );
}
