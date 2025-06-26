"use client";
import React from "react";
import {
  FaGraduationCap,
  FaGamepad,
  FaUsers,
  FaTrophy,
  FaBook,
  FaUniversity,
  FaComments,
  FaChartLine,
} from "react-icons/fa";
import {
  Award,
  BookOpen,
  BrainCircuit,
  ChevronRight,
  MessageSquare,
  Star,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Animation components
const FadeIn = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

const SlideIn = ({ children, direction = "left", delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const x = direction === "left" ? -50 : 50;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay, type: "spring", stiffness: 100 }}
    >
      {children}
    </motion.div>
  );
};

const ScaleIn = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section with Background Image */}
      <section
        className="relative bg-gradient-to-r from-orange-600 to-orange-400 h-screen flex items-center justify-center text-center px-6 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/bgJiggasha.jpg')",
          backgroundColor: "rgba(255, 140, 0, 0.3)",
          backgroundBlendMode: "multiply",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="max-w-4xl relative z-10">
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Jiggasha
          </motion.h1>

          <motion.p
            className="text-2xl md:text-3xl font-bold text-white mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Where learning feels like playing
          </motion.p>

          <motion.p
            className="text-lg md:text-xl text-white mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Turn every lesson into a challenge, and every victory into a new
            step in learning
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <motion.a
              href="#features"
              className="bg-white text-orange-700 font-semibold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Features
              <ChevronRight className="ml-2" />
            </motion.a>
            <motion.a
              href="#signup"
              className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg text-lg hover:bg-white hover:text-orange-700 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Now
            </motion.a>
          </motion.div>
        </div>

        {/* Animated scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <motion.div
              className="w-1 h-2 bg-white rounded-full mt-2"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
            />
          </div>
        </motion.div>
      </section>

      {/* Why Jiggasha Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Why <span className="text-orange-600">Jiggasha</span>?
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Jiggasha means{" "}
              <span className="font-semibold">
                questions, curiosity, and the desire to learn
              </span>
              . Our platform encourages students to ask questions, explore
              topics, and learn interactively.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SlideIn direction="left" delay={0.3}>
              <motion.div
                className="bg-orange-50 p-6 rounded-xl"
                whileHover={{
                  y: -10,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <FaGamepad className="text-orange-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Game-Based Learning
                </h3>
                <p className="text-gray-600">
                  Turn every lesson into an exciting challenge that inspires
                  students to learn more.
                </p>
              </motion.div>
            </SlideIn>

            <FadeIn delay={0.4}>
              <motion.div
                className="bg-orange-50 p-6 rounded-xl"
                whileHover={{
                  y: -10,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Users className="text-orange-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Competitive Spirit
                </h3>
                <p className="text-gray-600">
                  Challenge friends, compete with classmates, and climb the
                  leaderboard while learning.
                </p>
              </motion.div>
            </FadeIn>

            <SlideIn direction="right" delay={0.3}>
              <motion.div
                className="bg-orange-50 p-6 rounded-xl"
                whileHover={{
                  y: -10,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <BrainCircuit className="text-orange-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
                <p className="text-gray-600">
                  Get personalized learning support and instant answers to your
                  questions.
                </p>
              </motion.div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Game Modes Section */}
      <section className="py-16 bg-gray-50" id="features">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Exciting <span className="text-orange-600">Game Modes</span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Battle Royal */}
            <SlideIn direction="left" delay={0.2}>
              <motion.div
                className="bg-white p-8 rounded-xl shadow-lg border border-orange-100 hover:shadow-xl transition"
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex justify-center mb-6">
                  <motion.div
                    className="bg-orange-500 p-4 rounded-full"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 1 }}
                  >
                    <Award className="text-3xl text-white" />
                  </motion.div>
                </div>
                <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">
                  Battle Royale
                </h3>
                <p className="text-gray-700 text-center">
                  10-12 students compete academically over multiple rounds.
                  Students near the bottom get eliminated each round. Those who
                  survive till the end win!
                </p>
              </motion.div>
            </SlideIn>

            {/* Pair to Pair */}
            <FadeIn delay={0.3}>
              <motion.div
                className="bg-white p-8 rounded-xl shadow-lg border border-orange-100 hover:shadow-xl transition"
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex justify-center mb-6">
                  <motion.div
                    className="bg-orange-500 p-4 rounded-full"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                    }}
                  >
                    <FaUsers className="text-3xl text-white" />
                  </motion.div>
                </div>
                <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">
                  Pair-to-Pair Battle
                </h3>
                <p className="text-gray-700 text-center">
                  Two students compete in 4 rounds, each selecting 2 subjects.
                  Test your knowledge head-on!
                </p>
              </motion.div>
            </FadeIn>

            {/* Friendly Battle */}
            <SlideIn direction="right" delay={0.2}>
              <motion.div
                className="bg-white p-8 rounded-xl shadow-lg border border-orange-100 hover:shadow-xl transition"
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex justify-center mb-6">
                  <motion.div
                    className="bg-orange-500 p-4 rounded-full"
                    whileHover={{ scale: 1.2 }}
                  >
                    <FaGamepad className="text-3xl text-white" />
                  </motion.div>
                </div>
                <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">
                  Friendly Battle
                </h3>
                <p className="text-gray-700 text-center">
                  Create a room and challenge your friends on specific academic
                  topics. Learning together has never been this fun!
                </p>
              </motion.div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Learning Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Complete{" "}
              <span className="text-orange-600">Learning Features</span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Courses with AI */}
            <ScaleIn delay={0.1}>
              <motion.div
                className="bg-orange-50 p-6 rounded-xl"
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 15px -3px rgba(249, 115, 22, 0.3)",
                }}
              >
                <div className="flex items-center mb-4">
                  <motion.div
                    className="bg-orange-100 p-3 rounded-full mr-4"
                    whileHover={{ rotate: 15 }}
                  >
                    <BookOpen className="text-orange-600 text-xl" />
                  </motion.div>
                  <h3 className="text-xl font-semibold">
                    Courses with AI Assistant
                  </h3>
                </div>
                <p className="text-gray-600">
                  Complete courses for classes 6-12, university admission, and
                  undergraduate level. AI assistant available alongside videos
                  for instant questions.
                </p>
              </motion.div>
            </ScaleIn>

            {/* Daily Progress */}
            <ScaleIn delay={0.2}>
              <motion.div
                className="bg-orange-50 p-6 rounded-xl"
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 15px -3px rgba(249, 115, 22, 0.3)",
                }}
              >
                <div className="flex items-center mb-4">
                  <motion.div
                    className="bg-orange-100 p-3 rounded-full mr-4"
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <FaChartLine className="text-orange-600 text-xl" />
                  </motion.div>
                  <h3 className="text-xl font-semibold">
                    Daily Progress & Quizzes
                  </h3>
                </div>
                <p className="text-gray-600">
                  Track your 24-hour study progress and participate in daily
                  quizzes based on recently studied topics.
                </p>
              </motion.div>
            </ScaleIn>

            {/* Quests */}
            <ScaleIn delay={0.3}>
              <motion.div
                className="bg-orange-50 p-6 rounded-xl"
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 15px -3px rgba(249, 115, 22, 0.3)",
                }}
              >
                <div className="flex items-center mb-4">
                  <motion.div
                    className="bg-orange-100 p-3 rounded-full mr-4"
                    whileHover={{ scale: 1.2 }}
                  >
                    <Award className="text-orange-600 text-xl" />
                  </motion.div>
                  <h3 className="text-xl font-semibold">Quests</h3>
                </div>
                <p className="text-gray-600">
                  New quests will arrive periodically. Complete these challenges
                  by achieving specific learning goals and earn rewards.
                </p>
              </motion.div>
            </ScaleIn>

            {/* Blog */}
            <ScaleIn delay={0.4}>
              <motion.div
                className="bg-orange-50 p-6 rounded-xl"
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 15px -3px rgba(249, 115, 22, 0.3)",
                }}
              >
                <div className="flex items-center mb-4">
                  <motion.div
                    className="bg-orange-100 p-3 rounded-full mr-4"
                    whileHover={{ rotate: 15 }}
                  >
                    <MessageSquare className="text-orange-600 text-xl" />
                  </motion.div>
                  <h3 className="text-xl font-semibold">Knowledge Blog</h3>
                </div>
                <p className="text-gray-600">
                  Share knowledge through blog posts (notes, guidelines).
                  Discover the best content via voting system (upvote/downvote).
                </p>
              </motion.div>
            </ScaleIn>

            {/* Leaderboard */}
            <ScaleIn delay={0.5}>
              <motion.div
                className="bg-orange-50 p-6 rounded-xl"
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 15px -3px rgba(249, 115, 22, 0.3)",
                }}
              >
                <div className="flex items-center mb-4">
                  <motion.div
                    className="bg-orange-100 p-3 rounded-full mr-4"
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                    }}
                  >
                    <FaChartLine className="text-orange-600 text-xl" />
                  </motion.div>
                  <h3 className="text-xl font-semibold">Leaderboard</h3>
                </div>
                <p className="text-gray-600">
                  Earn points by winning Battle Royale and Pair-to-Pair battles.
                  Increase your rank and see how you compare to others!
                </p>
              </motion.div>
            </ScaleIn>

            {/* Communities */}
            <ScaleIn delay={0.6}>
              <motion.div
                className="bg-orange-50 p-6 rounded-xl"
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 15px -3px rgba(249, 115, 22, 0.3)",
                }}
              >
                <div className="flex items-center mb-4">
                  <motion.div
                    className="bg-orange-100 p-3 rounded-full mr-4"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                    }}
                  >
                    <Users className="text-orange-600 text-xl" />
                  </motion.div>
                  <h3 className="text-xl font-semibold">Communities</h3>
                </div>
                <p className="text-gray-600">
                  Create or join communities based on classes or subjects.
                  Discuss questions with peers and learn collaboratively.
                </p>
              </motion.div>
            </ScaleIn>
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-400 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <SlideIn direction="left">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Your Personal{" "}
                  <span className="text-orange-200">AI Learning Assistant</span>
                </h2>
                <p className="text-lg mb-8">
                  Jiggasha’s AI assistant monitors your progress, provides
                  personalized advice, and guides not only academic but also
                  life skills development.
                </p>
                <ul className="space-y-4">
                  <motion.li className="flex items-start" whileHover={{ x: 5 }}>
                    <ChevronRight className="h-6 w-6 text-orange-200 mr-2 flex-shrink-0" />
                    <span>
                      Tracks your learning style and customizes content
                    </span>
                  </motion.li>
                  <motion.li className="flex items-start" whileHover={{ x: 5 }}>
                    <ChevronRight className="h-6 w-6 text-orange-200 mr-2 flex-shrink-0" />
                    <span>Provides instant answers to academic questions</span>
                  </motion.li>
                  <motion.li className="flex items-start" whileHover={{ x: 5 }}>
                    <ChevronRight className="h-6 w-6 text-orange-200 mr-2 flex-shrink-0" />
                    <span>Offers personalized reading recommendations</span>
                  </motion.li>
                  <motion.li className="flex items-start" whileHover={{ x: 5 }}>
                    <ChevronRight className="h-6 w-6 text-orange-200 mr-2 flex-shrink-0" />
                    <span>Helps with time management and study planning</span>
                  </motion.li>
                </ul>
              </div>
            </SlideIn>

            <SlideIn direction="right">
              <div className="flex justify-center">
                <motion.div className="relative" whileHover={{ scale: 1.05 }}>
                  <motion.div
                    className="bg-white p-6 rounded-2xl shadow-2xl max-w-xs"
                    initial={{ rotate: -5 }}
                    animate={{ rotate: 5 }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 3,
                    }}
                  >
                    <div className="flex items-center mb-4">
                      <motion.div
                        className="bg-orange-100 p-2 rounded-full mr-3"
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                        }}
                      >
                        <BrainCircuit className="text-orange-600" />
                      </motion.div>
                      <h3 className="font-semibold text-gray-800">
                        Jiggasha AI
                      </h3>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <p className="text-gray-800 text-sm">
                        Hello! I see you are working on algebra today. Would you
                        like some practice problems recommended based on your
                        weak areas?
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        Yes, please!
                      </motion.button>
                      <motion.button
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        I'll see later
                      </motion.button>
                    </div>
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-6 -right-6 bg-orange-700 text-white px-4 py-2 rounded-lg shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="text-xs">New Achievement!</div>
                    <div className="font-bold">Fast Learner</div>
                  </motion.div>
                </motion.div>
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              For All <span className="text-orange-600">Students</span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <motion.div
              className="bg-orange-50 p-6 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-orange-600 font-bold text-xl">6-10</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">School Students</h3>
              <p className="text-gray-600">
                All major subjects for classes 6-10
              </p>
            </motion.div>

            <motion.div
              className="bg-orange-50 p-6 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-orange-600 font-bold text-xl">11-12</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">HSC Students</h3>
              <p className="text-gray-600">
                Complete preparation for board exams
              </p>
            </motion.div>

            <motion.div
              className="bg-orange-50 p-6 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaUniversity className="text-orange-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Admission Candidates
              </h3>
              <p className="text-gray-600">
                Preparation for university admission tests
              </p>
            </motion.div>

            <motion.div
              className="bg-orange-50 p-6 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaGraduationCap className="text-orange-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Undergraduate Students
              </h3>
              <p className="text-gray-600">
                Course materials for university students
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Student <span className="text-orange-600">Testimonials</span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <SlideIn direction="left">
              <motion.div
                className="bg-white p-6 rounded-xl shadow-md"
                whileHover={{ y: -10 }}
              >
                <div className="flex items-center mb-4">
                  <motion.div
                    className="rounded-full h-12 w-12 mr-3 overflow-hidden"
                    whileHover={{ scale: 1.1 }}
                  >
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="Student"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Rahim Khan</h4>
                    <p className="text-sm text-gray-500">Class 9 Student</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "I used to hate math, but Jiggasha’s battle mode has made it
                  so fun! Now I actually look forward to practicing."
                </p>
                <div className="flex mt-4 text-orange-400">
                  {[...Array(5)].map((_, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.2 }}>
                      <Star className="w-5 h-5 fill-current" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </SlideIn>

            {/* Testimonial 2 */}
            <FadeIn delay={0.2}>
              <motion.div
                className="bg-white p-6 rounded-xl shadow-md"
                whileHover={{ y: -10 }}
              >
                <div className="flex items-center mb-4">
                  <motion.div
                    className="rounded-full h-12 w-12 mr-3 overflow-hidden"
                    whileHover={{ scale: 1.1 }}
                  >
                    <img
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt="Student"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Tahmina Akter
                    </h4>
                    <p className="text-sm text-gray-500">
                      Medical Admission Candidate
                    </p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The AI assistant is amazing! It explains concepts in
                  different ways until I understand. My scores have improved a
                  lot."
                </p>
                <div className="flex mt-4 text-orange-400">
                  {[...Array(5)].map((_, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.2 }}>
                      <Star className="w-5 h-5 fill-current" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </FadeIn>

            {/* Testimonial 3 */}
            <SlideIn direction="right">
              <motion.div
                className="bg-white p-6 rounded-xl shadow-md"
                whileHover={{ y: -10 }}
              >
                <div className="flex items-center mb-4">
                  <motion.div
                    className="rounded-full h-12 w-12 mr-3 overflow-hidden"
                    whileHover={{ scale: 1.1 }}
                  >
                    <img
                      src="https://randomuser.me/api/portraits/men/67.jpg"
                      alt="Student"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Arif Hasan</h4>
                    <p className="text-sm text-gray-500">University Student</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "I love challenging my friends in peer-to-peer battles! We
                  learn more when we compete against each other!"
                </p>
                <div className="flex mt-4 text-orange-400">
                  {[...Array(5)].map((_, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.2 }}>
                      <Star className="w-5 h-5 fill-current" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section
        className="py-20 bg-gradient-to-r from-orange-600 to-orange-400 text-white text-center"
        id="signup"
      >
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Learning Experience?
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg mb-8">
              Join thousands of students who are making learning fun and
              competitive with Jiggasha
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.a
                href="#"
                className="bg-white text-orange-700 font-semibold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                Register for Free
              </motion.a>
              <motion.a
                href="#"
                className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg text-lg hover:bg-white hover:text-orange-700 transition"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                Watch Demo
              </motion.a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
