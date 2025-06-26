import React from "react";
import {
  FaChalkboardTeacher,
  FaGamepad,
  FaUsers,
  FaArrowRight,
  FaStar,
} from "react-icons/fa";

export default function OurServices() {
  const services = [
    {
      icon: FaChalkboardTeacher,
      title: "Interactive Learning",
      description:
        "Explore interactive courses and learning materials tailored to your growth and learning style.",
      features: [
        "Personalized Curriculum",
        "Real-Time Feedback",
        "Progress Tracking",
      ],
      color: "from-orange-400 to-red-500",
    },
    {
      icon: FaGamepad,
      title: "Gamified Experience",
      description:
        "Track your progress, earn rewards, and enjoy the thrill of game-like challenges and competitions.",
      features: ["Achievement System", "Leaderboard", "Skill Challenges"],
      color: "from-orange-500 to-amber-600",
    },
    {
      icon: FaUsers,
      title: "Community Engagement",
      description:
        "Connect, collaborate, and grow with a vibrant community of learners, mentors, and industry experts.",
      features: ["Peer Collaboration", "Expert Mentorship", "Study Groups"],
      color: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="relative py-20 px-6 md:px-20 bg-gradient-to-br from-orange-50 via-white to-amber-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-orange-200/30 to-amber-200/30 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-red-200/20 to-orange-200/20 rounded-full blur-3xl translate-x-48 translate-y-48"></div>

      {/* Header Section */}
      <div className="relative text-center mb-20">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-6 py-3 rounded-full text-sm font-semibold mb-6 border border-orange-200">
          <FaStar className="text-xs" />
          Our Services
        </div>
        <h1 className="text-xl md:text-5xl font-bold bg-gradient-to-r from-orange-800 via-orange-600 to-red-600 bg-clip-text text-transparent mb-6 leading-tight">
          What We Offer
        </h1>
        <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
          At{" "}
          <span className="text-orange-600 font-bold text-2xl">Jiggasha</span>,
          we offer cutting-edge educational services that make learning{" "}
          <span className="text-orange-500 font-semibold">fun</span>,{" "}
          <span className="text-red-500 font-semibold">engaging</span>, and{" "}
          <span className="text-amber-600 font-semibold">competitive</span>.
        </p>
      </div>

      {/* Services Grid */}
      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-orange-100 hover:border-orange-200"
          >
            {/* Gradient background overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`}
            ></div>

            {/* Icon with gradient background */}
            <div className="relative mb-8">
              <div
                className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${service.color} p-1 mx-auto shadow-lg`}
              >
                <div className="w-full h-full bg-white text-orange-600 rounded-2xl flex items-center justify-center">
                  <service.icon className={`text-4xl`} />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="relative text-center">
              <h3
                className={`text-xl font-bold text-gray-800 mb-4 group-hover:bg-gradient-to-r group-hover:${service.color} group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`}
              >
                {service.title}
              </h3>

              <p className="text-gray-600 mb-6 text-md leading-relaxed text-justify">
                {service.description}
              </p>

              {/* Features list */}
              <ul className="space-y-3 mb-8">
                {service.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-sm text-gray-600 justify-center"
                  >
                    <div
                      className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.color}`}
                    ></div>
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={`group/btn relative w-full bg-gradient-to-r ${service.color} text-white py-4 px-6 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2`}
              >
                Learn More
                <FaArrowRight className="text-sm group-hover/btn:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
              </button>
            </div>

            {/* Decorative corner elements */}
            <div
              className={`absolute top-6 right-6 w-6 h-6 bg-gradient-to-br ${service.color} rounded-full opacity-20 group-hover:opacity-40 transition-opacity`}
            ></div>
            <div
              className={`absolute bottom-6 left-6 w-4 h-4 bg-gradient-to-br ${service.color} rounded-full opacity-15 group-hover:opacity-30 transition-opacity`}
            ></div>
          </div>
        ))}
      </div>

      {/* Bottom CTA Section */}
      <div className="relative text-center mt-20">
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 rounded-3xl p-12 max-w-5xl mx-auto text-white shadow-2xl">
          <h3 className="text-4xl font-bold mb-4">
            Ready to Transform Your Learning?
          </h3>
          <p className="text-orange-100 mb-8 text-xl leading-relaxed">
            Join thousands of students already experiencing the future of
            education.
          </p>
          <button className="bg-white text-orange-600 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-orange-50 transition-colors shadow-lg hover:shadow-xl hover:scale-105 transform duration-200">
            Get Started Today
          </button>
        </div>
      </div>

      {/* Additional decorative elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-gradient-to-r from-orange-300/20 to-amber-300/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-1/4 right-10 w-16 h-16 bg-gradient-to-r from-red-300/20 to-orange-300/20 rounded-full blur-xl"></div>
    </div>
  );
}
