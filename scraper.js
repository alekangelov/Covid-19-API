const axios = require("axios");
const cheerio = require("cheerio");

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
    // Return.cases = allCases;
  } catch (e) {
    console.log(e);
  }
  console.log(Return);
  return Return;
}

module.exports = { scrape };
