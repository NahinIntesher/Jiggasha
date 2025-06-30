"use client";
import { useUser } from "@/components/Contexts/UserProvider";
import { useEffect, useState } from "react";
import NotFoundPage from "@/components/ui/NotFound";
import ModelTestCard from "@/components/Model Test/ModelTestCard";
import Loading from "@/components/ui/Loading";
import { FaCircleCheck, FaPlus, FaLock, FaCircleInfo } from "react-icons/fa6";
import HeaderAlt from "@/components/ui/HeaderAlt";

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
      const response = await fetch(
        `https://jiggasha.onrender.com/model-tests/${user_class_level}`,
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
    return <Loading message="Loading model tests..." />;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Error loading user data.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <HeaderAlt title="Model Tests" />
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Tests Grid */}
        {tests.length === 0 ? (
          <div className="text-center py-16">
            <NotFoundPage />
          </div>
        ) : (
          <section>
            <div className="flex items-center justify-between mb-8 border border-orange-400 bg-orange-100 rounded-md py-3 px-4">
              <div className="flex items-center text-lg text-gray-600">
                <FaCircleInfo className="w-4 h-4 mr-2 text-orange-400" />
                <div className="text-sm font-medium text-orange-600 px-2">
                You can attempt each model test only once. After attempting, you
                can view your results.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {tests.map((test) => (
                <ModelTestCard key={test.model_test_id} test={test} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
