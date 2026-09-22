var deadlineStatsList = [];
var finalStatsList = [];
var lotteryStatsList = [];
var finalStatsArray = [];
var scoringStatsArray = [];
var finalRankingArray = [];
var rankingTotals = [];
var rankOrder = [];
var finalRotisserieStandings = [];
var finalRotisserieStandingsTransposed = [];
var detailedStatsState = 0;

scoringStatsArray = [4, 5, 6, 7, 8, 9, 10, 11, 12, 16, 17, 18];

function DeadlineStatsInput(
  name,
  sgp,
  ggp,
  goals,
  assists,
  plusMinus,
  ppp,
  sog,
  hit,
  blk,
  win,
  gaa,
  svPercent,
  so,
) {
  this.name = name;
  this.sgp = sgp;
  this.ggp = ggp;
  this.goals = goals;
  this.assists = assists;
  this.plusMinus = plusMinus;
  this.ppp = ppp;
  this.sog = sog;
  this.hit = hit;
  this.blk = blk;
  this.win = win;
  this.gaa = gaa;
  this.svPercent = svPercent;
  this.so = so;
  this.tgp = sgp + ggp;
  this.points = goals + assists;
  this.min = Math.round(ggp * 56);
  this.ga = Math.round((ggp * 56 * gaa) / 60);
  this.sa = Math.round((ggp * 56 * gaa) / 60 / (1 - svPercent));
  deadlineStatsList.push(this);
}

function FinalStatsInput(
  name,
  sgp,
  ggp,
  goals,
  assists,
  plusMinus,
  ppp,
  sog,
  hit,
  blk,
  win,
  gaa,
  svPercent,
  so,
) {
  this.name = name;
  this.sgp = sgp;
  this.ggp = ggp;
  this.goals = goals;
  this.assists = assists;
  this.plusMinus = plusMinus;
  this.ppp = ppp;
  this.sog = sog;
  this.hit = hit;
  this.blk = blk;
  this.win = win;
  this.gaa = gaa;
  this.svPercent = svPercent;
  this.so = so;
  this.tgp = sgp + ggp;
  this.points = goals + assists;
  this.min = Math.round(ggp * 56);
  this.ga = Math.round((ggp * 56 * gaa) / 60);
  this.sa = Math.round((ggp * 56 * gaa) / 60 / (1 - svPercent));
  finalStatsList.push(this);
}

function lotteryStatsValues() {
  for (i = 0; i < deadlineStatsList.length; i++) {
    let name = finalStatsList[i].name;
    let sgp = finalStatsList[i].sgp - deadlineStatsList[i].sgp;
    let ggp = finalStatsList[i].ggp - deadlineStatsList[i].ggp;
    let tgp = finalStatsList[i].tgp - deadlineStatsList[i].tgp;
    let goals = finalStatsList[i].goals - deadlineStatsList[i].goals;
    let assists = finalStatsList[i].assists - deadlineStatsList[i].assists;
    let points = finalStatsList[i].points - deadlineStatsList[i].points;
    let plusMinus =
      finalStatsList[i].plusMinus - deadlineStatsList[i].plusMinus;
    let ppp = finalStatsList[i].ppp - deadlineStatsList[i].ppp;
    let sog = finalStatsList[i].sog - deadlineStatsList[i].sog;
    let hit = finalStatsList[i].hit - deadlineStatsList[i].hit;
    let blk = finalStatsList[i].blk - deadlineStatsList[i].blk;
    let win = finalStatsList[i].win - deadlineStatsList[i].win;
    let sa = finalStatsList[i].sa - deadlineStatsList[i].sa;
    let ga = finalStatsList[i].ga - deadlineStatsList[i].ga;
    let min = finalStatsList[i].min - deadlineStatsList[i].min;
    let gaa = ((ga * 60) / min).toFixed(2);
    let svPercent = ((sa - ga) / sa).toFixed(3);
    let so = finalStatsList[i].so - deadlineStatsList[i].so;

    // lotteryStatsList[i].name = finalStatsList[i].name;
    let playerx = [
      name,
      sgp,
      ggp,
      tgp,
      goals,
      assists,
      points,
      plusMinus,
      ppp,
      sog,
      hit,
      blk,
      win,
      sa,
      ga,
      min,
      gaa,
      svPercent,
      so,
    ];
    lotteryStatsList.push(playerx);
  }
}

const player1a = new DeadlineStatsInput(
  "Jake",
  831,
  80,
  258,
  472,
  108,
  217,
  1965,
  623,
  777,
  42,
  2.9,
  0.891,
  3,
);

