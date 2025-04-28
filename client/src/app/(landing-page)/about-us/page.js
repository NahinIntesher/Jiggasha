import React from "react";

export default function AboutUs() {
  return (
    <div className="bg-white p-10 rounded-lg shadow-lg max-w-4xl mx-auto mt-12">
      <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-8">
        About Us
      </h1>
      <div className="text-lg text-gray-600 leading-relaxed space-y-6">
        <p>
          At <span className="font-semibold text-orange-500">Jiggasha</span>, our
          mission is to provide a world-class platform that empowers users to
          explore, learn, and grow through engaging content and interactive
          experiences. We believe in fostering a community where knowledge,
          creativity, and collaboration thrive.
        </p>
        <p>
          Our platform offers a wide range of educational tools, courses, and
          entertainment features designed to meet the needs of diverse learners
          and enthusiasts. Whether you're here to advance your skills, connect
          with peers, or just have fun, we are committed to delivering a
          seamless, intuitive, and enriching experience.
        </p>
        <p>
          Our team is composed of experts in various fields who are passionate
          about pushing the boundaries of education and technology. Together, we
          work to create solutions that make learning more accessible, enjoyable,
          and impactful.
        </p>
        <p>
          Thank you for choosing us. We are here to help you succeed and achieve
          your goals. Join us on this exciting journey, and let's make learning
          a transformative experience.
        </p>
      </div>
    </div>
  );
}
