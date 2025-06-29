'use client';
import { useUser } from "@/components/Contexts/UserProvider";
import Header from "@/components/ui/Header";
import { useEffect, useState } from "react";
import Link from "next/link";
import NotFoundPage from "@/components/ui/NotFound";

export default function Page() {
  const { user, loading, error } = useUser();
  const [tests, setTests] = useState([]);
  const [modelTests, setModelTests] = useState(true);

  useEffect(() => {
    if (user?.user_class_level) {
      fetchModelTests(user.user_class_level);
    }
  }, [user]);

  const fetchModelTests = async (user_class_level) => {
    try {
      const response = await fetch(`http://localhost:8000/model-tests/${user_class_level}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
      });

      const data = await response.json();
      if (data.status === "success") {
        setTests(data.data);
      } else {
        console.warn("API responded with error:", data);
      }
    } catch (err) {
      console.error("Failed to fetch model tests:", err);
    } finally {
      setModelTests(false);
    }
  };

  if (loading || modelTests) {
    return <p className="p-4">Loading...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">Error loading user data</p>;
  }

  return (
    <div className="min-h-screen">
      <Header title="Model Tests" />
      <div className="mx-auto p-8">

        {tests.length === 0 ? (
          <div className="mt-16">
            <NotFoundPage />
          </div>
        ) : (
          <ul className="space-y-4">
            {tests.map((test) => (
              <li
                key={test.model_test_id}
                className="border border-gray-300 rounded-xl p-6 shadow-md bg-white hover:shadow-lg transition-shadow duration-200 flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-xl font-semibold text-orange-500">{test.subject}</h3>
                    <span className="px-3 py-1 text-xs bg-orange-100 font-bold text-orange-600 rounded-md font-medium">
                      {test.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap text-sm text-gray-500 mt-2">
                    <span className="flex items-center">
                      {test.test_duration} mins
                    </span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="flex items-center ">
                      {test.total_questions} Questions
                    </span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="flex items-center ">
                      {test.total_mark} Marks
                    </span>
                  </div>
                </div>
                {test.is_attempted ? (
                  <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-center justifiy-center">
                    <div className="text-sm text-gray-500">Obtained Mark</div>
                    <div className="text-xl font-bold text-orange-400">{test.mark_obtained} / {test.total_mark}</div>
                  </div>
                ) : (
                  <Link
                    href={`/model-tests/${test.model_test_id}`}
                    className="mt-4 md:mt-0 md:ml-6 inline-block w-full md:w-auto text-center px-4 py-2 bg-orange-400 text-white text-md rounded-lg font-semibold hover:bg-orange-600 transition"
                  >
                    Join Test
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