const player2a = new DeadlineStatsInput(
  "Hudson",
  866,
  103,
  287,
  476,
  24,
  260,
  2125,
  635,
  663,
  46,
  3.11,
  0.888,
  3,
);

const player3a = new DeadlineStatsInput(
  "Josh",
  846,
  92,
  284,
  456,
  48,
  223,
  2178,
  916,
  658,
  42,
  3.22,
  0.881,
  3,
);

const player4a = new DeadlineStatsInput(
  "Matt",
  791,
  78,
  209,
  357,
  18,
  183,
  1792,
  637,
  642,
  37,
  2.87,
  0.898,
  3,
);

const player5a = new DeadlineStatsInput(
  "Rob",
  903,
  62,
  205,
  386,
  -88,
  160,
  1815,
  726,
  912,
  25,
  2.92,
  0.891,
  1,
);

const player6a = new DeadlineStatsInput(
  "Fernando",
  689,
  55,
  152,
  230,
  -69,
  89,
  1335,
  1346,
  573,
  24,
  3.09,
  0.887,
  0,
);

const player1b = new FinalStatsInput(
  "Jake",
  1141,
  105,
  344,
  638,
  130,
  290,
  2673,
  840,
  1072,
  51,
  2.88,
  0.893,
  3,
);

const player2b = new FinalStatsInput(
  "Hudson",
  1199,
  134,
  374,
  638,
  -19,
  341,
  2891,
  856,
  916,
  57,
  3.11,
  0.889,
  3,
);

const player3b = new FinalStatsInput(
  "Josh",
  1146,
  118,
  390,
  620,
  39,
  326,
  2938,
  1195,
  865,
  54,
  3.18,
  0.884,
  4,
);

const player4b = new FinalStatsInput(
  "Matt",
  1073,
  102,
  301,
  494,
  30,
  251,
  2428,
  892,
  867,
  51,
  2.72,
  0.903,
  4,
);

const player5b = new FinalStatsInput(
  "Rob",
  1217,
  83,
  264,
  524,
  -102,
  199,
  2389,
  988,
  1170,
  35,
  2.93,
  0.89,
  1,
);

const player6b = new FinalStatsInput(
  "Fernando",
  937,
  67,
  195,
  297,
  -100,
  115,
  1742,
  1704,
  759,
  31,
  3.18,
  0.883,
  1,
);

function fillDeadlineTable() {
  for (i = 0; i < deadlineStatsList.length; i++) {
    $("#deadline-stats-data").append(
      "<tr><td>" +
        deadlineStatsList[i].name +
        "</td><td>" +
        deadlineStatsList[i].sgp +
        "</td><td>" +
        deadlineStatsList[i].ggp +
        "</td><td>" +
        deadlineStatsList[i].tgp +
        "</td><td>" +
        deadlineStatsList[i].goals +
        "</td><td>" +
        deadlineStatsList[i].assists +
        "</td><td>" +
        deadlineStatsList[i].points +
        "</td><td>" +
        deadlineStatsList[i].plusMinus +
        "</td><td>" +
        deadlineStatsList[i].ppp +
        "</td><td>" +
        deadlineStatsList[i].sog +
        "</td><td>" +
        deadlineStatsList[i].hit +
        "</td><td>" +
        deadlineStatsList[i].blk +
        "</td><td>" +
        deadlineStatsList[i].win +
        "</td><td>" +
        deadlineStatsList[i].sa +
        "</td><td>" +
        deadlineStatsList[i].ga +
        "</td><td>" +
        deadlineStatsList[i].min +
        "</td><td>" +
        deadlineStatsList[i].gaa +
        "</td><td>" +
        deadlineStatsList[i].svPercent +
        "</td><td>" +
        deadlineStatsList[i].so +
        "</td></tr>",
    );
  }
}

function fillFinalTable() {
  for (i = 0; i < finalStatsList.length; i++) {
    $("#final-stats-data").append(
      "<tr><td>" +
        finalStatsList[i].name +
        "</td><td>" +
        finalStatsList[i].sgp +
        "</td><td>" +
        finalStatsList[i].ggp +
        "</td><td>" +
        finalStatsList[i].tgp +
        "</td><td>" +
        finalStatsList[i].goals +
        "</td><td>" +
        finalStatsList[i].assists +
        "</td><td>" +
        finalStatsList[i].points +
        "</td><td>" +
        finalStatsList[i].plusMinus +
        "</td><td>" +
        finalStatsList[i].ppp +
        "</td><td>" +
        finalStatsList[i].sog +
        "</td><td>" +
        finalStatsList[i].hit +
        "</td><td>" +
        finalStatsList[i].blk +
        "</td><td>" +
        finalStatsList[i].win +
        "</td><td>" +
        finalStatsList[i].sa +
        "</td><td>" +
        finalStatsList[i].ga +
        "</td><td>" +
        finalStatsList[i].min +
        "</td><td>" +
        finalStatsList[i].gaa +
        "</td><td>" +
        finalStatsList[i].svPercent +
        "</td><td>" +
        finalStatsList[i].so +
        "</td></tr>",
    );
  }
}

