import AdminDashboard from "@/components/Admin/AdminDashboard/AdminDashboard";
import { cookies } from "next/headers";

async function fetchDashboardData() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.get("userRegistered");
  try {
    const response = await fetch(
      "https://jiggasha.onrender.com/admin/dashboard/allInformations",
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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
}

export default async function DashboardPage() {
  const dashboardData = await fetchDashboardData();

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Unable to load dashboard data
          </h2>
          <p className="text-gray-500">Please try again later</p>
        </div>
      </div>
    );
  }

  return <AdminDashboard data={dashboardData} />;
}
