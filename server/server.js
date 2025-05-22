require("dotenv").config;
const app = require("./app");

const port = process.env.SERVER_PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
