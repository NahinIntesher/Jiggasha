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
  return input.replaceAll("><", "> <").replace(/<[^>]*>/g, '');
}

export { classLevelName, dateFormat, stripHTML };