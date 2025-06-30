"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/ui/Header";
import CertificationCard from "@/components/Dashboard/CertificationCard";
import Loading from "@/components/ui/Loading";
import { FaCertificate, FaGraduationCap, FaTrophy } from "react-icons/fa6";

export default function page() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const res = await fetch("https://jiggasha.onrender.com/certifications", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await res.json();
        setCertifications(data.certifications || []);
      } catch (error) {
        console.error("Failed to fetch certifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertifications();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <Header title="Certifications" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {certifications.length === 0 ? (
          <div className="mt-8 sm:mt-12">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white border border-gray-300 rounded-xl p-8 sm:p-12 text-center shadow-lg">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-orange-100 rounded-full flex items-center justify-center">
                      <FaCertificate className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <FaTrophy className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  No Certifications Yet
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
                  Start your learning journey and earn professional
                  certifications from Jiggasha. Complete courses to showcase
                  your expertise and advance your career.
                </p>

                <div className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-xl font-medium">
                  <FaGraduationCap className="w-4 h-4 mr-2" />
                  Explore Courses
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 sm:mt-8">
            {/* Stats and Header Section */}
            <div className="bg-white border border-gray-300 rounded-xl p-4 sm:p-6 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaCertificate className="w-5 h-5 text-orange-500" />
                    Your Certifications
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Download and share your professional achievements
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-orange-500">
                      {certifications.length}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">
                      Certificate{certifications.length !== 1 ? "s" : ""}
                    </div>
                  </div>

                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center">
                    <FaTrophy className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications Grid */}
            <div className="space-y-4 sm:space-y-6">
              {certifications.map((cert, index) => (
                <div
                  key={cert.course_id}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeInUp 0.6s ease-out forwards",
                  }}
                >
                  <CertificationCard cert={cert} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}