const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const SCRAPE_URL = "https://www.worldometers.info/coronavirus/";
// const SCRAPE_URL = "http://localhost:3000/test";
const PORT = 3000;
const { scrape, countriesPath, indexPath } = require("./scraper");
(async function init() {
  const scrapeResults = await scrape(SCRAPE_URL);
})();

app.get("/", async (req, res) => {
  fs.readFile(indexPath, (e, data) => {
    res.send({
      success: true,
      data: JSON.parse(data)
    });
  });
});

app.get("/byCountry", async (req, res) => {
  fs.readFile(countriesPath, (e, data) => {
    res.send({
      success: true,
      data: JSON.parse(data)
    });
  });
});

app.listen(PORT, () =>
  console.log(`COVID-19 API IS RUNNING ON http://localhost:${PORT}`)
);
