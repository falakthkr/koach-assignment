const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());

const dataFilePath = "./dataStore.json";

// POST endpoint to store JSON data
app.post("/data", (req, res) => {
  const jsonData = req.body;
  fs.readFile(dataFilePath, (err, data) => {
    let dataStore = data ? JSON.parse(data) : [];
    dataStore.push(jsonData);
    fs.writeFile(dataFilePath, JSON.stringify(dataStore), (err) => {
      if (err) res.status(500).send({ error: "Error storing data" });
      res.status(200).send({ message: "Data stored successfully" });
    });
  });
});

// GET endpoint to retrieve JSON data
app.get("/data", (req, res) => {
  fs.readFile(dataFilePath, (err, data) => {
    if (err) res.status(500).send({ error: "Error retrieving data" });
    res.status(200).send(data ? JSON.parse(data) : []);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
