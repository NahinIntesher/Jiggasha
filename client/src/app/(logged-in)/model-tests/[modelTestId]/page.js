"use client";

import HeaderAlt from "@/components/ui/HeaderAlt";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaClock, FaStar, FaQuestionCircle } from "react-icons/fa";

const Page = () => {
  const { modelTestId } = useParams();
  const [modelTest, setModelTest] = useState({});

  useEffect(() => {
    fetchModelTest();
  }, []);

  const fetchModelTest = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/model-tests/single/${modelTestId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        console.log(data.data);
        setModelTest(data.data);
      } else {
        console.warn("API responded with error:", data);
      }
    } catch (err) {
      console.error("Failed to fetch model tests:", err);
    }
  };

  return (
    <div className="min-h-screen">
      <HeaderAlt title={"Model Test for " + modelTest.subject} />
      <div className="p-6">
        <div className="w-full bg-white rounded-xl shadow-lg p-8 border border-gray-300 flex justify-between items-start mb-4 flex-col sm:flex-row sm:items-center">
          {/* Left side: subject and type */}
          <div className="flex flex-col items-start gap-2">
            <div className="text-2xl font-bold text-orange-600 capitalize flex items-center gap-2">
              {modelTest.subject}
            </div>
            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-md text-sm font-semibold">
              {modelTest.type}
            </span>
          </div>
          {/* Right side: info cards */}
          <div className="flex flex-wrap gap-3">
            {/* Total Time */}
            <div className="flex items-center gap-4 p-2 min-w-[160px]">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100">
                <FaClock className="text-orange-500 text-2xl" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-gray-600 text-sm font-medium">
                  Total Time
                </span>
                <span className="text-2xl font-bold text-gray-800">
                  {modelTest.test_duration} min
                </span>
              </div>
            </div>
            {/* Total Marks */}
            <div className="flex items-center gap-4 p-2 min-w-[160px]">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100">
                <FaStar className="text-orange-500 text-2xl" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-gray-600 text-sm font-medium">
                  Total Marks
                </span>
                <span className="text-2xl font-bold text-gray-800">
                  {modelTest.total_mark}
                </span>
              </div>
            </div>
            {/* Total Questions */}
            <div className="flex items-center gap-4 p-2 min-w-[160px]">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100">
                <FaQuestionCircle className="text-orange-500 text-2xl" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-gray-600 text-sm font-medium">
                  Total Questions
                </span>
                <span className="text-2xl font-bold text-gray-800">
                  {modelTest.total_questions}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
