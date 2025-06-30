import QuestTabs from "@/components/Quest/QuestTab";
import { cookies } from "next/headers";

export default async function QuestPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.get("userRegistered");

  const questsResponse = await fetch("https://jiggasha.onrender.com/quests", {
    headers: {
      "Content-Type": "application/json",
      cookie: cookieHeader ? `userRegistered=${cookieHeader.value}` : "",
    },
    cache: "no-store",
  });
  const questsData = await questsResponse.json();

  const completedQuestsResponse = await fetch(
    "https://jiggasha.onrender.com/quests/completed",
    {
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader ? `userRegistered=${cookieHeader.value}` : "",
      },
      cache: "no-store",
    }
  );
  const completedQuestsData = await completedQuestsResponse.json();

  return (
    <QuestTabs allQuests={questsData} completedQuests={completedQuestsData} />
  );
}
