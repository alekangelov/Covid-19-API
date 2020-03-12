const axios = require("axios");
const cheerio = require("cheerio");
async function scrape(url) {
  let page,
    Return = {};
  try {
    page = await axios.get(url);
    const $ = cheerio.load(page.data);
    const allCases = $(".maincounter-number");
    console.log(allCases.length);
    Return.cases = allCases;
  } catch (e) {
    console.log(e);
  }
  return Return;
}

module.exports = { scrape };
