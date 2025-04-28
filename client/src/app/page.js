import React from "react";
import {
  FaGraduationCap,
  FaGamepad,
  FaRobot,
  FaUniversity,
  FaMoneyBillWave,
} from "react-icons/fa";

export default function Home() {
  return (
    <div className="">
      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-r from-orange-600 to-orange-300 h-screen flex items-center justify-center text-center px-6 bg-cover bg-center"
        // style={{
        //   backgroundImage: "url('/images/bgimage.png')",
        //   backgroundBlendMode: "overlay",
        // }}
      >
        {/* Optional darker overlay for better text readability */}
        <div className="absolute inset-0 "></div>

        <div className="max-w-4xl relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4">
            জিজ্ঞাসা
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-white mb-6">
            একাডেমিক থেকে এডমিশন
          </p>
          <p className="text-lg md:text-xl text-white mb-8">
            প্রতিটি নাও দেশ সেরা শিক্ষক ও অনুশীলন সাথে
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#features"
              className="bg-white text-orange-700 font-semibold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition"
            >
              আমাদের সম্পর্কে জানুন
            </a>
            <a
              href="#courses"
              className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg text-lg hover:bg-white hover:text-orange-700 transition"
            >
              কোর্সগুলো দেখুন
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-3xl font-bold text-orange-700">
                ৬ষ্ঠ শ্রেণী
              </h3>
              <p className="text-gray-600">বিজ্ঞান, গণিত</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-orange-700">৯ম শ্রেণী</h3>
              <p className="text-gray-600">বিজ্ঞান, কমার্স</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-orange-700">১০ম শ্রেণী</h3>
              <p className="text-gray-600">এসএসসি প্রস্তুতি</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-orange-700">
                ১১-১২ শ্রেণী
              </h3>
              <p className="text-gray-600">বিশ্ববিদ্যালয় ভর্তি</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Bengali/English text */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            মাধ্যমিক ও উচ্চমাধ্যমিকের পড়াশোনা এবং পরীক্ষার প্রস্তুতি পূর্ণাঙ্গ
            সমাধান
          </h2>
          <p className="text-gray-600">
            জিজ্ঞাসা আপনার একাডেমিক এবং ভর্তি পরীক্ষার সম্পূর্ণ সমাধান দেয়
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-blue-100 p-8 rounded-xl text-center hover:shadow-lg transition">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-500 p-4 rounded-full">
                  <FaGraduationCap className="text-3xl text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                স্কুল
              </h3>
              <p className="text-gray-700">
                কক্ষা ৬-১০ এর সমস্ত বিষয় আকর্ষণীয় পদ্ধতিতে শিখুন
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-orange-100 p-8 rounded-xl text-center hover:shadow-lg transition">
              <div className="flex justify-center mb-6">
                <div className="bg-orange-500 p-4 rounded-full">
                  <FaUniversity className="text-3xl text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                একাডেমিক
              </h3>
              <p className="text-gray-700">
                এইচএসসি এবং অন্যান্য শিক্ষা বোর্ড পরীক্ষার জন্য পূর্ণাঙ্গ
                প্রস্তুতি
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-pink-100 p-8 rounded-xl text-center hover:shadow-lg transition">
              <div className="flex justify-center mb-6">
                <div className="bg-pink-500 p-4 rounded-full">
                  <FaGamepad className="text-3xl text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                এডমিশন
              </h3>
              <p className="text-gray-700">
                বিশ্ববিদ্যালয় ভর্তি পরীক্ষার জন্য আকর্ষণীয় প্রশিক্ষণ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Demo Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Shikho এপটি ডাউনলোড করে নিন যে কারনে
              </h2>
              <p className="text-gray-300 mb-8">
                জেকোনো স্থান থেকে পড়াশোনা করতে পারেন এবং প্রতিটি মুহূর্ত
                অর্থপূর্ণ করুন
              </p>

              <div className="space-y-4">
                <div className="flex items-center bg-gray-800 p-4 rounded-lg">
                  <div className="bg-blue-500 p-2 rounded-full mr-4">
                    <FaRobot className="text-xl text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">AI-পাওয়ার্ড লার্নিং</h4>
                    <p className="text-sm text-gray-400">
                      আপনার শিখন পদ্ধতি অনুযায়ী পাঠ্যক্রম
                    </p>
                  </div>
                </div>

                <div className="flex items-center bg-gray-800 p-4 rounded-lg">
                  <div className="bg-blue-500 p-2 rounded-full mr-4">
                    <FaGamepad className="text-xl text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">ব্যাটল রয়্যাল মোড</h4>
                    <p className="text-sm text-gray-400">
                      প্রতিযোগীদের সাথে প্রতিদ্বন্দ্বিতা করুন
                    </p>
                  </div>
                </div>

                <div className="flex items-center bg-gray-800 p-4 rounded-lg">
                  <div className="bg-blue-500 p-2 rounded-full mr-4">
                    <FaMoneyBillWave className="text-xl text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">সাশ্রয়ী মূল্যে</h4>
                    <p className="text-sm text-gray-400">
                      সবার জন্য উন্নত শিক্ষা অ্যাক্সেসযোগ্য
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <img
                  src="/api/placeholder/280/560"
                  alt="Jiggasha Mobile App"
                  className="rounded-3xl shadow-2xl border-8 border-gray-800"
                />
                <div className="absolute top-1/4 left-full ml-4 bg-white p-4 rounded-lg shadow-lg w-48">
                  <div className="text-gray-800 font-medium">প্রিয় সুমন,</div>
                  <div className="text-sm text-gray-600">
                    আজকে আপনার গণিত পরীক্ষা আছে!
                  </div>
                </div>
                <div className="absolute top-2/3 -left-12 bg-orange-600 p-4 rounded-lg shadow-lg w-36 text-center">
                  <div className="text-white font-bold">৮৫% অর্জন!</div>
                  <div className="text-xs text-orange-200">আপনার স্কোর</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            সাধারণ এবং আন্তর্জাতিক উপাদানগুলি বিভিন্ন লেভেল কভার করে থাকে
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Course 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition">
              <div className="h-48 bg-orange-500 flex items-end justify-center p-4">
                <img
                  src="/api/placeholder/120/120"
                  alt="SSC Course"
                  className="mb-4"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg text-gray-800">
                  এসএসসি বিজ্ঞান
                </h3>
                <div className="flex items-center mt-2">
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                    বাংলা
                  </div>
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    দ্বি-মাসিক
                  </div>
                </div>
              </div>
            </div>

            {/* Course 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition">
              <div className="h-48 bg-green-500 flex items-end justify-center p-4">
                <img
                  src="/api/placeholder/120/120"
                  alt="HSC Course"
                  className="mb-4"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg text-gray-800">
                  এইচএসসি বিজ্ঞান
                </h3>
                <div className="flex items-center mt-2">
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                    ইংরেজি
                  </div>
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    ত্রৈ-মাসিক
                  </div>
                </div>
              </div>
            </div>

            {/* Course 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition">
              <div className="h-48 bg-blue-500 flex items-end justify-center p-4">
                <img
                  src="/api/placeholder/120/120"
                  alt="Medical Course"
                  className="mb-4"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg text-gray-800">
                  মেডিকেল ভর্তি পরীক্ষা
                </h3>
                <div className="flex items-center mt-2">
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                    বাংলা
                  </div>
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    ৬-মাসিক
                  </div>
                </div>
              </div>
            </div>

            {/* Course 4 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition">
              <div className="h-48 bg-orange-500 flex items-end justify-center p-4">
                <img
                  src="/api/placeholder/120/120"
                  alt="University Admission"
                  className="mb-4"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg text-gray-800">
                  বিশ্ববিদ্যালয় ভর্তি
                </h3>
                <div className="flex items-center mt-2">
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                    দ্বিভাষিক
                  </div>
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    বার্ষিক
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            জিজ্ঞাসার বৈশিষ্ট্য
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <FaGamepad className="text-orange-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                ব্যাটল রয়্যাল পরীক্ষা
              </h3>
              <p className="text-gray-600">
                অন্য শিক্ষার্থীদের সাথে প্রতিযোগিতা করুন এবং আকর্ষণীয় পুরস্কার
                জিতুন। পড়াশুনা কখনো এত মজার ছিল না!
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FaRobot className="text-green-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                AI-পাওয়ার্ড লার্নিং
              </h3>
              <p className="text-gray-600">
                আমাদের AI সিস্টেম আপনার শেখার ধরণ অনুযায়ী কন্টেন্ট কাস্টমাইজ
                করে। আপনার দুর্বলতা চিহ্নিত করে এবং তা উন্নত করতে সাহায্য করে।
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FaGraduationCap className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                পেয়ার-টু-পেয়ার পরীক্ষা
              </h3>
              <p className="text-gray-600">
                বন্ধুদের সাথে প্রতিযোগিতা করুন এবং একসাথে শিখুন। সহযোগিতামূলক
                শিক্ষা উন্নত ফলাফল দেয়।
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <FaMoneyBillWave className="text-red-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                সাশ্রয়ী মূল্য
              </h3>
              <p className="text-gray-600">
                প্রতিষ্ঠিত কোচিং সেন্টারের তুলনায় অনেক কম খরচে একই মানের
                শিক্ষা। সকলের জন্য উচ্চমানের শিক্ষা আমাদের লক্ষ্য।
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <FaUniversity className="text-yellow-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                ইউনিভার্সিটি কোর্স
              </h3>
              <p className="text-gray-600">
                বিশ্ববিদ্যালয় স্তরের বিষয়গুলি পড়ুন এবং আপনার আকাঙ্ক্ষিত
                প্রতিষ্ঠানে ভর্তি পরীক্ষার জন্য প্রস্তুত হোন।
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <FaUniversity className="text-indigo-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                প্রতিষ্ঠিত শিক্ষকমন্ডলী
              </h3>
              <p className="text-gray-600">
                বাংলাদেশের সেরা শিক্ষকদের কাছ থেকে শিখুন। উদ্ভাস, উত্তরণ,
                মেডিকো, রেটিনা এর সমতুল্য মানের শিক্ষক।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            আমাদের শিক্ষার্থীদের কথা
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <img
                  src="/api/placeholder/48/48"
                  alt="Student"
                  className="rounded-full mr-3"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">তানভীর আহমেদ</h4>
                  <p className="text-sm text-gray-500">এইচএসসি শিক্ষার্থী</p>
                </div>
              </div>
              <p className="text-gray-600">
                "জিজ্ঞাসা আমার পড়াশুনাকে আনন্দদায়ক করে তুলেছে। ব্যাটল মোড
                সত্যিই আসক্তিকর!"
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <img
                  src="/api/placeholder/48/48"
                  alt="Student"
                  className="rounded-full mr-3"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">সাবরিনা খাতুন</h4>
                  <p className="text-sm text-gray-500">
                    বিশ্ববিদ্যালয় ভর্তি প্রার্থী
                  </p>
                </div>
              </div>
              <p className="text-gray-600">
                "খেলতে খেলতে শেখা? সেরা সিদ্ধান্ত। সাশ্রয়ী মূল্যে ভাল মানের
                কন্টেন্ট পাওয়া যায়।"
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <img
                  src="/api/placeholder/48/48"
                  alt="Student"
                  className="rounded-full mr-3"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">রাকিব হাসান</h4>
                  <p className="text-sm text-gray-500">
                    মেডিকেল ভর্তি প্রার্থী
                  </p>
                </div>
              </div>
              <p className="text-gray-600">
                "প্রতিদিন আমাকে উৎসাহিত করে এমন একটি কমিউনিটির অংশ হওয়া সবকিছু
                পরিবর্তন করেছে।"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-300 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">
            আজই আপনার শিক্ষা যাত্রা শুরু করুন
          </h2>
          <p className="text-lg mb-8">
            জ্ঞান এবং প্রতিযোগিতার একটি বিশ্ব আবিষ্কার করুন। আপনি নতুন
            শিক্ষার্থী হোন বা অভিজ্ঞ - জিজ্ঞাসার আপনার জন্য কিছু আছে।
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#"
              className="bg-white text-orange-700 font-semibold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition"
            >
              এখনই যোগ দিন
            </a>
            <a
              href="#"
              className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg text-lg hover:bg-white hover:text-orange-700 transition"
            >
              আরও জানুন
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-xl font-semibold mb-4">
                জিজ্ঞাসা
              </h3>
              <p className="mb-4">
                বাংলাদেশের সেরা শিক্ষার্থীদের জন্য সর্বোত্তম এডটেক প্ল্যাটফর্ম
              </p>
            </div>

            <div>
              <h4 className="text-white text-lg font-medium mb-4">কোর্স</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition">
                    ৬ষ্ঠ-১০ম শ্রেণী
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    এইচএসসি
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    মেডিকেল
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    বিশ্ববিদ্যালয় ভর্তি
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
                    কেরিয়ার
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    ব্লগ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-lg font-medium mb-4">যোগাযোগ</h4>
              <ul className="space-y-2">
                <li>info@jiggasha.com</li>
                <li>+880 1XXX-XXXXXX</li>
                <li>ঢাকা, বাংলাদেশ</li>
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
    </div>
  );
}
