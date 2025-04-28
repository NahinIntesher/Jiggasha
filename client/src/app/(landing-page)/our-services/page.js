import React from "react";

export default function OurServices() {
  return (
    <div className="bg-white p-10 rounded-lg shadow-lg max-w-4xl mx-auto mt-12">
      <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-8">
        Our Services
      </h1>
      <div className="text-lg text-gray-600 leading-relaxed space-y-6">
        <p>
          At <span className="font-semibold text-orange-500">Jiggasha</span>, we
          are committed to providing high-quality services designed to enhance
          the learning and entertainment experience. We offer a variety of
          features to help you achieve your goals, whether you're here to learn,
          play, or connect with others.
        </p>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center">
              <span className="text-xl font-bold">1</span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Interactive Learning
              </h3>
              <p>
                Explore our vast library of courses and learning materials. From
                technical skills to creative development, our platform provides
                a wide range of interactive content tailored to meet your needs.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center">
              <span className="text-xl font-bold">2</span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Gamified Learning Experience
              </h3>
              <p>
                Learn through play! Our gamified approach helps you track
                progress, earn rewards, and stay motivated while mastering new
                skills and knowledge.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center">
              <span className="text-xl font-bold">3</span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Community Interaction
              </h3>
              <p>
                Join our vibrant community of learners and experts. Share ideas,
                collaborate on projects, and expand your network in a supportive
                and engaging environment.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center">
              <span className="text-xl font-bold">4</span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Leaderboards & Rewards
              </h3>
              <p>
                Track your progress through our leaderboards and earn exciting
                rewards as you advance through the platform. Compete, improve,
                and grow while enjoying the journey.
              </p>
            </div>
          </div>
        </div>

        <p>
          At <span className="font-semibold text-orange-500">Jiggasha</span>, we
          continuously innovate to offer new and exciting services that enrich
          the learning and entertainment experience. Join us and discover how we
          can help you achieve your personal and professional goals.
        </p>
      </div>
    </div>
  );
}
