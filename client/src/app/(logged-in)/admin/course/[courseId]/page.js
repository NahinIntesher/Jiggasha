import { cookies } from "next/headers";
import CourseDetails from "@/components/Admin/Courses/CourseDetails";

export default async function SingleCoursePage({ params }) {
  const { courseId } = params;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.get("userRegistered");
  const cookieValue = cookieHeader
    ? `userRegistered=${cookieHeader.value}`
    : "";

  const courseRes = await fetch(
    `http://localhost:8000/courses/single/${courseId}`,
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

  return <CourseDetails course={course} />;
}
