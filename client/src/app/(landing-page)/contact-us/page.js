"use client";
import React, { useState } from "react";
import {
  FaRunning,
  FaPhone,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPaperPlane,
  FaStar,
  FaHeart,
} from "react-icons/fa";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: Integrate with API or email service
  };

  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-white to-amber-50 py-20 px-6 md:px-24 text-gray-800 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-orange-200/20 to-amber-200/20 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-red-200/15 to-orange-200/15 rounded-full blur-3xl translate-x-48 translate-y-48"></div>

      {/* Heading */}
      <div className="relative text-center mb-20">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-6 py-3 rounded-full text-sm font-semibold mb-6 border border-orange-200">
          <FaHeart className="text-xs animate-pulse" />
          আমাদের সাথে যোগাযোগ করুন
        </div>
        <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-800 via-orange-600 to-red-600 bg-clip-text text-transparent mb-6 leading-tight">
          যোগাযোগ করুন
        </h2>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          কোনো প্রশ্ন বা মতামত আছে? আমরা আপনার কাছ থেকে শুনতে পেরে{" "}
          <span className="text-orange-600 font-semibold">আনন্দিত</span> হবো।
        </p>
      </div>

      {/* Contact Form */}
      <div className="relative max-w-4xl mx-auto mb-24">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-orange-100">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Email */}
            <div className="flex flex-col group">
              <label
                htmlFor="email"
                className="mb-3 text-sm font-bold text-gray-700 flex items-center gap-2"
              >
                <FaEnvelope className="text-orange-500" />
                ইমেইল ঠিকানা
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className="p-4 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-300 bg-white/70 group-hover:border-orange-300"
                required
              />
            </div>

            {/* Name */}
            <div className="flex flex-col group">
              <label
                htmlFor="name"
                className="mb-3 text-sm font-bold text-gray-700 flex items-center gap-2"
              >
                <FaStar className="text-orange-500" />
                পূর্ণ নাম
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="আপনার পূর্ণ নাম"
                value={formData.name}
                onChange={handleChange}
                className="p-4 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-300 bg-white/70 group-hover:border-orange-300"
                required
              />
            </div>

            {/* Message */}
            <div className="md:col-span-2 flex flex-col group">
              <label
                htmlFor="message"
                className="mb-3 text-sm font-bold text-gray-700 flex items-center gap-2"
              >
                <FaPaperPlane className="text-orange-500" />
                বার্তা
              </label>
              <textarea
                id="message"
                name="message"
                rows="6"
                placeholder="আপনার বার্তা লিখুন..."
                value={formData.message}
                onChange={handleChange}
                className="p-4 border-2 border-orange-200 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-300 bg-white/70 group-hover:border-orange-300"
                required
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2 flex justify-center">
              <button
                type="submit"
                className="group relative bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-12 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-3"
              >
                বার্তা পাঠান
                <FaPaperPlane className="group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {/* About */}
        <ContactCard
          icon={<FaRunning />}
          title="জিজ্ঞাসা সম্পর্কে"
          desc="আমাদের লক্ষ্য, দৃষ্টিভঙ্গি এবং কীভাবে আমরা শিক্ষাকে রূপান্তরিত করছি সে বিষয়ে আরও জানুন।"
          gradient="from-orange-400 to-red-500"
        />
        {/* Phone */}
        <ContactCard
          icon={<FaPhone />}
          title="ফোন নম্বর"
          desc="+৮৮০ ১২৩৪ ৫৬৭ ৮৯০\n+৮৮০ ৯৮৭৬ ৫৪৩ ২১০"
          gradient="from-orange-500 to-amber-600"
        />
        {/* Address */}
        <ContactCard
          icon={<FaMapMarkerAlt />}
          title="অফিসের ঠিকানা"
          desc="১২ৃ মেইন স্ট্রিট, ঢাকা, বাংলাদেশ"
          gradient="from-amber-500 to-orange-600"
        />
      </div>

      {/* Bottom Banner */}
      <div className="relative text-center mt-20">
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 rounded-3xl p-12 max-w-4xl mx-auto text-white shadow-2xl">
          <h3 className="text-3xl font-bold mb-4">আমাদের সাথে থাকুন</h3>
          <p className="text-orange-100 text-lg leading-relaxed">
            আমরা সর্বদা আপনার পাশে আছি। যেকোনো সময় যোগাযোগ করুন এবং আমাদের দলের
            সাথে কথা বলুন।
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-16 h-16 bg-gradient-to-r from-orange-300/20 to-amber-300/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-1/4 right-10 w-20 h-20 bg-gradient-to-r from-red-300/20 to-orange-300/20 rounded-full blur-xl"></div>
    </section>
  );
}

function ContactCard({ icon, title, desc, gradient }) {
  return (
    <div className="group text-center bg-white/80 backdrop-blur-sm rounded-3xl p-10 border border-orange-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      <div className="relative mb-6">
        <div
          className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} p-0.5 mx-auto`}
        >
          <div className="w-full h-full bg-white text-orange-500 rounded-2xl flex items-center justify-center">
            <div className="text-3xl">{icon}</div>
          </div>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-orange-600 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
        {desc}
      </p>
    </div>
  );
}
