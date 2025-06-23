"use client";
import { useState } from "react";
import NotFoundPage from "../ui/NotFound";
import QuestCard from "./QuestCard";
import { FaList, FaGripVertical } from "react-icons/fa";

export default function BrowseQuests({ quests, onClaim }) {
  const [view, setView] = useState("grid");

  if (!quests.length) return <NotFoundPage type="quest" />;

  return (
    <div>
      <div className="filterContainer m-5">
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

      {view === "list" ? (
        <div className="grid grid-cols-1 gap-4 px-5">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-5">
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
