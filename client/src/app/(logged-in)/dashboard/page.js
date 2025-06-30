import Header from "@/components/ui/Header";
import QuestPreview from "@/components/Dashboard/QuestPreview";
import Dashboard from "@/components/Dashboard/Dashboard";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.get("userRegistered");
  const response = await fetch(
    `https://jiggasha.onrender.com/dashboard/allInformations`,
    {
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader ? `userRegistered=${cookieHeader.value}` : "",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }
  const dashboardData = await response.json();

  return (
    <div>
      <Header title="Dashboard" />
      <Dashboard data={dashboardData} />
    </div>
  );
}
