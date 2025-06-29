import React from "react";
import Link from "next/link";
import {
  FaClock,
  FaCheck,
  FaCircleQuestion,
  FaArrowRight,
  FaLock,
} from "react-icons/fa6";

const ModelTestCard = ({ test }) => {
  const isLocked = !test.isAttempted;

  return (
    <div className="border border-gray-300 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-800">{test.subject}</h3>
        <span className="bg-orange-100 text-orange-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {test.type}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <FaClock className="w-4 h-4 mr-2" />
          <span className="text-sm">{test.test_duration} mins</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FaCheck className="w-4 h-4 mr-2" />
          <span className="text-sm">Total marks: {test.total_mark}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FaCircleQuestion className="w-4 h-4 mr-2" />
          <span className="text-sm">{test.total_questions} questions</span>
        </div>
      </div>

      {test.is_attempted ? (
        <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-center justifiy-center">
          <div className="text-sm text-gray-500">Obtained Mark</div>
          <div className="text-xl font-bold text-orange-400">
            {test.mark_obtained} / {test.total_mark}
          </div>
        </div>
      ) : (
        <Link
          href={`/model-tests/${test.model_test_id}`}
          className="w-full inline-flex justify-center items-center px-5 py-2.5 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600"
        >
          Start Test
          <FaArrowRight className="w-4 h-4 ml-2" />
        </Link>
      )}
    </div>
  );
};

export default ModelTestCard;
