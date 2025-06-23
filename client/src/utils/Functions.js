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

export { classLevelName, dateFormat, stripHTML, hexToUrl };
