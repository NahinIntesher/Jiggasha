export default function Loading() {
  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-2xl animate-pulse"></div>

        <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-orange-200 p-12 flex flex-col items-center space-y-8">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-white rounded-full animate-spin border-t-orange-500 border-r-orange-400"></div>

            <div className="absolute inset-2 w-12 h-12 border-3 border-white rounded-full animate-spin animate-reverse border-t-orange-300 border-l-orange-200"></div>

            <div className="absolute inset-1/2 w-2 h-2 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
              Loading
            </h2>
            <div className="flex space-x-1 justify-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-orange-300 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <p className="text-orange-500 text-sm font-medium">
              Please wait while we prepare everything
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-64 h-1 bg-orange-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Floating elements for extra polish */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-300/20 rounded-full animate-ping"></div>
        <div
          className="absolute -bottom-4 -right-4 w-6 h-6 bg-orange-400/20 rounded-full animate-ping"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>
    </div>
  );
}
