import Header from "@/components/ui/Header";

export default function Quests() {
  return (
    <div className="">
      <Header title="Quests" />
      <div className="space-y-4 p-6">
        {/* Quest 1 */}
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6 flex flex-col gap-3 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-orange-700 text-lg">Play 5 Battle Royale Game</span>
            <span className="text-orange-600 font-bold">3/5</span>
          </div>
          <div className="w-full bg-orange-100 rounded-full h-3">
            <div className="bg-orange-500 h-3 rounded-full" style={{ width: "60%" }}></div>
          </div>
        </div>
        {/* Quest 2 */}
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6 flex flex-col gap-3 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-orange-700 text-lg">Watch 10 Lecture in Your Courses</span>
            <span className="text-orange-600 font-bold">7/10</span>
          </div>
          <div className="w-full bg-orange-100 rounded-full h-3">
            <div className="bg-orange-500 h-3 rounded-full" style={{ width: "70%" }}></div>
          </div>
        </div>
        {/* Quest 3 */}
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6 flex flex-col gap-3 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-orange-700 text-lg">Play 5 Pair To Pair Battle</span>
            <span className="text-orange-600 font-bold">1/5</span>
          </div>
          <div className="w-full bg-orange-100 rounded-full h-3">
            <div className="bg-orange-500 h-3 rounded-full" style={{ width: "20%" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
