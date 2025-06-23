function classLevelName(classLevel) {
  if (classLevel == "admission") return "Admission";
  else if (classLevel == "6") return "Class 6";
  else if (classLevel == "7") return "Class 7";
  else if (classLevel == "8") return "Class 8";
  else if (classLevel == "9-10") return "Class 9-10";
  else if (classLevel == "11-12") return "Class 11-12";
  else if (classLevel == "undergraduate") return "Undergraduate";
  else return `Class ${classLevel}`;
}

function dateFormat(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function stripHTML(input) {
  return input.replaceAll("><", "> <").replace(/<[^>]*>/g, "");
}

function hexToUrl(hex) {
  try {
    if (hex.startsWith("\\x")) {
      hex = hex.slice(2);
    }
    const hexStr = hex
      .match(/.{1,2}/g)
      .map((byte) => String.fromCharCode(parseInt(byte, 16)))
      .join("");
    return hexStr;
  } catch (err) {
    console.error("Invalid hex:", hex);
    return "";
  }
}

 function formatDate(dateString, options = {}) {
  if (!dateString) return "No date";

  try {
    const date = new Date(dateString);

    // Default formatting options
    const defaultOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    // Merge with custom options
    const formatOptions = { ...defaultOptions, ...options };

    return date.toLocaleDateString("en-US", formatOptions);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}

function formatDateOnly(dateString) {
  return formatDate(dateString, { hour: undefined, minute: undefined });
}

function formatRelativeTime(dateString) {
  if (!dateString) return "No date";

  try {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

    return formatDateOnly(dateString);
  } catch (error) {
    console.error("Error formatting relative date:", error);
    return formatDateOnly(dateString);
  }
}

export {
  classLevelName,
  dateFormat,
  stripHTML,
  hexToUrl,
  formatDate,
  formatDateOnly,
  formatRelativeTime,
};
