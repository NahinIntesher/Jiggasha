import {
  FaQuestion,
  FaUsers,
  FaBlog,
  FaGraduationCap,
  FaTrophy,
  FaComment,
  FaFile,
} from "react-icons/fa6";

const CONTENT_CONFIGS = {
  community: {
    mainIcon: FaUsers,
    floatingIcons: [FaUsers, FaUsers, FaUsers],
    defaultTitle: "No Communities Found",
    defaultSubtitle:
      "There are no communities to display at the moment. Check back later or create your own!",
  },
  blog: {
    mainIcon: FaBlog,
    floatingIcons: [FaBlog, FaBlog, FaBlog],
    defaultTitle: "No Blog Posts Found",
    defaultSubtitle:
      "No blog posts are available right now. Stay tuned for fresh content!",
  },
  course: {
    mainIcon: FaGraduationCap,
    floatingIcons: [FaGraduationCap, FaGraduationCap, FaGraduationCap],
    defaultTitle: "No Courses Found",
    defaultSubtitle:
      "No courses are available at the moment. New learning opportunities coming soon!",
  },
  quest: {
    mainIcon: FaTrophy,
    floatingIcons: [FaTrophy, FaTrophy, FaTrophy],
    defaultTitle: "No Quests Found",
    defaultSubtitle:
      "No quests are available right now. Complete other activities to unlock new challenges!",
  },
  post: {
    mainIcon: FaComment,
    floatingIcons: [FaComment, FaComment, FaComment],
    defaultTitle: "No Posts Found",
    defaultSubtitle:
      "No posts to display. Be the first to share something with the community!",
  },
  comments: {
    mainIcon: FaComment,
    floatingIcons: [FaComment, FaComment, FaComment],
    defaultTitle: "No Comments Found",
    defaultSubtitle:
      "No comments yet. Start the conversation by leaving the first comment!",
  },
  materials: {
    mainIcon: FaFile,
    floatingIcons: [FaFile, FaFile, FaFile],
    defaultTitle: "No Materials Found",
    defaultSubtitle:
      "No course materials are available yet. Materials will be added as the course progresses.",
  },
};

export default function NotFoundPage({
  type = "default",
  title,
  subtitle,
  iconColors = ["text-orange-400", "text-orange-300", "text-orange-200"],
  dotColors = ["bg-orange-400", "bg-orange-500", "bg-orange-300"],
}) {
  const config = CONTENT_CONFIGS[type] || {
    mainIcon: FaQuestion,
    floatingIcons: [FaQuestion, FaQuestion, FaQuestion],
    defaultTitle: "Nothing Found",
    defaultSubtitle:
      "We couldn't find what you're looking for. Please try again or go back.",
  };

  const MainIcon = config.mainIcon;
  const [FloatingIcon1, FloatingIcon2, FloatingIcon3] = config.floatingIcons;
  const displayTitle = title || config.defaultTitle;
  const displaySubtitle = subtitle || config.defaultSubtitle;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      {/* Animated Icon Container */}
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <MainIcon className="w-12 h-12 text-white" />
        </div>

        {/* Floating icons */}
        <div className="absolute -top-2 -right-2 animate-bounce delay-100">
          <FloatingIcon1 className={`w-6 h-6 ${iconColors[0]}`} />
        </div>
        <div className="absolute -bottom-1 -left-2 animate-bounce delay-300">
          <FloatingIcon2 className={`w-5 h-5 ${iconColors[1]}`} />
        </div>
        <div className="absolute top-1 -left-3 animate-bounce delay-500">
          <FloatingIcon3 className={`w-4 h-4 ${iconColors[2]}`} />
        </div>
      </div>

      {/* Main Message */}
      <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
        {displayTitle}
      </h3>

      {/* Subtitle */}
      <p className="text-gray-500 text-lg mb-6 max-w-md leading-relaxed">
        {displaySubtitle}
      </p>

      {/* Decorative Element */}
      <div className="flex space-x-2 opacity-30">
        <div
          className={`w-2 h-2 ${dotColors[0]} rounded-full animate-bounce`}
        ></div>
        <div
          className={`w-2 h-2 ${dotColors[1]} rounded-full animate-bounce delay-100`}
        ></div>
        <div
          className={`w-2 h-2 ${dotColors[2]} rounded-full animate-bounce delay-200`}
        ></div>
      </div>
    </div>
  );
}
