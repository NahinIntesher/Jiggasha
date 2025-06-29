"use client";

import HeaderAlt from "@/components/ui/HeaderAlt";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FaClock,
  FaStar,
  FaPlay,
  FaPaperPlane,
  FaExclamationTriangle,
} from "react-icons/fa6";
import { FaCheckCircle, FaQuestionCircle } from "react-icons/fa";

const Page = () => {
  const { modelTestId } = useParams();
  const router = useRouter();
  const [modelTest, setModelTest] = useState({});
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isTimeOver, setIsTimeOver] = useState(false);

  useEffect(() => {
    fetchModelTest();
  }, []);

  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsTimeOver(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft]);

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
        setModelTest(data.data);
      } else {
        console.warn("API responded with error:", data);
      }
    } catch (err) {
      console.error("Failed to fetch model test:", err);
    }
  };

  const handleStart = () => {
    setStarted(true);
    setTimeLeft(modelTest.test_duration * 60);
  };

  const handleAnswer = (qid, option) => {
    if (isTimeOver) return;
    setAnswers((prev) => ({ ...prev, [qid]: option }));
  };

  const handleSubmit = async () => {
    const correct = modelTest.questions.filter(
      (q) => answers[q.question_id] === q.correct_option
    ).length;

    const userTakenTime = modelTest.test_duration * 60 - timeLeft;

    await fetch("http://localhost:8000/model-tests/model-test-attempt/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        model_test_id: modelTestId,
        mark_obtained: correct,
        attempted_at: new Date().toISOString(),
        user_taken_time: userTakenTime,
      }),
    });

    router.replace("/model-tests/");
  };

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  const getAnsweredCount = () => Object.keys(answers).length;
  const getTotalQuestions = () => modelTest.questions?.length || 0;
  const getProgressPercentage = () =>
    (getAnsweredCount() / getTotalQuestions()) * 100;

  const getTimeWarningStyle = () => {
    const totalTime = modelTest.test_duration * 60;
    const percentage = (timeLeft / totalTime) * 100;

    if (percentage <= 10) return "text-red-600 animate-pulse";
    if (percentage <= 25) return "text-orange-600";
    return "text-orange-500";
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <HeaderAlt title={"Model Test for " + modelTest.subject} />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Test Overview Card */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-300">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center ">
            {/* Left Section - Test Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-gray-800 capitalize">
                  {modelTest.subject}
                </h1>
                <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  {modelTest.type}
                </span>
              </div>
            </div>

            {/* Right Section - Stats */}
            <div className="flex flex-wrap gap-4">
              <InfoCard
                icon={<FaClock />}
                label="Duration"
                value={`${modelTest.test_duration} min`}
                color="blue"
              />
              <InfoCard
                icon={<FaStar />}
                label="Total Marks"
                value={modelTest.total_mark}
                color="yellow"
              />
              <InfoCard
                icon={<FaQuestionCircle />}
                label="Questions"
                value={modelTest.total_questions}
                color="green"
              />
            </div>
          </div>
        </div>

        {/* Timer Card - Only show when test started - Sticky */}
        {started && (
          <div className="sticky top-18 z-10 bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaClock className={`text-2xl ${getTimeWarningStyle()}`} />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Time Remaining
                  </p>
                  <p className={`text-3xl font-bold ${getTimeWarningStyle()}`}>
                    {formatTime(timeLeft)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Progress Bar */}
                <div className="bg-gray-50 rounded-xl p-3 min-w-[200px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Progress
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {getAnsweredCount()}/{getTotalQuestions()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage()}%` }}
                    />
                  </div>
                </div>

                {isTimeOver && (
                  <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg border border-red-200">
                    <FaExclamationTriangle />
                    <span className="font-semibold">Time's Up!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Start Button */}
        {!started && (
          <div className="text-center">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-300 text-center">
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Ready to Start?
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  You have{" "}
                  <span className="font-semibold text-orange-400">
                    {modelTest.test_duration} minutes
                  </span>{" "}
                  to complete
                  <span className="font-semibold text-orange-400">
                    {" "}
                    {modelTest.total_questions} questions
                  </span>
                  . Make sure you have a stable internet connection and won't be
                  disturbed.
                </p>
                <button
                  onClick={handleStart}
                  className="group relative px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-lg shadow-sm transform flex items-center gap-3 mx-auto"
                >
                  <FaPlay />
                  Start Test
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Questions Section */}
        {started && (
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-300">
            <div className="space-y-8">
              {modelTest.questions?.map((q, idx) => (
                <QuestionCard
                  key={q.question_id}
                  question={q}
                  index={idx}
                  selectedAnswer={answers[q.question_id]}
                  onAnswer={handleAnswer}
                  isDisabled={isTimeOver}
                />
              ))}
            </div>

            {/* Submit Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <FaCheckCircle className="text-orange-500" />
                  <span>
                    {getAnsweredCount()} of {getTotalQuestions()} questions
                    answered
                  </span>
                </div>

                <button
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-semibold shadow-sm  transform"
                >
                  <FaPaperPlane /> Submit Test
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    blue: "bg-orange-50 text-orange-600 border-orange-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    green: "bg-green-50 text-green-600 border-green-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
  };

  return (
    <div className="flex items-center gap-4 p-4 min-w-[160px] bg-white rounded-xl border border-gray-300 shadow-sm">
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-full ${colorClasses[color]} border`}
      >
        {React.cloneElement(icon, { className: "text-xl" })}
      </div>
      <div className="flex flex-col">
        <span className="text-gray-500 text-sm font-medium">{label}</span>
        <span className="text-2xl font-bold text-gray-800">{value}</span>
      </div>
    </div>
  );
};

const QuestionCard = ({
  question,
  index,
  selectedAnswer,
  onAnswer,
  isDisabled,
}) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
          {index + 1}
        </div>
        <p className="text-lg font-semibold text-gray-800 leading-relaxed">
          {question.content}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-12">
        {["a", "b", "c", "d"].map((opt) => (
          <button
            key={opt}
            disabled={isDisabled}
            className={`text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 ${
              selectedAnswer === opt
                ? "bg-orange-50 border-orange-500 text-orange-800 shadow-md"
                : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            } ${
              isDisabled
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:shadow-sm"
            }`}
            onClick={() => onAnswer(question.question_id, opt)}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                  selectedAnswer === opt
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                {opt.toUpperCase()}
              </span>
              <span className="font-medium">{question[`option_${opt}`]}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Page;
