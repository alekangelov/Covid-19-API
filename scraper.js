const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const indexPath = path.join(__dirname, "/stats/index.json");
const countriesPath = path.join(__dirname, "/stats/countries.json");

async function scrape(url) {
  let page,
    Return = {};
  try {
    page = await axios.get(url);
    const $ = cheerio.load(page.data);
    const allCases = $(".maincounter-number");
    const activeClosed = $(".panel_front");
    allCases.find("span").each((i, e) => {
      switch (i) {
        case 0:
          Return.totalCases = $(e).text();
          break;
        case 1:
          Return.deaths = $(e).text();
          break;
        case 2:
          Return.recovered = $(e).text();
          break;
      }
    });
    const activeCases = {};
    const closedCases = {};
    activeClosed.each((i, e) => {
      switch (i) {
        case 0:
          $(e)
            .find(".number-table")
            .each((i, e) => {
              if (i === 0) {
                activeCases["critical"] = $(e).text();
              } else {
                activeCases["mild"] = $(e).text();
              }
            });
          break;
        case 1:
          $(e)
            .find(".number-table")
            .each((i, e) => {
              if (i === 0) {
                closedCases["recovered"] = $(e).text();
              } else {
                closedCases["deaths"] = $(e).text();
              }
            });
          break;
      }
    });
    Return = { ...Return, activeCases, closedCases };
    fs.writeFile(indexPath, JSON.stringify(Return), e => e);
    const makeCountry = ([
      country,
      total,
      newCases,
      totalDeaths,
      newDeaths,
      totalRecovered,
      activeCases,
      criticalCases,
      totalCasesPerMillion
    ]) => {
      return {
        country,
        total,
        newCases,
        totalDeaths,
        newDeaths,
        totalRecovered,
        activeCases,
        criticalCases,
        totalCasesPerMillion
      };
    };
    const countries = [];
    $($("#main_table_countries tbody")[0])
      .find("tr")
      .each((i, e) => {
        const body = [];
        $(e)
          .find("td")
          .each((i, x) => {
            body.push(
              $(x)
                .text()
                .trim()
            );
          });
        countries.push(makeCountry(body));
      });
    fs.writeFile(countriesPath, JSON.stringify(countries), e => e);
  } catch (e) {
    console.log(e);
  }
}

module.exports = { scrape, countriesPath, indexPath };
