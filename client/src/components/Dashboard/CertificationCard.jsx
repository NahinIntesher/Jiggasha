"use client";
import { useEffect, useState } from "react";
import {
  FaDownload,
  FaCertificate,
  FaGraduationCap,
  FaBook,
  FaStar,
  FaAward,
} from "react-icons/fa6";

export default function CertificationCard({ cert = sampleCert }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div
        className="group relative bg-white border-0 rounded-3xl p-8 shadow-2xl shadow-orange-500/10 hover:shadow-3xl hover:shadow-orange-500/20  overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-100/40 to-transparent rounded-full blur-3xl "></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-amber-100/30 to-transparent rounded-full blur-2xl"></div>

        {/* Premium badge */}
        <div className="absolute top-6 z-10  right-6 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
          <FaAward className="w-4 h-4" />
          <span>Verified</span>
        </div>

        <div className="relative flex flex-col lg:flex-row gap-8">
          {/* Certificate Image Section */}
          <div className="flex-shrink-0">
            <div className="relative group/image">
              <div
                className="w-48 h-48 mx-auto lg:mx-0 relative overflow-hidden rounded-3xl shadow-2xl 
              "
              >
                <img
                  src={cert.cover_image_url}
                  alt={cert.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                {/* Floating certificate icon */}
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full p-3 shadow-lg">
                  <FaCertificate className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Decorative elements around image */}
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-orange-400 rounded-full opacity-70 group-hover:scale-150 transition-transform duration-300"></div>
              <div className="absolute -top-1 left-4 w-3 h-3 bg-amber-400 rounded-full opacity-60 group-hover:scale-125 transition-transform duration-300 delay-100"></div>
            </div>
          </div>

          {/* Certificate Details Section */}
          <div className="flex-1 flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-orange-800 bg-clip-text text-transparent mb-3 leading-tight">
                  {cert.name}
                </h2>

                {/* Rating stars */}

              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-100/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                    <FaBook className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-700">
                      Subject
                    </span>
                    <p className="font-bold text-gray-900">{cert.subject}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-100/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                    <FaGraduationCap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-700">
                      Level
                    </span>
                    <p className="font-bold text-gray-900">
                      Class {cert.class_level}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Certification Authority Section */}
            <div className="lg:w-80">
              <div className="bg-gradient-to-br from-white/80 to-orange-50/80 backdrop-blur-sm rounded-3xl p-6 border border-orange-100/50 shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <FaCertificate className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Certified by
                      </p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                        Jiggasha
                      </p>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <a
                  href={`/certificates/download/${cert.course_id}`}
                  className={`group/btn relative overflow-hidden bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-bold shadow-xl`}
                  download
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 opacity-0 "></div>
                  <div className="relative flex items-center justify-center px-6 py-4 gap-3">
                    <FaDownload className="w-5 h-5 group-hover/btn:animate-bounce" />
                    <span className="text-lg">Download</span>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent "></div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
      </div>
    </div>
  );
}