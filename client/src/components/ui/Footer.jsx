import React from "react";
import { FaComments, FaUsers, FaBook } from "react-icons/fa";
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-xl font-semibold mb-4">জিজ্ঞাসা</h3>
            <p className="mb-4">
              গেম-ভিত্তিক শেখার মাধ্যমে শিক্ষাকে উত্তেজনাপূর্ণ, গতিশীল এবং
              প্রতিযোগিতামূলক করে তোলা
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
            <h4 className="text-white text-lg font-medium mb-4">গেম মোড</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition">
                  ব্যাটল রয়্যাল
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  পেয়ার টু পেয়ার
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  ফ্রেন্ডলি ব্যাটল
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  লিডারবোর্ড
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-lg font-medium mb-4">শিক্ষণ</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition">
                  কোর্স
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  এআই সহকারী
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  দৈনিক কুইজ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  জ্ঞান ব্লগ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-lg font-medium mb-4">কোম্পানি</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition">
                  আমাদের সম্পর্কে
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  যোগাযোগ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  ক্যারিয়ার
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  গোপনীয়তা নীতি
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>
            &copy; {new Date().getFullYear()} জিজ্ঞাসা। সর্বস্বত্ব সংরক্ষিত।
          </p>
        </div>
      </div>
    </footer>
  );
}
