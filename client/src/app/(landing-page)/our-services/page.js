import React from "react";
import { FaChalkboardTeacher, FaGamepad, FaUsers } from "react-icons/fa"; // Using react-icons

export default function OurServices() {
  return (
    <div className=" py-16 px-6 md:px-20">
      {/* Top section like "WE'LL BE BACK SOON" */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Our Services
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          At <span className="text-orange-500 font-semibold">Jiggasha</span>, we
          provide high-quality services designed to make learning fun, engaging,
          and competitive.
        </p>
      </div>

      {/* Services Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {/* Service 1 */}
        <div className="border border-gray-200 rounded-xl p-8 text-center shadow-md hover:shadow-lg transition">
          <div className="flex justify-center mb-6">
            <FaChalkboardTeacher className="text-5xl text-orange-500" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Interactive Learning
          </h3>
          <p className="text-gray-500">
            Explore a wide range of interactive courses and learning materials
            tailored to your growth.
          </p>
        </div>

        {/* Service 2 */}
        <div className="border border-gray-200 rounded-xl p-8 text-center shadow-md hover:shadow-lg transition">
          <div className="flex justify-center mb-6">
            <FaGamepad className="text-5xl text-orange-500" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Gamified Experience
          </h3>
          <p className="text-gray-500">
            Track your progress, earn rewards, and enjoy learning through
            exciting game-like challenges.
          </p>
        </div>

        {/* Service 3 */}
        <div className="border border-gray-200 rounded-xl p-8 text-center shadow-md hover:shadow-lg transition">
          <div className="flex justify-center mb-6">
            <FaUsers className="text-5xl text-orange-500" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Community Engagement
          </h3>
          <p className="text-gray-500">
            Connect, collaborate, and grow with a vibrant community of learners
            and mentors.
          </p>
        </div>
      </div>
    </div>
  );
}