function fillLotteryStatsTable() {
  for (i = 0; i < lotteryStatsList.length; i++) {
    $("#lottery-stats-data").append("<tr id='row" + i + "'></tr>");
    for (j = 0; j < lotteryStatsList[0].length; j++) {
      $("#row" + i).append("<td>" + lotteryStatsList[i][j] + "</td>");
    }
  }
}

function createFinalArray() {
  for (i = 0; i < lotteryStatsList[0].length; i++) {
    let arr = [];
    for (j = 0; j < lotteryStatsList.length; j++) {
      let x = lotteryStatsList[j][i];
      arr.push(x);
    }
    finalStatsArray.push(arr);
  }
}

fillDeadlineTable();
fillFinalTable();
lotteryStatsValues();
fillLotteryStatsTable();
createFinalArray();

function statRankingWithTies() {
  for (j = 0; j < scoringStatsArray.length; j++) {
    let stat = scoringStatsArray[j];
    let arr = finalStatsArray[stat];
    let sortedLow = [...arr].sort((a, b) => b - a);
    let sortedHigh = [...arr].sort((a, b) => a - b);
    let lowRankMap = new Map();
    let highRankMap = new Map();
    let lowRank = 1;
    let highRank = 1;

    for (i = 0; i < sortedLow.length; i++) {
      if (!lowRankMap.has(sortedLow[i])) {
        lowRankMap.set(sortedLow[i], lowRank);
      }
      lowRank++;
    }
    let lowRankArray = arr.map((value) => lowRankMap.get(value));

    for (i = 0; i < sortedHigh.length; i++) {
      if (!highRankMap.has(sortedHigh[i])) {
        highRankMap.set(sortedHigh[i], highRank);
      }
      highRank++;
    }

    let highRankArray = arr.map((value) => highRankMap.get(value));
    let finalRankArray = [];
    for (i = 0; i < arr.length; i++) {
      finalRankArray[i] =
        (highRankArray[i] - lowRankArray[i] + arr.length + 1) / 2;
    }
    finalRankingArray.push(finalRankArray);
  }

  for (i = 0; i < finalRankingArray[0].length; i++) {
    let sum = 0;
    for (j = 0; j < finalRankingArray.length; j++) {
      sum += finalRankingArray[j][i];
    }
    rankingTotals[i] = sum;
  }

  let sorted = [...rankingTotals].sort((a, b) => b - a);
  rankOrder = rankingTotals.map((x) => sorted.indexOf(x) + 1);

  //Final rotisserie standings array
  finalRotisserieStandings[0] = rankOrder;
  finalRotisserieStandings[1] = finalStatsArray[0];
  for (i = 0; i < finalRankingArray.length; i++) {
    finalRotisserieStandings[2 + i] = finalRankingArray[i];
  }
  finalRotisserieStandings[14] = rankingTotals;
  //Transpose final standings
  finalRotisserieStandingsTransposed = finalRotisserieStandings[0].map(
    (col, i) => finalRotisserieStandings.map((row) => row[i]),
  );
  //Sort final standings
  finalRotisserieStandingsTransposed.sort(function (a, b) {
    return a[0] - b[0];
  });
}

statRankingWithTies();

function fillStandingsTable() {
  for (i = 0; i < finalRotisserieStandingsTransposed.length; i++) {
    $("#lottery-standings-data").append("<tr id='row" + i + "'></tr>");
    for (j = 0; j < finalRotisserieStandingsTransposed[0].length; j++) {
      $("#row" + i).append(
        "<td>" + finalRotisserieStandingsTransposed[i][j] + "</td>",
      );
    }
  }
}

fillStandingsTable();

function toggleCollapse() {
  $(".collapsed-stats").toggle();
  if (detailedStatsState === 0) {
    detailedStatsState = 1;
    $("#collapse-button").text("Hide Detailed Lottery Stats");
  } else {
    detailedStatsState = 0;
    $("#collapse-button").text("Show Detailed Lottery Stats");
  }
}

$("#collapse-button").on("click", function () {
  toggleCollapse();
});
