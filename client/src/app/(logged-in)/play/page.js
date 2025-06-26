import Header from "@/components/ui/Header";
import { useUser } from "@/components/Contexts/UserProvider";
import Link from "next/link";

export default function Play() {
  let battleId = "battle-12345";
  let PairToPairbattleId = "pair-to-pair-battle-12345";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      <Header title="Learn Through Play" />

      {/* Hero Section */}
      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Choose Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600 block">
              Battle Mode
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Test your knowledge, compete with others, and learn while having
            fun. Select your preferred game mode to get started.
          </p>
        </div>

        {/* Game Mode Cards */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Battle Royale Card */}
          <Link href="/play/matchmaking/royale" className="group">
            <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

              <div className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                    />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-orange-600 transition-colors">
                  Battle Royale
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Compete against multiple players in an intense knowledge
                  showdown. Last player standing wins!
                </p>

                <div className="flex items-center text-orange-600 font-semibold group-hover:text-orange-700">
                  <span>Join Battle</span>
                  <svg
                    className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Pair to Pair Battle Card */}
          <Link href="/play/matchmaking/pair" className="group">
            <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

              <div className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-orange-500 transition-colors">
                  Pair Battle
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Face off against a single opponent in strategic one-on-one
                  battles. Test your skills head-to-head.
                </p>

                <div className="flex items-center text-orange-500 font-semibold group-hover:text-orange-600">
                  <span>Find Opponent</span>
                  <svg
                    className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Create Room Card */}
          <Link href="/create-room" className="group">
            <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500 to-gray-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

              <div className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-gray-600 transition-colors">
                  Create Room
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Set up a private room and invite friends for custom battles.
                  Create your own rules and challenges.
                </p>

                <div className="flex items-center text-gray-600 font-semibold group-hover:text-gray-700">
                  <span>Create Room</span>
                  <svg
                    className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="max-w-4xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">1,234</div>
            <div className="text-gray-600 font-medium">Active Players</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">567</div>
            <div className="text-gray-600 font-medium">Battles Today</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">89</div>
            <div className="text-gray-600 font-medium">Live Rooms</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">4.8</div>
            <div className="text-gray-600 font-medium">Avg Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
}
