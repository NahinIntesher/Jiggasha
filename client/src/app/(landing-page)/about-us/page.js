"use client";
import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaBullseye,
  FaLightbulb,
  FaArrowRight,
} from "react-icons/fa";

export default function AboutUs() {
  const [lang, setLang] = useState("bn");

  useEffect(() => {
    const storedLang = localStorage.getItem("lang");
    setLang(storedLang === "en" ? "en" : "bn");
  }, []);

  const t = {
    bn: {
      tag: "শিক্ষার ভবিষ্যৎ গড়ছি",
      title: "জিজ্ঞাসা সম্পর্কে",
      subtitle: "উদ্ভাবন, প্রযুক্তি এবং শেখার প্রতি ভালোবাসার মাধ্যমে শিক্ষার রূপান্তর",
      storyTitle: "আমাদের গল্প",
      storyHeading: "শিক্ষা ও প্রতিযোগিতার নতুন ধারা",
      story1: "জিজ্ঞাসা একটি সহজ কিন্তু শক্তিশালী লক্ষ্য থেকে জন্ম নিয়েছে: শিক্ষা যেন প্রতিটি শিক্ষার্থীর জন্য উত্তেজনাপূর্ণ, সহজলভ্য ও শক্তি-দায়ক হয়। আমরা দেখেছি যে প্রচলিত শিক্ষা পদ্ধতি আজকের ডিজিটাল প্রজন্মের জন্য যথেষ্ট আকর্ষণীয় নয়।",
      story2: "আমাদের উদ্ভাবনী প্ল্যাটফর্মে রয়েছে গেমিফিকেশনসহ ব্যাটল রয়্যাল প্রতিযোগিতা, যেখানে শেখার অভিজ্ঞতা হয়ে ওঠে মজাদার ও চ্যালেঞ্জিং। AI-ভিত্তিক ফিডব্যাক ও পার্সোনালাইজড ট্র্যাকিংয়ের মাধ্যমে আমরা শিক্ষায় নতুন মানদণ্ড স্থাপন করছি।",
      learnMore: "আমাদের যাত্রা সম্পর্কে জানুন",
      cardInnovation: "প্রথমে উদ্ভাবন",
      cardInnovationText: "পরবর্তী প্রজন্মের শিক্ষার অভিজ্ঞতা গড়ে তোলা",
      foundation: "আমাদের ভিত্তি",
      foundationTitle: "আমাদের চালিকা শক্তি",
      foundationText: "আমাদের মূলনীতি প্রতিটি সিদ্ধান্ত ও বৈশিষ্ট্যের ভিত্তি",
      teamTitle: "আমাদের দল",
      teamText: "উদ্ভাবনী চিন্তাবিদ, অভিজ্ঞ শিক্ষক ও ডেভেলপারদের দল যাঁরা শিক্ষার রূপান্তরে একত্রিত।",
      teamLink: "দলকে জানুন",
      missionTitle: "আমাদের লক্ষ্য",
      missionText: "প্রযুক্তিনির্ভর, পার্সোনালাইজড ও আনন্দদায়ক শেখার মাধ্যমে শিক্ষার্থীদের সামর্থ্য বিকাশে সহায়তা।",
      missionLink: "শিক্ষার্থীকে ক্ষমতায়ন",
      visionTitle: "আমাদের স্বপ্ন",
      visionText: "শেখা হবে মজাদার, প্রতিযোগিতামূলক ও সবার জন্য উন্মুক্ত—যেখানে প্রতিটি শিক্ষার্থী নিজের সম্ভাবনা আবিষ্কার করতে পারবে।",
      visionLink: "ভবিষ্যতের শিক্ষা",
      ctaTitle: "আপনার শেখার যাত্রা শুরু করুন",
      ctaText: "হাজারো শিক্ষার্থীর সাথে আমরাও চাই, ভবিষ্যতের শিক্ষাকে আপনার কাছে পৌঁছে দিতে",
      ctaButton: "আজই শুরু করুন",
    },
    en: {
      tag: "Building the future of education",
      title: "About Jiggasha",
      subtitle: "Transforming education through innovation, technology, and passion for learning",
      storyTitle: "Our Story",
      storyHeading: "Reimagining How Students Learn & Compete",
      story1: "Jiggasha was born from a simple yet powerful vision: to make education exciting, accessible, and empowering for every learner. We recognized that traditional learning methods weren't engaging enough for today's digital-native students.",
      story2: "Our innovative platform combines cutting-edge technology with gamification, creating battle royale competitions that make learning addictive. With AI-driven feedback and personalized progress tracking, we're setting new standards in educational excellence.",
      learnMore: "Learn more about our journey",
      cardInnovation: "Innovation First",
      cardInnovationText: "Pioneering the next generation of educational experiences",
      foundation: "Our Foundation",
      foundationTitle: "What Drives Us Forward",
      foundationText: "Our core values shape every decision we make and every feature we build",
      teamTitle: "Our Team",
      teamText: "A diverse collective of passionate developers, experienced educators, and innovative thinkers united by our shared vision of transforming education.",
      teamLink: "Meet the Innovators",
      missionTitle: "Our Mission",
      missionText: "To inspire and empower every learner to achieve their fullest potential through cutting-edge technology, personalized experiences, and engaging competitions.",
      missionLink: "Empowering Learners",
      visionTitle: "Our Vision",
      visionText: "A world where learning is engaging, competitive, and universally accessible—where every student can discover their potential through innovative education.",
      visionLink: "Future of Learning",
      ctaTitle: "Ready to Transform Your Learning Journey?",
      ctaText: "Join thousands of students who are already experiencing the future of education with Jiggasha",
      ctaButton: "Get Started Today",
    },
  }[lang];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Hero */}
      <div className="relative py-24 px-6 md:px-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-30 -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-200 rounded-full blur-3xl opacity-30 translate-y-32 -translate-x-32"></div>

        <div className="relative text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 text-sm text-gray-600 mb-8 shadow-sm">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
            {t.tag}
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-900 via-orange-700 to-yellow-600 bg-clip-text text-transparent mb-6 leading-tight">
            {t.title}
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20 px-6 md:px-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center text-orange-600 font-semibold text-sm uppercase tracking-wider">
              <span className="w-8 h-px bg-orange-600 mr-3"></span>
              {t.storyTitle}
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              {t.storyHeading}
            </h2>

            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>{t.story1}</p>
              <p>{t.story2}</p>
            </div>

            <div className="flex items-center text-orange-600 font-semibold group cursor-pointer">
              <span className="group-hover:underline">{t.learnMore}</span>
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-orange-400 via-yellow-400 to-pink-400 rounded-3xl p-1 shadow-2xl">
              <div className="w-full h-full bg-white rounded-3xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <FaLightbulb className="text-3xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{t.cardInnovation}</h3>
                  <p className="text-gray-600 px-8">{t.cardInnovationText}</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-2xl rotate-12 shadow-lg flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-orange-300 rounded-xl -rotate-12 shadow-lg flex items-center justify-center">
              <span className="text-xl">⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 px-6 md:px-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <div className="inline-flex items-center text-orange-600 font-semibold text-sm uppercase tracking-wider mb-4">
            <span className="w-8 h-px bg-orange-600 mr-3"></span>
            {t.foundation}
            <span className="w-8 h-px bg-orange-600 ml-3"></span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t.foundationTitle}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t.foundationText}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Team */}
          <Card
            icon={<FaUsers className="text-2xl text-white" />}
            bg="from-orange-500 to-orange-600"
            title={t.teamTitle}
            text={t.teamText}
            footer={t.teamLink}
            color="text-orange-600"
          />
          {/* Mission */}
          <Card
            icon={<FaBullseye className="text-2xl text-white" />}
            bg="from-pink-500 to-red-600"
            title={t.missionTitle}
            text={t.missionText}
            footer={t.missionLink}
            color="text-red-600"
          />
          {/* Vision */}
          <Card
            icon={<FaLightbulb className="text-2xl text-white" />}
            bg="from-yellow-500 to-orange-600"
            title={t.visionTitle}
            text={t.visionText}
            footer={t.visionLink}
            color="text-yellow-600"
          />
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 px-6 md:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-orange-500 via-yellow-500 to-red-500 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t.ctaTitle}</h2>
              <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">{t.ctaText}</p>
              <button className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-colors shadow-lg group">
                <span>{t.ctaButton}</span>
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ icon, bg, title, text, footer, color }) {
  return (
    <div className="group relative">
      <div className={`absolute inset-0 bg-gradient-to-br ${bg} rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity`}></div>
      <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1">
        <div className={`w-16 h-16 bg-gradient-to-br ${bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 leading-relaxed mb-6">{text}</p>
        <div className={`${color} font-semibold text-sm uppercase tracking-wide`}>
          {footer}
        </div>
      </div>
    </div>
  );
}
