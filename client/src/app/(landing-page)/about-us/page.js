import React from "react";
import { FaUsers, FaBullseye, FaLightbulb } from "react-icons/fa";

export default function AboutUs() {
  return (
    <div className="py-16 px-6 md:px-20">
      {/* Top Heading Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          About Us
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Learn more about our story, our mission, and our vision for the
          future!
        </p>
      </div>

      {/* Main Content Section */}
      <div className="max-w-5xl mx-auto space-y-10 text-center mb-20">
        <p className="text-gray-600 text-lg">
          Jiggasha was founded with a simple yet powerful goal: to transform how
          students learn, compete, and grow. We believe education should be
          exciting, accessible, and empowering for everyone — from school
          students to university learners.
        </p>
        <p className="text-gray-600 text-lg">
          Our platform combines technology, innovation, and a passion for
          learning to create a unique, engaging experience through battle royale
          competitions, AI-driven feedback, and personalized progress tracking.
        </p>
      </div>

      {/* Info Cards Section */}
      <div className="py-12 rounded-xl">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
          {/* Info 1: Our Team */}
          <div className="text-center border rounded-xl p-10 border-gray-300 shadow-md">
            <div className="flex justify-center mb-4">
              <FaUsers className="text-5xl text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Our Team</h3>
            <p className="text-gray-500">
              A group of passionate developers, educators, and innovators
              working together.
            </p>
          </div>

          {/* Info 2: Our Mission */}
          <div className="text-center border rounded-xl p-10 border-gray-300 shadow-md">
            <div className="flex justify-center mb-4">
              <FaBullseye className="text-5xl text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Our Mission
            </h3>
            <p className="text-gray-500">
              To inspire and empower learners to achieve their fullest potential
              through technology.
            </p>
          </div>

          {/* Info 3: Our Vision */}
          <div className="text-center border rounded-xl p-10 border-gray-300 shadow-md">
            <div className="flex justify-center mb-4">
              <FaLightbulb className="text-5xl text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Our Vision</h3>
            <p className="text-gray-500">
              A future where learning is engaging, competitive, and available to
              everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
