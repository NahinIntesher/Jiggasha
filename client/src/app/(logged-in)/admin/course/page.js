import AdmincCourseTabs from "@/components/Admin/Courses/AdminCourseTabs";
import { cookies } from "next/headers";

export default async function CoursePage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.get("userRegistered");
  const allCoursesResponse = await fetch(
    "https://jiggasha.onrender.com/courses",
    {
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader ? `userRegistered=${cookieHeader.value}` : "",
      },
      cache: "no-store",
    }
  );
  const allCoursesData = await allCoursesResponse.json();

  return <AdmincCourseTabs allCourses={allCoursesData} />;
}
