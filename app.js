const express = require("express");
const app = express();

app.get("/", (req, res) => {
    console.log("User accessed the home page");
});

app.listen(3000, () => console.log("Server running..."));
