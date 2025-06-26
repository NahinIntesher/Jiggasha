import React from "react";
import { FaComments, FaUsers, FaBook } from "react-icons/fa";
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-xl font-bold mb-4">Jiggasha</h3>
            <p className="mb-4">
              Making education exciting, dynamic, and competitive through
              game-based learning
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FaComments className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaUsers className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaBook className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white text-lg font-medium mb-4">Game Modes</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition">
                  Battle Royale
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Pair To Pair Battle
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Friendly Battle
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Leaderboard
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-lg font-medium mb-4">Educational</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition">
                  Course
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  AI Assistant
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Daily Quizzes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Knowledge Blogs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-lg font-medium mb-4">
              Organization
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Career
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>
            &copy; {new Date().getFullYear()} Jiggasha. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
