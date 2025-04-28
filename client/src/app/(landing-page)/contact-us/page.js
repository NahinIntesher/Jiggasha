import React from "react";
import { FaRunning, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactUs() {
  return (
    <div className=" py-16 px-6 md:px-20">
      {/* Top Heading Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Contact Us
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Any questions or remarks? Just write us a message!
        </p>
      </div>

      {/* Form Section */}
      <form className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
        <input
          type="email"
          placeholder="Enter a valid email address"
          className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
        />
        <input
          type="text"
          placeholder="Enter your Name"
          className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
        />
        <div className="col-span-1 md:col-span-2 flex justify-center">
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-12 rounded-full transition"
          >
            SUBMIT
          </button>
        </div>
      </form>

      {/* Bottom Info Section */}
      <div className=" py-12 ">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
          {/* Info 1 */}
          <div className="text-center border rounded-xl p-10 border-gray-300 shadow-md">
            <div className="flex justify-center mb-4">
              <FaRunning className="text-5xl text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">About Us</h3>
            <p className="text-gray-500">
              Learn more about Jiggasha's mission and vision.
            </p>
          </div>

          {/* Info 2 */}
          <div className="text-center border rounded-xl p-10 border-gray-300 shadow-md">
            <div className="flex justify-center mb-4">
              <FaPhone className="text-5xl text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Phone</h3>
            <p className="text-gray-500">
              +880 1234 567 890
              <br />
              +880 9876 543 210
            </p>
          </div>

          {/* Info 3 */}
          <div className="text-center border rounded-xl p-10 border-gray-300 shadow-md">
            <div className="flex justify-center mb-4">
              <FaMapMarkerAlt className="text-5xl text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Our Office</h3>
            <p className="text-gray-500">123 Main Street, Dhaka, Bangladesh</p>
          </div>
        </div>
      </div>
    </div>
  );
}
