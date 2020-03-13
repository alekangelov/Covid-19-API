const express = require("express");
const path = require("path");
const app = express();
const SCRAPE_URL = "https://www.worldometers.info/coronavirus/";
// const SCRAPE_URL = "http://localhost:3000/test";
const PORT = 3000;
const { scrape } = require("./scraper");
(async function init() {
  const scrapeResults = await scrape(SCRAPE_URL);
})();

app.get("/", async (req, res) => {
  res.send({ jako: "jako" });
});

app.get("/test", async (req, res) => {
  res.sendFile(path.join(__dirname, "testing.html"));
});

app.listen(PORT, () =>
  console.log(`COVID-19 API IS RUNNING ON http://localhost:${PORT}`)
);
