'use client';
import { useUser } from "@/components/Contexts/UserProvider";
import Header from "@/components/ui/Header";
import { useEffect, useState } from "react";
import Link from "next/link";
import NotFoundPage from "@/components/ui/NotFound";

export default function Page() {
  const { user, loading, error } = useUser();
  const [tests, setTests] = useState([]);
  const [loadingTests, setLoadingTests] = useState(true);

  useEffect(() => {
    if (user?.user_class_level) {
      fetchModelTests(user.user_class_level);
    }
  }, [user]);

  const fetchModelTests = async (user_class_level) => {
    try {
      const response = await fetch(`http://localhost:8000/model-tests/class/${user_class_level}`, {
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
      setLoadingTests(false);
    }
  };

  if (loading || loadingTests) {
    return <p className="p-4">Loading...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">Error loading user data</p>;
  }

  return (
    <div>
      <Header title="Model Tests" />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">
          Welcome, {user?.username || "Student"}!
        </h2>

        {tests.length === 0 ? (
          <NotFoundPage />
        ) : (
          <div className="grid gap-4">
            {tests.map((test) => (
              <div
                key={test.model_test_id}
                className="border rounded-xl p-4 shadow-sm bg-white"
              >
                <h3 className="text-lg font-semibold">{test.subject}</h3>
                <p className="text-sm text-gray-600">
                  Type: {test.type} | Duration: {test.test_duration} mins | Marks: {test.total_mark}
                </p>
                <p className="text-sm text-gray-500">
                  Questions: {test.total_questions}
                </p>

                <Link
                  href={`/model-tests/${test.model_test_id}`}
                  className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Join
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
