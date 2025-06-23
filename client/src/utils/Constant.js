const classLevel = [
  "6",
  "7",
  "8",
  "9-10",
  "11-12",
  "admission",
  "undergraduate",
];

const group = ["Science", "Commerce", "Arts"];

const department = ["CSE", "EEE", "BBA", "Civil"];

const subject = {
  6: [101, 107, 109, 127, 150, 154, 134, 151, 111],
  7: [101, 107, 109, 127, 150, 154, 134, 151, 111],
  8: [101, 107, 109, 127, 150, 154, 134, 151, 111],
  "9-10": {
    all: [101, 107, 109, 154, 111],
    Science: [101, 107, 109, 154, 111, 150, 136, 137, 138, 126, 134, 151],
    Commerce: [101, 107, 109, 154, 111, 127, 146, 143, 152, 134, 151],
    Arts: [101, 107, 109, 154, 111, 127, 153, 110, 140, 134, 151],
  },
  "11-12": {
    all: [101, 107, 275],
    Science: [101, 107, 275, 174, 176, 178, 265],
    Commerce: [101, 107, 275, 253, 277, 292, 286, 110],
    Arts: [101, 107, 275, 304, 267, 269, 125, 121, 117, 271, 110],
  },
  admission: {
    all: [101, 107, 275],
    Science: [101, 107, 275, 174, 176, 178, 265],
    Commerce: [101, 107, 275, 253, 277, 292, 286, 110],
    Arts: [101, 107, 275, 304, 267, 269, 125, 121, 117, 271, 110],
  },
  undergraduate: {
    all: [],
    CSE: [],
    EEE: [],
    BBA: [],
    Civil: [],
  },
};

const subjectName = {
  101: "Bangla",
  107: "English",
  109: "Mathematics",
  127: "Science",
  111: "Religion Studies",
  150: "BDS",
  154: "ICT",
  275: "ICT",
  134: "Agricultural Studies",
  151: "Home Science",
  126: "Higher Mathematics",
  136: "Physics",
  137: "Chemistry",
  138: "Biology",
  146: "Accounting",
  143: "Business Entrepreneurship",
  152: "Finance & Banking",
  153: "History of BD & World Civil.",
  110: "Geography & Environment",
  140: "Civics & Citizenship",
  174: "Physics",
  176: "Chemistry",
  178: "Biology",
  265: "Higher Mathematics",
  253: "Accounting",
  277: "Business Org. & Management",
  292: "Finance & Banking",
  286: "Product M. & Marketing",
  110: "Economics",
  304: "History",
  267: "Islamic History & Culture",
  269: "Civic & Good Governance",
  125: "Geography",
  121: "Logic",
  117: "Sociology",
  271: "Social Work",
};
const QUEST_STATUS = {
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
  CLAIMED: "claimed",
};

export { classLevel, group, department, subject, subjectName, QUEST_STATUS };
