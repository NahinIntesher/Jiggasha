function classLevelName(classLevel) {
  if (classLevel == "admission") return "Admission";
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
  if (!hex) return "";
  try {
    const hexStr = hex.startsWith("\\x") ? hex.slice(2) : hex;
    const decoded = decodeURIComponent(
      hexStr
        .match(/.{1,2}/g)
        .map((byte) => `%${byte}`)
        .join("")
    );
    return decoded;
  } catch (e) {
    console.error("Invalid hex URL:", hex);
    return "";
  }
}

export { classLevelName, dateFormat, stripHTML, hexToUrl };
