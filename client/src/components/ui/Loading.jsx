import { FaSpinner } from "react-icons/fa6";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      {/* Animated Icon Container */}
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <FaSpinner className="w-12 h-12 text-white animate-spin" />
        </div>

        {/* Floating loading elements */}
        <div className="absolute -top-2 -right-2 animate-bounce delay-100">
          <div className="w-6 h-6 bg-orange-400 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute -bottom-1 -left-2 animate-bounce delay-300">
          <div className="w-5 h-5 bg-orange-300 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute top-1 -left-3 animate-bounce delay-500">
          <div className="w-4 h-4 bg-orange-200 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Main Message */}
      <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
        Loading
      </h3>

      {/* Subtitle */}
      <p className="text-gray-500 text-lg mb-6 max-w-md leading-relaxed">
        Please wait while we prepare everything for you.
      </p>

      {/* Decorative Element */}
      <div className="flex space-x-2 opacity-30">
        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-100"></div>
        <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce delay-200"></div>
      </div>
    </div>
  );
}
