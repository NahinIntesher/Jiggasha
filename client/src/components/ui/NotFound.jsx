import React from "react";
import { Inbox, Plus, MessageCircle, Users } from "lucide-react";

const NotFound = ({
  title,
  description,
  icon: Icon = Inbox,
  actionText = "",
  onAction,
  type = "posts",
}) => {
  const getTypeSpecificContent = () => {
    switch (type) {
      case "posts":
        return {
          icon: MessageCircle,
          title: "No Posts Yet",
          description:
            "This community is just getting started. Be the first to share something!",
          actionText: "Create First Post",
        };
      case "comments":
        return {
          icon: MessageCircle,
          title: "No Comments Yet",
          description: "Start the conversation by leaving the first comment.",
          actionText: "Add Comment",
        };
      case "members":
        return {
          icon: Users,
          title: "No Members Yet",
          description:
            "Invite friends to join this community and start engaging.",
          actionText: "Invite Members",
        };
      default:
        return {
          icon: Inbox,
          title: title,
          description: description,
          actionText: actionText,
        };
    }
  };

  const content = getTypeSpecificContent();
  const DisplayIcon = Icon || content.icon;

  return (
    <div className="flex items-center justify-center ">
      <div className="relative bg-white border border-gray-300 rounded-2xl p-12 max-w-md w-full text-center shadow-3xl">
        {/* Icon container */}
        <div className="relative mb-8 flex justify-center">
          <div className="relative w-20 h-20 bg-orange-400 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
            <DisplayIcon className="w-8 h-8 text-white drop-shadow-sm" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-400 rounded-full border-3 border-white animate-bounce"></div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold  mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {title || content.title}
          </h3>
          <p className="text-gray-600 leading-relaxed mb-8 max-w-xs mx-auto">
            {description || content.description}
          </p>
        </div>

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-50/50 via-transparent to-transparent pointer-events-none rounded-3xl"></div>
      </div>
    </div>
  );
};

export default NotFound;
