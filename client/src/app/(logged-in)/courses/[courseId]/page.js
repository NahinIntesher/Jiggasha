import { cookies } from "next/headers";
import CourseDetails from "@/components/Courses/CourseDetails";

export default async function SingleCoursePage({ params }) {
  const resolvedParams = await params;
  const { courseId } = resolvedParams;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.get("userRegistered");
  const cookieValue = cookieHeader
    ? `userRegistered=${cookieHeader.value}`
    : "";

  const courseRes = await fetch(
    `https://jiggasha.onrender.com/courses/single/${courseId}`,
    {
      headers: {
        "Content-Type": "application/json",
        cookie: cookieValue,
      },
      cache: "no-store",
    }
  );

  if (!courseRes.ok) {
    throw new Error("Failed to fetch course data");
  }

  const course = await courseRes.json();

  // Optional: If you plan to get lectures/materials in future
  // const lecturesRes = await fetch(`https://jiggasha.onrender.com/courses/${courseId}/lectures`, { ... });
  // const lectures = await lecturesRes.json();

  return <CourseDetails course={course} />;
}
