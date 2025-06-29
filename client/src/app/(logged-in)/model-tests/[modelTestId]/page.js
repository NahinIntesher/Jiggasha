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
import Loading from "@/components/ui/Loading";

const Page = () => {
  const { modelTestId } = useParams();
  const router = useRouter();
  const [modelTest, setModelTest] = useState({});
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isTimeOver, setIsTimeOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
    } finally {
      setLoading(false);
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
    setSubmitting(true);
    try {
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

      router.push("/model-tests/");
    } catch (err) {
      console.error("Failed to submit test:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (s) => {
    const minutes = Math.floor(s / 60);
    const seconds = s % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const getTimeColor = () => {
    if (timeLeft <= 60) return "text-red-500";
    if (timeLeft <= 300) return "text-yellow-500";
    return "text-green-500";
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const getTotalQuestions = () => {
    return modelTest.questions?.length || 0;
  };

  const getProgressPercentage = () => {
    const total = getTotalQuestions();
    if (total === 0) return 0;
    return (getAnsweredCount() / total) * 100;
  };

  if (loading) {
    return <Loading message="Loading model test..." />;
  }

  return (
    <div className="min-h-screen bg-orange-50 px-4 sm:px-0">
      <HeaderAlt title={"Model Test for " + modelTest.subject} />

      <div className="max-w-6xl mx-auto p-6">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-300 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex flex-col items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <FaQuestionCircle className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-lg :text-lg font-bold text-gray-800 capitalize">
                    {modelTest.subject}
                  </h1>
                  <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl text-sm font-semibold mt-2 inline-block">
                    {modelTest.type}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 w-full justify-start sm:justify-end">
              <InfoCard
                icon={<FaClock />}
                label="Duration"
                value={`${modelTest.test_duration} min`}
                color="bg-orange-500"
              />
              <InfoCard
                icon={<FaStar />}
                label="Total Marks"
                value={modelTest.total_mark}
                color="bg-orange-500"
              />
              <InfoCard
                icon={<FaQuestionCircle />}
                label="Questions"
                value={modelTest.total_questions}
                color="bg-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Pre-Test State */}
        {!started && (
          <div className=" bg-white rounded-xl shadow-sm p-8 border border-gray-300 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <FaPlay className="text-white text-2xl ml-1" />
              </div>
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
                className="group relative px-8 py-4 bg-orange-500 text-white rounded-xl font-semibold text-lg shadow-sm  transform flex items-center gap-3 mx-auto"
              >
                <FaPlay />
                Start Test
              </button>
            </div>
          </div>
        )}

        {/* Test in Progress */}
        {started && (
          <div className="space-y-6">
            {/* Progress Bar and Timer */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className={`text-3xl font-bold ${getTimeColor()}`}>
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-gray-600">
                    <div className="text-sm">Progress</div>
                    <div className="font-semibold">
                      {getAnsweredCount()} / {getTotalQuestions()} answered
                    </div>
                  </div>
                </div>

                {isTimeOver && (
                  <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl border border-red-200">
                    <FaExclamationTriangle />
                    <span className="font-medium">
                      Time's up! Please submit.
                    </span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-xl h-3 mb-4">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-xl transition-all duration-500 ease-out"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>

              <div className="text-sm text-gray-600 text-center">
                {getProgressPercentage().toFixed(0)}% completed
              </div>
            </div>

            {/* Questions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-orange-50 to-gray-50 border-b border-gray-300">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaQuestionCircle className="text-orange-400" />
                  Questions
                </h2>
              </div>

              <div className="p-6 space-y-8">
                {modelTest.questions?.map((q, idx) => (
                  <div
                    key={q.question_id}
                    className="border-b border-gray-300 pb-6 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-medium text-gray-800 leading-relaxed">
                          {q.content}
                        </p>
                      </div>
                      {answers[q.question_id] && (
                        <div className="flex-shrink-0">
                          <FaCheckCircle className="text-orange-500 text-xl" />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-0 sm:ml-12">
                      {["a", "b", "c", "d"].map((opt) => (
                        <button
                          key={opt}
                          disabled={isTimeOver}
                          className={`group text-left px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                            answers[q.question_id] === opt
                              ? "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-400 shadow-md"
                              : "border-gray-300 hover:border-orange-300 hover:bg-gray-50"
                          } ${
                            isTimeOver
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                          onClick={() => handleAnswer(q.question_id, opt)}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center text-xs font-bold ${
                                answers[q.question_id] === opt
                                  ? "bg-orange-500 border-orange-500 text-white"
                                  : "border-gray-400 text-gray-500 group-hover:border-orange-400"
                              }`}
                            >
                              {opt.toUpperCase()}
                            </div>
                            <span className="text-gray-700">
                              {q[`option_${opt}`]}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-300 text-center">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full sm:w-auto group relative px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold text-base sm:text-lg shadow-sm transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="group-hover:translate-x-1 transition-transform duration-300" />
                    Submit Test
                  </>
                )}
              </button>

              <p className="text-gray-600 text-sm mt-4">
                Make sure to review your answers before submitting. You cannot
                change them after submission.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-300 min-w-[160px] flex-1 sm:flex-initial">
    <div className="flex items-center gap-3">
      <div
        className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shadow-sm`}
      >
        {React.cloneElement(icon, { className: "text-white text-xl" })}
      </div>
      <div>
        <div className="text-gray-600 text-sm font-medium">{label}</div>
        <div className="text-xl font-bold text-gray-800">{value}</div>
      </div>
    </div>
  </div>
);

export default Page;
