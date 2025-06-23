import BrowseCourses from "./BrowseCourses";
import Header from "../../ui/Header";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

export default function AdmincCourseTabs({ allCourses }) {
  return (
    <div>
      <Header title="Course Management" />
      <BrowseCourses coursesData={allCourses} />
      <Link href="/admin/course/new-course" className="newButton">
        <FaPlus className="icon" />
        <div className="text">New Course</div>
      </Link>
    </div>
  );
}
