import ReportedPosts from "@/components/Admin/Reports/ReportedPosts";
import Header from "@/components/ui/Header";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.get("userRegistered");

  let posts = [];

  try {
    const res = await fetch(
      "https://jiggasha.onrender.com/communities/allReportedPosts/",
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: `userRegistered=${
            cookieStore.get("userRegistered")?.value || ""
          }`,
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!res.ok) throw new Error("Failed to fetch posts");
    const data = await res.json();
    posts = data.posts || [];
  } catch (err) {
    console.error("Fetch error:", err);
  }

  return (
    <div>
      <Header title="Reported Posts" />
      <div className="h-4" />
      <ReportedPosts posts={posts} />
    </div>
  );
}
