"use client";
import { subjectName } from "@/utils/Constant";
import { useEffect, useState, useRef } from "react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
    FaDownload,
    FaCertificate,
    FaGraduationCap,
    FaBook,
    FaStar,
    FaAward,
} from "react-icons/fa6";
import { useUser } from "../Contexts/UserProvider";

export default function CertificationCard({ cert = sampleCert }) {
    const { user } = useUser()

    const [isHovered, setIsHovered] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const certificateRef = useRef();

    const generateCertificatePDF = async () => {
  setIsGenerating(true);
  
  try {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Clean white background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, 297, 210, 'F');

    // Elegant borders
    pdf.setDrawColor(218, 165, 32); // Gold tone
    pdf.setLineWidth(2);
    pdf.rect(10, 10, 277, 190); // Outer
    pdf.setDrawColor(180, 150, 90);
    pdf.setLineWidth(0.5);
    pdf.rect(15, 15, 267, 180); // Inner

    // Title
    pdf.setFont('times', 'bold');
    pdf.setFontSize(30);
    pdf.setTextColor(50, 50, 50);
    pdf.text('Certificate of Completion', 148.5, 45, { align: 'center' });

    // Subtitle
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(100, 100, 100);
    pdf.text('This is to proudly certify that', 148.5, 65, { align: 'center' });

    // Student name
    pdf.setFontSize(26);
    pdf.setFont('times', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(user ? user.full_name.toUpperCase() : 'STUDENT NAME', 148.5, 85, { align: 'center' });

    // Course achievement line
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(90, 90, 90);
    pdf.text('has successfully completed the course', 148.5, 100, { align: 'center' });

    // Course name
    pdf.setFontSize(20);
    pdf.setFont('times', 'bolditalic');
    pdf.setTextColor(40, 70, 150);
    pdf.text(`"${cert.name}"`, 148.5, 115, { align: 'center' });

    // Subject and Level
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(90, 90, 90);
    pdf.text(`Subject: ${subjectName[cert.subject]} | Level: Class ${cert.class_level}`, 148.5, 130, { align: 'center' });

    // Date
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    pdf.setFontSize(12);
    pdf.setTextColor(90, 90, 90);
    pdf.text(`Date of Completion: ${date}`, 148.5, 145, { align: 'center' });

    // Signature area
    pdf.setDrawColor(0, 0, 0);
    pdf.line(200, 170, 270, 170); // Line
    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    pdf.text('Authorized Signature', 235, 175, { align: 'center' });

    // Curved-style "Nahin" signature
    pdf.setFontSize(18);
    pdf.setTextColor(0, 102, 204); // Blue ink look
    pdf.setFont('times', 'italic');
    pdf.text('Nahin', 235, 165, { align: 'center' });

    // Branding
    pdf.setFontSize(14);
    pdf.setFont('times', 'bold');
    pdf.setTextColor(218, 165, 32);
    pdf.text('Jiggasha Education Platform', 25, 185);


    // Save
    const fileName = `${cert.name.replace(/[^a-zA-Z0-9]/g, '_')}_Certificate.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating certificate:', error);
    alert('Failed to generate certificate. Please try again.');
  } finally {
    setIsGenerating(false);
  }
};



    const handleDownloadClick = (e) => {
        e.preventDefault();
        generateCertificatePDF();
    };

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
                                        <p className="font-bold text-gray-900">{subjectName[cert.subject]}</p>
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
                                <button
                                    onClick={handleDownloadClick}
                                    disabled={isGenerating}
                                    className={`group/btn relative overflow-hidden bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-bold shadow-xl transition-all duration-300 ${isGenerating
                                            ? 'opacity-75 cursor-not-allowed'
                                            : 'hover:shadow-2xl hover:scale-105 active:scale-95'
                                        }`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative flex items-center justify-center px-6 py-4 gap-3">
                                        {isGenerating ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span className="text-lg">Generating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaDownload className="w-5 h-5 group-hover/btn:animate-bounce" />
                                                <span className="text-lg">Download</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover/btn:via-white/50 transition-all duration-300"></div>
                                </button>
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