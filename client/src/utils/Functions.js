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
