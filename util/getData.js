const axios = require("axios");
const cheerio = require("cheerio");

const mackUrl =
  "https://www.mackolik.com/puan-durumu/t%C3%BCrkiye-s%C3%BCper-lig/2020-2021/482ofyysbdbeoxauk19yg7tdt";

const wikiUrl = "https://tr.wikipedia.org/wiki/2020-21_S%C3%BCper_Lig";

const serverUrl = "http://localhost:3000";

const getData = async (_) => {
  try {
    const mackObj = await getMackObj();
    const wikiUrls = await getWikiTeamUrls();
    const teamInfo = await getTeamInfo(wikiUrls, mackObj.teamNames);
    await saveTeams(teamInfo);
    const matches = await getMatches(mackObj.urls);
    await saveMatches(matches);
  } catch (error) {
    console.log("Error:", error);
  }
};

async function getMackObj() {
  const mackObj = {
    urls: [],
    teamNames: [],
  };

  const options = {
    method: "GET",
    url: mackUrl,
  };

  const res = await axios(options);
  const $ = cheerio.load(res.data);

  $(`a[class="p0c-competition-tables__link"]`).each((index, element) => {
    const url = $(element).attr("href").trim();
    const teamName = $(element)
      .find(".p0c-competition-tables__team-name--full")
      .text()
      .trim();
    mackObj.urls.push(url);
    mackObj.teamNames.push(teamName);
  });
  return mackObj;
}

async function getWikiTeamUrls() {
  const teamUrls = [];

  const options = {
    method: "GET",
    url: wikiUrl,
  };

  const res = await axios(options);
  const $ = cheerio.load(res.data);

  $(
    "#mw-content-text > div.mw-parser-output > table:nth-child(21) > tbody > tr > td:nth-child(2) > a"
  ).each((index, element) => {
    teamUrls.push("https://tr.wikipedia.org" + $(element).attr("href").trim());
  });

  return teamUrls;
}

async function getTeamInfo(wikiUrls, teamNames) {
  const teamInfoArray = [];

  for (let [index, url] of wikiUrls.entries()) {
    let teamInfo = {
      teamName: "",
      teamLogo: "",
      teamLink: "",
      teamColors: [],
      officialSite: "",
    };

    const options = {
      method: "GET",
      url,
    };

    const res = await axios(options);
    const $ = cheerio.load(res.data);

    teamInfo.teamName = teamNames[index];

    const element = $(
      "#mw-content-text > div.mw-parser-output > table.infobox"
    );

    teamInfo.teamLogo =
      $(element).find(" tbody > tr:nth-child(1) > td > a > img").attr("src") ||
      "Null";

    let colors = $(element)
      .find("tbody > tr > th:contains('Renkler')")
      .next()
      .text();

    teamInfo.teamColors =
      changeTurkishCharacter(colors)
        .toLowerCase()
        .trim()
        .split("-")
        .join(" ")
        .split(",")
        .join(" ")
        .split("[")[0]
        .split(" ")
        .filter((element) => element !== "") || "Null";

    teamInfo.officialSite =
      $(element)
        .find("tbody > tr > th:contains('Resmî site')")
        .next()
        .text()
        .trim() || "Null";

    let teamHeader = $(element).find("caption").text().trim() || "Null";

    teamInfo.teamLink = changeTurkishCharacter(teamHeader)
      .toLowerCase()
      .split(" ")
      .join("-");

    teamInfoArray.push(teamInfo);
  }

  return teamInfoArray;
}

async function saveTeams(teamInfo) {
  let postUrl = serverUrl + "/team";

  for (let info of teamInfo) {
    try {
      await axios({
        method: "post",
        url: postUrl,
        data: info,
      });
    } catch (error) {
      console.error(error.response.data);
    }
  }
}

async function getMatches(urls) {
  const matches = [];
  for (let url of urls) {
    const options = {
      method: "GET",
      url,
    };

    const res = await axios(options);
    const $ = cheerio.load(res.data);

    $(".p0c-team-matches__teams-container").each((index, elementTeam) => {
      const hTeam = $(elementTeam).find(".p0c-team-matches__team--home");
      const homeTeam = $(hTeam)
        .find(".p0c-team-matches__team-full-name")
        .text()
        .trim();
      const homeTeamScore = $(hTeam)
        .find(".p0c-team-matches__score")
        .text()
        .trim();

      const aTeam = $(elementTeam).find(".p0c-team-matches__team--away");
      const awayTeam = $(aTeam)
        .find(".p0c-team-matches__team-full-name")
        .text()
        .trim();
      const awayTeamScore = $(aTeam)
        .find(".p0c-team-matches__score")
        .text()
        .trim();

      const dayMonth = $(elementTeam)
        .find(
          ".p0c-team-matches__match-date.p0c-team-matches__match-date--day-month"
        )
        .text()
        .trim();

      const year = $(elementTeam)
        .find(
          ".p0c-team-matches__match-date.p0c-team-matches__match-date--year"
        )
        .text()
        .trim();

      const matchDate = new Date(
        year,
        dayMonth.split(".")[1],
        dayMonth.split(".")[0],
        0,
        0,
        0,
        0
      );

      matches.push({
        matchInfo: `${homeTeam} ${homeTeamScore} - ${awayTeamScore} ${awayTeam} (${matchDate.toLocaleString(
          [],
          { dateStyle: "long" }
        )})`,
        homeTeam,
        awayTeam,
        homeTeamScore,
        awayTeamScore,
        matchDate,
      });
    });
  }
  return matches;
}

async function saveMatches(matches) {
  let postUrl = serverUrl + "/match";

  for (let match of matches) {
    try {
      await axios({
        method: "post",
        url: postUrl,
        data: {
          match,
        },
      });
    } catch (error) {
      console.error(error.response.data);
    }
  }
}

function changeTurkishCharacter(text) {
  const characterMap = {
    ç: "c",
    ö: "o",
    ş: "s",
    ı: "i",
    ü: "u",
    ğ: "g",
  };

  text = text.split("");

  for (let i = 0; i < text.length; i++) {
    text[i] = characterMap[[text[i]]] || text[i];
  }

  return text.join("");
}

module.exports = {
  getData,
};
