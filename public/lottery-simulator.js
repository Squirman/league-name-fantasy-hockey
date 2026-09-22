var ballSet = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
var rawCombos = [];
var names = [];
var namesSorted = [];
var namesSortedFiltered = [];
var combos = [];
var odds = [];
var oddsSorted = [];
var spins = [];
var ballSetTemp = [];
var f1 = [];
var f2 = [];
var f3 = [];
var f4 = [];
var winner;
var winsArray = [];
var spinCount = 0;
var playerCount = 1;
var lotteryCount = 1;
var ballSpin1;
var ballSpin2;
var ballSpin3;
var ballSpin4;
var currentPick = 1;
var officialPickFlag = 0;
var stepPulse = null;
var stepProgressFlags = [0, 0]; //may delete later
var currentStep = 1;
var reRoll = 0;
var popupStatus = 0;
var randomNames = [
  "Camryn Carney",
  "Summer Sharp",
  "Celia Lopez",
  "Dwayne Bell",
  "Stephanie Dennis",
  "Stephany Rosales",
  "Makhi Haynes",
  "Patricia Gordon",
  "Amiah Nicholson",
  "Izaiah Salas",
  "Mercedes Peterson",
  "Samara Mcclure",
  "Maverick Orozco",
  "Samson Maxwell",
  "Jaxson Levine",
  "Heidy Townsend",
  "Juan Chaney",
  "Kaitlynn Bartlett",
  "Dane Townsend",
  "Enrique Greer",
];
var title = $("title").text();
$("#sidebar h1").html(title);

$(".disable-b").prop("disabled", true); //disable buttons that aren't applicable yet
$(".disable-c").prop("disabled", true); //disable buttons that aren't applicable yet
// $("#pick-number").html(currentPick + " of " + lotteryCount);

//set pick flag depending on practice or official radio button
$(".spin-type input").on("click", function () {
  if ($("#spin-official").prop("checked")) {
    officialPickFlag = 1;
    $("#spin-x, #simulate-x").prop("disabled", true);
  } else {
    officialPickFlag = 0;
    $("#spin-x, #simulate-x").prop("disabled", false);
  }
  console.log("Official Pick Flag: " + officialPickFlag);
});

//function to create array of 1001 combos (all combinations of 4 balls pulled from 14 balls)
function createCombos(numBalls) {
  for (let i = 0; i < numBalls - 3; i++) {
    for (let j = i + 1; j < numBalls - 2; j++) {
      for (let k = j + 1; k < numBalls - 1; k++) {
        for (let l = k + 1; l < numBalls; l++) {
          rawCombos.push([ballSet[i], ballSet[j], ballSet[k], ballSet[l]]);
        }
      }
    }
  }
}

// function to assign random 4 ball combinations to each player based on odds table
function assignOdds() {
  combos = [];
  for (k = 0; k < lotteryCount; k++) {
    //shuffle rawCombos array
    let arr = rawCombos.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    let arr3 = [];
    for (l = 0; l < playerCount - k + reRoll; l++) {
      let arr2 = [];
      arr2 = arr.splice(0, oddsSorted[k][l]);
      arr3.push(arr2);
    }
    combos.push(arr3);
  }
}

//function to filter remaining combinations for each player after each spin
function filterx(fx, fy, y) {
  for (let i = 0; i < oddsSorted[currentPick - 1].length; i++) {
    fx[i] = fy[i].filter((comb1) => comb1.includes(spins[y]));
  }
}

//function to be auto run with filter 4 to assign, log, and display winner
function findWinner() {
  for (let i = 0; i < f4.length; i++) {
    if (f4[i].length > 0) {
      // if (currentPick === 1) {
      //   winner = names[i];
      // } else {
      winner = namesSortedFiltered[i];
      // }
      winsArray[currentPick - 1][i]++;
    }
  }
  let currentWinsArray = winsArray[currentPick - 1];
  let winSum = currentWinsArray.reduce((partialSum, a) => partialSum + a, 0);
  $("#results-spin-count-" + currentPick).html(winSum);
}

function processWinner() {
  findWinner();
  winCount();
  spins.sort(function (a, b) {
    return a - b;
  });
  createResultsChart(currentPick);
  console.log("The winner is " + winner + "!");
  $("strong.winner-name").html(winner);
  $("button.spin-all").prop("disabled", false);
  $(".disable-b").prop("disabled", false);
  $(".radio-inputs-19").removeClass("radio-disabled");
  $(".spin-type-radio").prop("disabled", false);
  $("#spin-all-message").html("");
  if (officialPickFlag === 1) {
    if (reRoll === 1 && winner === "Re-Roll") {
      reRollPopup();
    } else {
      winnerPopup();
      updateDraftOrder(); //adds winner to draft order table, adds rest if final spin. Adds 1 to currentPick at the end (move this to next function)
    }
  }
  $("#spin-practice").prop("checked", true);
  officialPickFlag = 0;
}

//function to progress to next draw. Called when winner popup is closed
function pickProgress() {
  if (currentPick === lotteryCount) {
    currentStep = 3;
    $(".lottery-not-complete").hide();
    fillDraftTable();
    progressToStepX(3);
    $(".disable-b").prop("disabled", true);
    $("#edit-odds").prop("disabled", false);
  } else if (currentPick < lotteryCount) {
    currentPick++;
    $("#pick-number").html(currentPick + " of " + lotteryCount);
    addResultsTable();
    comboList();
    resultsTableSelect(currentPick);
    progressBar(2);
  } else {
    alert("Error");
  }
}

//function to count rounds simulated and calculate each player's win percent
function winCount() {
  let winSum = 0;
  for (i = 0; i < winsArray[currentPick - 1].length; i++) {
    $(
      ".results-table-" +
        currentPick +
        " tr:nth-child(" +
        (i + 1) +
        ") td:nth-child(6)",
    ).html(winsArray[currentPick - 1][i]);
    winSum += winsArray[currentPick - 1][i];
  }
  for (i = 0; i < names.length - (currentPick - 1); i++) {
    $(
      ".results-table-" +
        currentPick +
        " tr:nth-child(" +
        (i + 1) +
        ") td:nth-child(7)",
    ).html(((winsArray[currentPick - 1][i] / winSum) * 100).toFixed(1) + "%");
  }
}

//funciton to filter for all spins instantaneously (instead of one spin at a time)
function filterAll() {
  filterx(f1, combos[currentPick - 1], 0);
  filterx(f2, f1, 1);
  filterx(f3, f2, 2);
  filterx(f4, f3, 3);
}

//function to spin all balls instantaneously (instead of one spin at a time), and filter, and find the winner
function spinAll() {
  resetSpins();
  setTimeout(function () {
    var array = ballSet.slice();
    for (let i = 0; i < 4; i++) {
      spins[i] = array.splice(Math.floor(Math.random() * array.length), 1)[0];
      console.log("Spin " + (i + 1) + " = " + spins[i]);
    }
    $("strong.spin1").html(" " + spins[0]);
    $("strong.spin2").html(" " + spins[1]);
    $("strong.spin3").html(" " + spins[2]);
    $("strong.spin4").html(" " + spins[3]);
    $(".disable-c").prop("disabled", true);
    filterAll();
    styleResultsTable(f4);
    processWinner();
  }, 201);
}

//function to spin for 1 ball at a time (can click on any spin button)
function spinx(x, fx, fy, y) {
  if (spinCount === 0) {
    ballSetTemp = ballSet.slice();
  }
  spinCount++;
  spins[x - 1] = ballSetTemp.splice(
    Math.floor(Math.random() * ballSetTemp.length),
    1,
  )[0];
  console.log("Spin " + x + " = " + spins[x - 1]);
  filterx(fx, fy, y);
  // unstyleResultsTable();
  setTimeout(function () {
    unstyleResultsTable();
    styleResultsTable(fx);
    $("#reset-spins").prop("disabled", false);
    if (spinCount === 4) {
      processWinner();
    }
  }, 2500);
}

//update "current" columns of results table to show updated odds after each spin and highlight leader/elimated/winner
function styleResultsTable(fx) {
  var combosx = [];
  var comboCount = 0;
  for (i = 0; i < names.length - (currentPick - 1); i++) {
    combosx.push(fx[i].length);
    comboCount += fx[i].length;
  }
  var maxCombosx = Math.max(...combosx);
  for (i = 0; i < names.length - (currentPick - 1); i++) {
    $(
      ".results-table-" +
        currentPick +
        " tr:nth-child(" +
        (i + 1) +
        ") td:nth-child(4)",
    ).html(fx[i].length);
    $(
      ".results-table-" +
        currentPick +
        " tr:nth-child(" +
        (i + 1) +
        ") td:nth-child(5)",
    ).html(((fx[i].length / comboCount) * 100).toFixed(1) + " %");
    if (combosx[i] === 0) {
      $("#results-player" + (i + 1) + "-" + currentPick).css(
        "background-color",
        "#ff00004f",
      );
    }
    if (combosx[i] === maxCombosx && maxCombosx > 1) {
      $("#results-player" + (i + 1) + "-" + currentPick).css(
        "background-color",
        "#90e5ee94",
      );
    }
    if (combosx[i] === maxCombosx && maxCombosx === 1) {
      $("#results-player" + (i + 1) + "-" + currentPick).css(
        "background-color",
        "#16eb2780",
      );
    }
  }
}

//clear highlighting of winner/elimated/leader after each spin (to be refreshed immediately after)
function unstyleResultsTable() {
  for (i = 0; i < names.length - (currentPick - 1); i++) {
    $("#results-player" + (i + 1) + "-" + currentPick).css(
      "background-color",
      "",
    );
  }
}

//function to reset spins and combinations
function resetSpins() {
  spins = [];
  ballSetTemp = [];
  f1 = [];
  f2 = [];
  f3 = [];
  f4 = [];
  spinCount = 0;
  winner = "";
  $("#simulate-x-warning").html("");
  stopAllBalls();
  unstyleResultsTable();
  setTimeout(function () {
    $(".spin-b").html("?");
    $(".spin-b").css({ display: "block" });
  }, 200);
  $(".spin-b").html("?");
  $(".spin-b").css({ display: "block" });
  $("strong.winner-name").html(winner);
  $(".disable-b").prop("disabled", false);
  $(".disable-c").prop("disabled", true);
  $(".radio-inputs-19").removeClass("radio-disabled");
  $(".spin-type-radio").prop("disabled", false);
  for (i = 0; i < names.length - (currentPick - 1); i++) {
    $(
      ".results-table-" +
        currentPick +
        " tr:nth-child(" +
        (i + 1) +
        ") td:nth-child(4)",
    ).html(combos[currentPick - 1][i].length);
    $(
      ".results-table-" +
        currentPick +
        " tr:nth-child(" +
        (i + 1) +
        ") td:nth-child(5)",
    ).html(
      ((combos[currentPick - 1][i].length / 1001) * 100).toFixed(1) + " %",
    );
  }
}

//function to reset everything on page (refresh page)
function fullReset() {
  window.location.reload();
}

//when any spin button is clicked, spin a ball, update remaining combo array, and disable button
for (i = 0; i < $(".spin").length; i++) {
  $(".spin")[i].addEventListener("click", function () {
    let y = $(".spin").index(this);
    var spinID = $(this).attr("id");
    // $("button.spin-all").prop("disabled", true);
    $("button#" + spinID).prop("disabled", true);
    tempDisableBalls();
    switch (spinCount) {
      case 0:
        spinx(1, f1, combos[currentPick - 1], 0);
        break;
      case 1:
        spinx(2, f2, f1, 1);
        break;
      case 2:
        spinx(3, f3, f2, 2);
        break;
      case 3:
        spinx(4, f4, f3, 3);
        break;

      default:
        console.log(i);
        break;
    }
    console.log(spins[spinCount - 1]);
    console.log(y);
    stopBall(y + 1, spins[spinCount - 1]);
  });
}

//create blank array for wins tally in results table, create multidimensionsal empty array to match odds array size (i.e. 4,3,2)
function createWinsArray() {
  winsArray = [];
  for (i = 0; i < lotteryCount; i++) {
    var arr = [];
    arr.length = odds[i].length;
    arr.fill(0);
    winsArray.push(arr);
  }
}

//spin all on button click (instead of calling from HTML)
$("#spin-all-button").on("click", function () {
  startSpinning();
  resultsTableSelect(currentPick);
});

//spin all on button click (instead of calling from HTML)
$("#spin-all").on("click", function () {
  spinAll();
  resultsTableSelect(currentPick);
});

//reset spins on button click (instead of calling from HTML)
$("#reset-spins").on("click", function () {
  resetSpins();
});

//full reset on button click (instead of calling from HTML)
$("#full-reset").on("click", function () {
  fullReset();
});

//removed row from table when "remove player" button is pushed
$("#remove-player").on("click", function () {
  if (playerCount > 1) {
    $(".player" + playerCount).remove();
    removeLotteryTableRow();
    playerCount--;
    console.log("player count = " + playerCount);
  }
});

//adds row to table when "add player" button is pushed
$("#add-players").on("click", function () {
  if (playerCount < 20) {
    playerCount++;
    // $(".odds-form1").append(
    $("#re-roll-table-1").before(
      "<tr class='player" +
        playerCount +
        "'><td>" +
        playerCount +
        "</td><td><input type='text' class='players disable-a' id='name" +
        playerCount +
        "-1' placeholder='Name'/></td><td><input type='number' class='odds odds-1 disable-a' id='odds" +
        playerCount +
        "-1' min='0' max='1001' placeholder='#' /></td></tr>",
    );
    console.log("player count = " + playerCount);
    if (playerCount > 2) {
      addLotteryTable();
      addLotteryTableRow();
    }
  }
});

//on any mouse move, click, or keypress -> sums all odds in table, remaining combinations available
$(document).on("click mousemove keyup", function () {
  sumOddsTables();
});

function sumOddsTables() {
  for (let i = 1; i <= lotteryCount; i++) {
    let sum1 = 0;
    $(".odds-" + i).each(function () {
      sum1 += Number($(this).val());
      $("#assigned-sum" + i).html(sum1);
      $("#remaining-sum" + i).html(1001 - sum1);
    });
  }
}

//create names array from odds table submittal
function createNamesArray() {
  for (i = 0; i < playerCount; i++) {
    $("#name" + (i + 1)).get();
  }
}

//function to allow chaning of odds table without starting from scratch. Function will wipe results table
$("#edit-odds").on("click", function () {
  resetSpins();
  removeCombosTables();
  clearResultsTables();
  $(".hide-on-submit").show();
  $(".submit-success").hide();
  progressToStepX(1);
  $(".disable-a").prop("disabled", false);
  $(".disable-b").prop("disabled", true);
});

//function to just reset column 6 and 7 of results table
$("button.reset-results").on("click", function () {
  resetCurrentResultsTable();
});

//wipe results table when editing odds table to be re-filled on submittal
function clearResultsTables() {
  for (i = 0; i < lotteryCount; i++) {
    $("#results-table-" + (i + 1)).remove();
  }
  $("#results-table-choose").empty();
  $("#final-results-add-rows").remove();
  $(".no-border").remove();
  rawCombos = [];
  names = [];
  odds = [];
  namesSorted = [];
  namesSortedFiltered = [];
  oddsSorted = [];
  currentPick = 1;
  currentStep = 1;
}

//reset results table (currently specific for first draw only)
function resetCurrentResultsTable() {
  unstyleResultsTable();
  createWinsArray();
  for (i = 0; i < names.length - (currentPick - 1); i++) {
    $(
      ".results-table-" +
        currentPick +
        " tr:nth-child(" +
        (i + 1) +
        ") td:nth-child(6)",
    ).html(winsArray[currentPick - 1][i]);
    $(
      ".results-table-" +
        currentPick +
        " tr:nth-child(" +
        (i + 1) +
        ") td:nth-child(7)",
    ).html("0%");
  }
  $("#results-spin-count-" + currentPick).html(0);
  $("#results-chart-" + currentPick).remove(); //remove current results chart
}

//list all combos for each player
function comboList() {
  $(".assigned-combinations-tables").append(
    "<div class='combo-tables' id='combo-table-" +
      currentPick +
      "'><p class='table-caption' >Assigned Combinations for Draw #" +
      currentPick +
      "</p><table class='assigned-combinations-" +
      currentPick +
      " styled-table normal-table'>",
  );
  for (i = 0; i < names.length - (currentPick - 1); i++) {
    $(".assigned-combinations-" + currentPick).append(
      "<thead class='heading-table'><tr><th colspan='2'>" +
        namesSortedFiltered[i] +
        " (" +
        combos[currentPick - 1][i].length +
        ")</th></tr><tr><th>#</th><th>Combination</th></tr></thead><tbody id='combos" +
        currentPick +
        "-" +
        (i + 1) +
        "'></tbody></table></div>",
    );
    for (j = 0; j < combos[currentPick - 1][i].length; j++) {
      $("#combos" + currentPick + "-" + (i + 1)).append(
        "<tr><td>" +
          (j + 1) +
          "</td><td>" +
          combos[currentPick - 1][i][j].join(", ") +
          "</td></tr>",
      );
    }
  }
}

function startSpinning() {
  resetSpins();
  $(".spin-b").css({ display: "none" });
  // $(".spin-b").html("?");
  $(".spin-b").addClass("from-top");
  $(".spin-b").removeClass("to-bottom");
  ballSpin1 = setInterval(constantBallSpin1, 200);
  ballSpin2 = setInterval(constantBallSpin2, 200);
  ballSpin3 = setInterval(constantBallSpin3, 200);
  ballSpin4 = setInterval(constantBallSpin4, 200);
  $("#spin-all-button").prop("disabled", true);
  $("#spin-all").prop("disabled", true);
  $("#spin-x").prop("disabled", true);
  $(".radio-inputs-19").addClass("radio-disabled");
  $(".spin-type-radio").prop("disabled", true);
  $(".disable-c").prop("disabled", false);
  $("#spin-all-message").html("Click each ball to stop");
}

function stopBall(y, z) {
  //y is ball ID, z is spin value
  let x = window["ballSpin" + y];
  $("#reset-spins").prop("disabled", true);
  clearInterval(x);
  setTimeout(function () {
    $("#spin-b" + y).addClass("from-top");
    $("#spin-b" + y).removeClass("to-bottom");
  }, 50);
  setTimeout(function () {
    $("#spin-b" + y).slideDown(200, function () {
      $("#spin-b" + y).toggleClass("from-top to-bottom");
      $("#spin-b" + y).slideUp(200, function () {
        $("#spin-b" + y).toggleClass("from-top to-bottom");
        $("#spin-b" + y).slideDown(300, function () {
          $("#spin-b" + y).toggleClass("from-top to-bottom");
          $("#spin-b" + y).slideUp(300, function () {
            $("#spin-b" + y).toggleClass("from-top to-bottom");
            $("#spin-b" + y).slideDown(400, function () {
              $("#spin-b" + y).toggleClass("from-top to-bottom");
              $("#spin-b" + y).slideUp(400, function () {
                $("#spin-b" + y).toggleClass("from-top to-bottom");
                $("#spin-b" + y).html(z);
                $("#spin-b" + y).slideDown("slow");
              });
            });
          });
        });
      });
    });
  }, 100);
}

function stopAllBalls() {
  clearInterval(ballSpin1);
  clearInterval(ballSpin2);
  clearInterval(ballSpin3);
  clearInterval(ballSpin4);
  $("#spin-all-message").html("");
}

function constantBallSpin1() {
  $("#spin-b1").slideDown(100, function () {
    $("#spin-b1").toggleClass("from-top to-bottom");
    $("#spin-b1").slideUp(100, function () {
      $("#spin-b1").toggleClass("from-top to-bottom");
    });
  });
}

function constantBallSpin2() {
  $("#spin-b2").slideDown(100, function () {
    $("#spin-b2").toggleClass("from-top to-bottom");
    $("#spin-b2").slideUp(100, function () {
      $("#spin-b2").toggleClass("from-top to-bottom");
    });
  });
}

function constantBallSpin3() {
  $("#spin-b3").slideDown(100, function () {
    $("#spin-b3").toggleClass("from-top to-bottom");
    $("#spin-b3").slideUp(100, function () {
      $("#spin-b3").toggleClass("from-top to-bottom");
    });
  });
}

function constantBallSpin4() {
  $("#spin-b4").slideDown(100, function () {
    $("#spin-b4").toggleClass("from-top to-bottom");
    $("#spin-b4").slideUp(100, function () {
      $("#spin-b4").toggleClass("from-top to-bottom");
    });
  });
}

//add additional hidden odds tables without names when players are added to odds table. These can be used for subsequent lottery spins for 2nd overall, 3rd overall, etc.
function addLotteryTable() {
  $(".odds-tables").append(
    "<div class='odds-form hidden' id='odds-form" +
      (playerCount - 1) +
      "'><p class='table-caption'>Odds for Pick #" +
      (playerCount - 1) +
      "</p><div class='odds-assignment-buttons'><button class='button-65 button-65-left even-distribute disable-a' id='even-distribute-" +
      (playerCount - 1) +
      "'>Even Distribution</button><button class='button-65 button-65-middle-horiz linear-distribute disable-a' id='linear-distribute-" +
      (playerCount - 1) +
      "'>Linear Distribution</button><button class='button-65 button-65-right clear-odds disable-a' id='clear-odds-" +
      (playerCount - 1) +
      "'>Clear Odds</button></div><table class='odds-table-x odds-table-" +
      (playerCount - 1) +
      " styled-table footer-table'><thead class='heading-table'><tr><th class='player-width'>Player #</th><th>Odds</th></tr></thead><tbody class='odds-form" +
      (playerCount - 1) +
      "'><tr class='player1-" +
      (playerCount - 1) +
      "'><td>1</td><td><input type='number' class='odds odds-" +
      (playerCount - 1) +
      " disable-a' id='odds1-" +
      (playerCount - 1) +
      "' min='0' max='1001' placeholder='#' /></td></tr><tr class='player0 re-roll-row hidden' id='re-roll-table-" +
      (playerCount - 1) +
      "'><td><input type='text' class='players' id='name0-" +
      (playerCount - 1) +
      "' value='Re-Roll' disabled/></td><td><input type='number' class='odds odds-" +
      (playerCount - 1) +
      "' id='odds0-" +
      (playerCount - 1) +
      "' min='0' max='1' placeholder='#' disabled/></td></tr></tbody><tfoot><tr class='sum'><td class='assigned-text'>Assigned Combinations</td><td class='assigned' id='assigned-sum" +
      (playerCount - 1) +
      "'></td></tr><tr class='remaining'><td class='unassigned-text'>Remaining Combinations</td><td class='unassigned' id='remaining-sum" +
      (playerCount - 1) +
      "'></td></tr></tfoot></table><div class='odds-chart' id='odds-canvas-" +
      (playerCount - 1) +
      "'></div></div>",
  );
}

//add rows to additional odds tables based on number of players in the first table. Each additional table will have one less row than the table before (winner of previous lottery is excluded)
function addLotteryTableRow() {
  for (i = 2; i <= playerCount; i++) {
    // $(".odds-form" + i).append(
    $("#re-roll-table-" + i).before(
      "<tr class='player" +
        (playerCount - i + 1) +
        "-" +
        i +
        "'><td>" +
        (playerCount - i + 1) +
        "</td><td><input type='number' class='odds odds-" +
        i +
        " disable-a' id='odds" +
        (playerCount - i + 1) +
        "-" +
        i +
        "' min='0' max='1001' placeholder='#' /></td></tr>",
    );
  }
}

//remove rows to additional odds tables based on number of players in the first table.
function removeLotteryTableRow() {
  for (i = 2; i < playerCount; i++) {
    if (playerCount === lotteryCount + 1) {
      hideLotteryTable();
    }
    if (playerCount - i < 2) {
      $("#odds-form" + i).remove();
    }
    $(".player" + (playerCount - i + 1) + "-" + i).remove();
  }
}

//show additional tables on button click
$("#add-lottery").on("click", function () {
  if (lotteryCount < playerCount - 1 && playerCount > 2) {
    showLotteryTable();
  }
});

//hide additional tables on button click
$("#remove-lottery").on("click", function () {
  if (lotteryCount > 1) {
    hideLotteryTable();
  }
});

//function to show additional tables on button click
function showLotteryTable() {
  lotteryCount += 1;
  console.log("Lottery Count = " + lotteryCount);
  $("#odds-form" + lotteryCount).removeClass("hidden");
}

//function to hide additional tables on button click
function hideLotteryTable() {
  $("#odds-form" + lotteryCount).addClass("hidden");
  lotteryCount -= 1;
  console.log("Lottery Count = " + lotteryCount);
}

//click button to trigger submitOdds function
$("button#submit-odds").on("click", function () {
  submitOdds();
});

//function to submit odds table to use data for spins and results
function submitOdds() {
  let nameBlank = 0;
  let oddsBlank = 0;
  let nameDupe = 0;
  let oddSum = 0;
  //check for duplicate names
  for (i = 0; i < playerCount - 1 + reRoll; i++) {
    for (j = i + 1; j < playerCount + reRoll; j++) {
      if (
        $("#name" + (i + 1 - reRoll) + "-1").val() ===
        $("#name" + (j + 1 - reRoll) + "-1").val()
      ) {
        nameDupe = 1;
        $("#submit-warning").html("Odds Table 1: No duplicate names");
      }
    }
  }
  //check for empty names
  for (i = 0; i < playerCount; i++) {
    // if ($("#odds-form1")[0]["name" + (i + 1) + "-1"].value === "") {
    if ($("#name" + (i + 1) + "-1").val() === "") {
      nameBlank = 1;
      $("#submit-warning").html(
        "Odds Table 1: Please fill all name fields or remove blank rows",
      );
    }
  }
  //check for numbers less than 1
  for (i = 0; i < lotteryCount; i++) {
    for (j = 0; j < playerCount - i; j++) {
      // if ($("#odds-form" + (i + 1))[0]["odds" + (j + 1) + "-" + (i + 1)].value < 1) {
      if (Number($("#odds" + (j + 1) + "-" + (i + 1)).val()) < 1) {
        oddsBlank = 1;
        $("#submit-warning").html(
          "Odds Table " +
            (i + 1) +
            ": Please make all odds greater than 0 or remove blank rows",
        );
      }
    }
  }
  //check that sum of each table is 1001
  for (i = 0; i < lotteryCount; i++) {
    if (Number($("#assigned-sum" + (i + 1)).html()) != 1001) {
      oddSum = 1;
      $("#submit-warning").html(
        "Odds Table " + (i + 1) + ": Combinations must equal 1001",
      );
    }
  }
  //creat names and odds arrays
  if (nameBlank === 0 && nameDupe === 0 && oddsBlank === 0 && oddSum === 0) {
    for (i = 0; i < playerCount; i++) {
      names.push($("#name" + (i + 1) + "-1").val());
    }
    if (reRoll === 1) {
      names.push($("#name0-1").val());
    }
    for (i = 0; i < lotteryCount; i++) {
      //cycle through each odds table
      let arr = [];
      for (j = 0; j < playerCount - i; j++) {
        //cycle through each row
        arr.push(Number($("#odds" + (j + 1) + "-" + (i + 1)).val()));
      }
      if (reRoll === 1) {
        arr.push(Number($("#odds0-" + (i + 1)).val()));
      }
      odds.push(arr);
    }
    $("#submit-warning").html("");
    $("#pick-number").html(currentPick + " of " + lotteryCount);
    createCombos(14); //generates the 1001 different combinations
    combineSortArrays(); //create array with names and odds and sort by original odds
    assignOdds(); //randomly assigns combinations to names based on odds in odds table
    createWinsArray(); //create empty array the same length as names[]. This counts simulation wins
    addResultsTable();
    blankFinalResults(); //create blank table to be autofilled based on spin results
    comboList(); //hide text at top of each section on submit. Create list of combinations for each name
    showDivs();
    currentStep = 2;
    progressToStepX(2);
    resultsTableSelect(1);
  }
}

function blankFinalResults() {
  let length = names.length;
  $(".final-results-table-1").append(
    "<tbody id='final-results-add-rows'></tbody>",
  );
  for (i = 0; i < length - reRoll; i++) {
    $("#final-results-add-rows").append(
      "<tr class='overall-pick-" +
        (i + 1) +
        "'><td>" +
        (i + 1) +
        "</td><td></td><td></td><td></td><td></td></tr>",
    );
  }
}

//combine names and odds arrays. Sort them by highest odds. This will determine final draft order for picks that aren't rolled for
function combineSortArrays() {
  let namesOdds = [];
  for (let i = 0; i < names.length; i++) {
    namesOdds.push({ name: names[i], odds: odds[0][i] });
  }
  namesOdds.sort(function (a, b) {
    return b.odds - a.odds;
  });
  namesSorted = namesOdds.map((x) => x.name);
  // oddsSorted = namesOdds.map((y) => y.odds);
  for (let j = 0; j < lotteryCount; j++) {
    oddsSorted[j] = odds[j].sort(function (a, b) {
      return b - a;
    });
  }
  namesSortedFiltered = namesSorted.slice();
  console.log(namesSorted);
  console.log(oddsSorted);
}

//function to add winner to next row of final draft order table. Only called if "official" spin button is selected (called in processWinner)
function updateDraftOrder() {
  let originalRank = namesSorted.indexOf(winner) + 1;
  namesSortedFiltered = namesSortedFiltered.filter(function (e) {
    return e !== winner;
  });
  let pickDiff = originalRank - currentPick;
  $(
    ".final-results-table-1 tr:nth-child(" + currentPick + ") td:nth-child(2)",
  ).html(winner);
  $(
    ".final-results-table-1 tr:nth-child(" + currentPick + ") td:nth-child(3)",
  ).html(originalRank);
  if (pickDiff > 0) {
    $(
      ".final-results-table-1 tr:nth-child(" +
        currentPick +
        ") td:nth-child(4)",
    ).html("+" + pickDiff);
    $(
      ".final-results-table-1 tr:nth-child(" +
        currentPick +
        ") td:nth-child(4)",
    ).addClass("pick-rise");
  }
  if (pickDiff < 0) {
    $(
      ".final-results-table-1 tr:nth-child(" +
        currentPick +
        ") td:nth-child(4)",
    ).html(pickDiff);
    $(
      ".final-results-table-1 tr:nth-child(" +
        currentPick +
        ") td:nth-child(4)",
    ).addClass("pick-fall");
  }
  if (pickDiff === 0) {
    $(
      ".final-results-table-1 tr:nth-child(" +
        currentPick +
        ") td:nth-child(4)",
    ).html(pickDiff);
  }
  $(
    ".final-results-table-1 tr:nth-child(" + currentPick + ") td:nth-child(5)",
  ).html(spins.join(", "));
  //highlight winning combination in results table
  highlightWinningCombo(currentPick);
  winnerPopup();
  // alert(winner + " has won this draw. They will have pick #" + currentPick);
}

//function to back-fill rest of draft order table. call this function after updateDraftOrder(). Only execute if lotteryCount === currentPick
function fillDraftTable() {
  for (i = 0; i < namesSortedFiltered.length; i++) {
    let name = namesSortedFiltered[i];
    let oRank = namesSorted.indexOf(name) + 1;
    let cRank = currentPick + i + 1;
    let rankDiff = oRank - cRank;
    $(
      ".final-results-table-1 tr:nth-child(" + cRank + ") td:nth-child(2)",
    ).html(name);
    $(
      ".final-results-table-1 tr:nth-child(" + cRank + ") td:nth-child(3)",
    ).html(oRank);
    if (rankDiff > 0) {
      $(
        ".final-results-table-1 tr:nth-child(" + cRank + ") td:nth-child(4)",
      ).html("+" + rankDiff);
      $(
        ".final-results-table-1 tr:nth-child(" + cRank + ") td:nth-child(4)",
      ).addClass("pick-rise");
    }
    if (rankDiff < 0) {
      $(
        ".final-results-table-1 tr:nth-child(" + cRank + ") td:nth-child(4)",
      ).html(rankDiff);
      $(
        ".final-results-table-1 tr:nth-child(" + cRank + ") td:nth-child(4)",
      ).addClass("pick-fall");
    }
    if (rankDiff === 0) {
      $(
        ".final-results-table-1 tr:nth-child(" + cRank + ") td:nth-child(4)",
      ).html(rankDiff);
    }
    $(
      ".final-results-table-1 tr:nth-child(" + cRank + ") td:nth-child(5)",
    ).html("N/A");
  }
}

//function to add new results table for subsequent draws
function addResultsTable() {
  $(".results-tables").append(
    "<div class='results-table-div' id='results-table-" +
      currentPick +
      "' style='display: none'><table class='results-table-x results-table-" +
      currentPick +
      " styled-table normal-table'><caption>Simulation Results for Pick #" +
      currentPick +
      "</caption><thead class='heading-table'><tr><th>Name</th><th>Original Combinations</th><th>Original % Chance</th><th>Current Combinations</th><th>Current % Chance</th><th>Wins</th><th>Win Percentage</th></tr></thead><tbody></tbody></table></div>",
  );
  for (i = 0; i < namesSortedFiltered.length; i++) {
    $(".results-table-" + currentPick + " > tbody").append(
      "<tr id='results-player" +
        (i + 1) +
        "-" +
        currentPick +
        "'><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>",
    );
    $(
      ".results-table-" +
        currentPick +
        " tr:nth-child(" +
        (i + 1) +
        ") td:nth-child(1)",
    ).html(namesSortedFiltered[i]);
    $(
      ".results-table-" +
        currentPick +
        " tr:nth-child(" +
        (i + 1) +
        ") td:nth-child(2)",
    ).html(oddsSorted[currentPick - 1][i]);
    $(
      ".results-table-" +
        currentPick +
        " tr:nth-child(" +
        (i + 1) +
        ") td:nth-child(3)",
    ).html(((oddsSorted[currentPick - 1][i] / 1001) * 100).toFixed(1) + " %");
    $(
      ".results-table-" +
        currentPick +
        " tr:nth-child(" +
        (i + 1) +
        ") td:nth-child(4)",
    ).html(combos[currentPick - 1][i].length);
    $(
      ".results-table-" +
        currentPick +
        " tr:nth-child(" +
        (i + 1) +
        ") td:nth-child(5)",
    ).html(
      ((combos[currentPick - 1][i].length / 1001) * 100).toFixed(1) + " %",
    );
    $(
      ".results-table-" +
        currentPick +
        " tr:nth-child(" +
        (i + 1) +
        ") td:nth-child(6)",
    ).html(winsArray[currentPick - 1][i]); //need new winsArray
    $(
      ".results-table-" +
        currentPick +
        " tr:nth-child(" +
        (i + 1) +
        ") td:nth-child(7)",
    ).html("0%");
    $(".disable-a").prop("disabled", true);
    $(".disable-b").prop("disabled", false);
  }
  $("#results-table-" + currentPick).append(
    "<tr class='no-border'><td></td><td></td><td></td><td id='simulation-count'>Simulation Count</td><td class='results-spin-count' id='results-spin-count-" +
      currentPick +
      "'>0</td></tr>",
  );
  $("#results-table-choose").append(
    "<option value=" + currentPick + ">" + currentPick + "</option>",
  );
}

//evenly distribute odds amongst playes
$(".odds-tables").on("click", ".even-distribute", function () {
  let z = $(this).attr("id").slice(-1); //table number
  let rows = $("tbody.odds-form" + z + " tr").length - 1;
  let x = Math.floor((1001 - reRoll) / rows);
  let leftovers = (1001 - reRoll) % rows;
  for (i = 1; i <= rows; i++) {
    $("#odds" + i + "-" + z).val(x); //assign x to each combinations input in table 1
  }
  if (leftovers > 0) {
    for (j = 1; j <= leftovers; j++) {
      $("#odds" + j + "-" + z).val(x + 1); //add leftovers down the rows
    }
  }
  //refresh odds table on click
  createOddsChart(z);
});

//linearly distribute odds amongst playes
$(".odds-tables").on("click", ".linear-distribute", function () {
  let z = $(this).attr("id").slice(-1); //table number
  let rows = $("tbody.odds-form" + z + " tr").length - 1;
  let base = (1001 - reRoll) / ((rows * (rows + 1)) / 2);
  let total = 0;
  for (i = 0; i < rows; i++) {
    let y = Math.floor(base * (i + 1));
    $("#odds" + (rows - i) + "-" + z).val(y); //assign x to each combinations input in table 1
    total += y;
  }
  let leftovers = 1001 - reRoll - total;
  if (leftovers > 0) {
    for (j = 1; j <= leftovers; j++) {
      let q = +$("#odds" + j + "-" + z).val();
      $("#odds" + j + "-" + z).val(q + 1); //add leftovers down the rows
    }
  }
  //refresh odds table on click
  createOddsChart(z);
});

//clear odds in table
$(".odds-tables").on("click", ".clear-odds", function () {
  let z = $(this).attr("id").slice(-1); //table number
  let rows = $("tbody.odds-form" + z + " tr").length;
  for (i = 1; i <= rows; i++) {
    $("#odds" + i + "-" + z).val(0);
  }
  //refresh odds table on click
  createOddsChart(z);
});

//function to fill table names (test only)
$("#test-fill-names").on("click", function () {
  let arr = randomNames.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  for (k = 1; k <= playerCount; k++) {
    $("#name" + k + "-1").val(arr[k - 1]);
  }
  //refresh odds table on click
  createOddsChart(1);
});

//remove raw combination tables
function removeCombosTables() {
  for (i = 1; i <= currentPick; i++) {
    $(".assigned-combinations-" + i).remove();
  }
}

function removeCurrentComboTable() {
  $("#combo-table-" + currentPick).remove();
}

//orange glow step 1 button on page load
glowButton(1, "orange");

//function to change progress bar progress
function progressBar(clickedStep) {
  resetProgressBar();
  let orange = {
    "background-color": "orange",
    border: "rgb(216, 117, 81)",
    "border-style": "inset",
    "box-shadow": "0 0 8px 5px rgba(216, 117, 81, 0.678)",
  };
  let green = {
    "background-color": "lightgreen",
    border: "rgb(85, 219, 85)",
    "border-style": "inset",
    "box-shadow": "0 0 8px 5px rgba(85, 219, 85, 0.678)",
  };
  let red = {
    "background-color": "red",
    border: "rgb(240, 117, 117)",
    "border-style": "inset",
    "box-shadow": "0 0 8px 5px rgba(240, 117, 117, 0.68)",
  };
  if (clickedStep === currentStep) {
    $("#point-" + clickedStep).css(orange);
    glowButton(clickedStep, "orange");
    for (i = 1; i < clickedStep; i++) {
      $("#progress-bar" + (i + 1)).css(green);
      $("#point-" + i).css(green);
    }
  } else if (clickedStep < currentStep) {
    $("#point-" + clickedStep).css(green);
    $("#point-" + currentStep).css(orange);
    glowButton(clickedStep, "green");
    for (k = 0; k < currentStep; k++) {
      $("#progress-bar" + (k + 1)).css(green);
      $("#point-" + k).css(green);
    }
  } else if (clickedStep > currentStep) {
    $("#point-" + clickedStep).css(orange);
    glowButton(clickedStep, "orange");
    for (m = 1; m < currentStep; m++) {
      $("#progress-bar" + (m + 1)).css(green);
      $("#point-" + m).css(green);
    }
    for (n = currentStep; n < clickedStep; n++) {
      $("#progress-bar" + (n + 1)).css(red);
      $("#point-" + n).css(red);
    }
  }
  $("#div-step-" + clickedStep).show();
}

//function to reset progress bar
function resetProgressBar() {
  for (j = 1; j <= 3; j++) {
    $("#progress-bar" + j).css({
      "background-color": "#25cff2",
      border: "",
      "border-style": "outset",
      "box-shadow": "",
    });
    $("#point-" + j).css({
      "background-color": "#25cff2",
      border: "",
      "border-style": "outset",
      "box-shadow": "",
    });
    $("#div-step-" + j).hide();
    $("#glow-" + j).hide();
  }
}

//function to glow progress bar button
function glowButton(step, color) {
  let glowColor;
  if (color === "orange") {
    glowColor = "rgb(255, 222, 161)";
  } else if (color === "red") {
    glowColor = "red";
  } else if (color === "green") {
    glowColor = "rgba(85, 219, 85, 0.678)";
  }
  $(".glow").css({ "box-shadow": "0 0 10px 10px " + glowColor });
  $("#glow-" + step).show();
}

//click to colour/progress/pulse through progress bar
$(".progress-points li, .labels li").on("click", function () {
  let clickedStep = Number($(this).attr("id").slice(-1));
  console.log("clicked step: " + clickedStep);
  console.log("current step: " + currentStep);
  progressBar(clickedStep);
  scrollToTop();
});

//function to show proper text after successful odds table submit
function showDivs() {
  $(".hide-on-submit").hide();
  $(".submit-success").show();
}

//function to change step showing on page
function progressToStepX(x) {
  progressBar(x);
  scrollToTop();
}

//function to highlight winning combo in combinations table (called in updateDraftOrder)
function highlightWinningCombo(pick) {
  //current pick as variable?
  let winningCombo = spins.join(", ");
  $(
    ".assigned-combinations-" + pick + " tr:contains(" + winningCombo + ")",
  ).css("background-color", "green");
}
//function to jump to top of page
function scrollToTop() {
  document.body.scrollTop = document.documentElement.scrollTop = 0;
}

$("#jump-to-top").on("click", function () {
  scrollToTop();
});

//function to show specific results table
function resultsTableSelect(x) {
  for (i = 0; i < lotteryCount; i++) {
    $("#results-table-" + (i + 1)).hide();
  }
  $("#results-table-" + x).show();
  $("#results-table-choose").val(x);
}

//function to show all results tables
function resultsTablesShowAll() {
  for (i = 0; i < currentPick; i++) {
    $("#results-table-" + (i + 1)).show();
  }
}

//show selected results table based on dropdown selection
$("#results-table-choose").change(function () {
  let x = $("#results-table-choose").val();
  console.log("dropdown = " + x);
  if (x === "show all") {
    resultsTablesShowAll();
  } else {
    resultsTableSelect(x);
  }
});

//function to create odds chart to help visualize. Called from clicking .even-distribute, .linear-distribute, .clear-odds, #test-fill-names
function createOddsChart(x) {
  $("#odds-chart-" + x).remove();
  $("#odds-canvas-" + x).css("height", "300px");
  $("#odds-canvas-" + x).append("<canvas id='odds-chart-" + x + "'></canvas>");
  let xValues = [];
  let yValues = [];
  let barColors = [];
  let chart = $("#odds-chart-" + x);
  for (i = 0; i < playerCount + 1 - x + reRoll; i++) {
    xValues[i] = i;
    yValues[i] = Number($("#odds" + (i + 1 - reRoll) + "-" + x).val());
    // $("#odds-form" + x)[0]["odds" + (i + 1 - reRoll) + "-" + x].value);
    barColors[i] = "#0d6efd";
  }
  let maxY = Math.max(...yValues) * 1.1;
  let upperY = Math.ceil(maxY / 100) * 100;
  new Chart(chart, {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [
        {
          fill: false,
          backgroundColor: barColors,
          borderColor: "rgba(0,0,255,0.1)",
          data: yValues,
        },
      ],
    },
    options: {
      animation: {
        duration: 0,
      },
      indexAxis: "y",
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Pick #" + x + " Combinations",
          font: { size: 16 },
        },
      },
      scales: {
        y: {
          min: 0,
          max: upperY,
        },
      },
      maintainAspectRatio: false,
    },
  });
}

//update bar charts when name or combos cells are changed
// $("input.odds").on("change", function () {
$(".odds-tables").on("change", ".odds", function () {
  let x = $(this).attr("id");
  let z = $(this).attr("id").slice(-1); //table number
  console.log("id = " + x);
  console.log("table " + z);
  createOddsChart(z);
});

//function to track each draft practice simulation. Called in process winner function
function createResultsChart(x) {
  $("#results-canvas-" + x).remove();
  $("#results-table-" + x).append(
    "<div class='results-chart' id='results-canvas-" +
      x +
      "'><canvas id='results-chart-" +
      x +
      "' style='width: 100%'></canvas></div>",
  );
  let xValues = [];
  let yValues1 = [];
  let yValues2 = [];
  let barColors1 = [];
  let barColors2 = [];
  let chart = $("#results-chart-" + x);
  for (i = 0; i < playerCount + 1 - x + reRoll; i++) {
    xValues[i] = $(
      ".results-table-" + x + " tr:nth-child(" + (i + 1) + ") td:nth-child(1)",
    ).html();
    yValues1[i] =
      Number(
        $(
          ".results-table-" +
            x +
            " tr:nth-child(" +
            (i + 1) +
            ") td:nth-child(6)",
        ).html(),
      ) / Number($("#results-spin-count-" + x).html());
    yValues2[i] =
      Number(
        $(
          ".results-table-" +
            x +
            " tr:nth-child(" +
            (i + 1) +
            ") td:nth-child(2)",
        ).html(),
      ) / 1001;
    barColors1[i] = "#0d6efd";
    barColors2[i] = "red";
  }
  // let maxY = Math.max(...yValues1) * 1.1;
  // let upperY = Math.ceil(maxY / 100) * 100;
  new Chart(chart, {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [
        {
          label: "Simulation Win %",
          fill: false,
          backgroundColor: barColors1,
          borderColor: "rgba(0,0,255,0.1)",
          data: yValues1,
        },
        {
          label: "Original Odds %",
          fill: false,
          backgroundColor: barColors2,
          borderColor: "rgba(0,0,255,0.1)",
          data: yValues2,
        },
      ],
    },
    options: {
      animation: {
        duration: 0,
      },
      indexAxis: "y",
      plugins: {
        legend: { display: true },
        title: {
          display: true,
          text: "Pick #" + x + " Combinations",
          font: { size: 16 },
        },
      },
      scales: {
        y: {
          min: 0,
          // max: upperY;
        },
      },
      maintainAspectRatio: false,
    },
  });
}

//disable other balls until current ball stops
function tempDisableBalls() {
  let remainingBalls = [];
  for (i = 1; i <= 4; i++) {
    if ($("#spin" + i).is(":not(:disabled)")) {
      remainingBalls.push(i);
      $("button#spin" + i).prop("disabled", true);
    }
  }
  setTimeout(function () {
    for (j = 0; j < remainingBalls.length; j++) {
      let x = remainingBalls[j];
      $("button#spin" + x).prop("disabled", false);
    }
  }, 2500);
}

//function to simulate x amount of spins
function simulateXSpins(x) {
  // $("html").css("cursor", "progress");
  for (j = 0; j < x; j++) {
    resetSpins();
    let array = ballSet.slice();
    for (let i = 0; i < 4; i++) {
      spins[i] = array.splice(Math.floor(Math.random() * array.length), 1)[0];
    }
    filterAll();
    findWinner();
    winCount();
    spins.sort(function (a, b) {
      return a - b;
    });
    createResultsChart(currentPick);
  }
  // $("html").css("cursor", "default");
}

//check simulate value and simulate x spins if acceptable
$("#spin-x").on("click", function () {
  let x = Number($("#simulate-x").val());
  if (x > 100) {
    $("#simulate-x-warning").html(" Max simulations is 100 at a time");
  } else {
    simulateXSpins(x);
  }
});

//execute re-roll when box is clicked
$(document).on("click mousemove keyup", function () {
  reRollChange();
});

//show re-roll row and set to 1 if box is checked
function reRollChange() {
  for (i = 0; i < lotteryCount; i++) {
    if ($("#re-roll").is(":checked")) {
      reRoll = 1;
      $("#odds0-" + (i + 1)).val(reRoll);
      $("#re-roll-table-" + (i + 1)).show();
    } else {
      reRoll = 0;
      $("#odds0-" + (i + 1)).val(reRoll);
      $("#re-roll-table-" + (i + 1)).hide();
    }
  }
  sumOddsTables();
}

//function to create popup window with winner's name
function winnerPopup() {
  $(".disable-b").prop("disabled", true);
  $("#winner-popup-content").html(winner + " wins pick #" + currentPick + "!");
  if (currentPick === 1) {
    $("#winner-popup").css(
      "background",
      "linear-gradient(45deg, #d3b51d 0%, #ffd86e 55%, #9d9685 100%)",
    );
    $("#winner-popup-content").after(
      "<img src='./assets/images/trophy_gold.png' alt='gold trophy' class='trophy' id='trophy-gold' />",
    );
  } else if (currentPick === 2) {
    $("#winner-popup").css(
      "background",
      "linear-gradient(45deg, #bab9b5 0%, #9196a1 55%, #9d9685 100%)",
    );
    $("#winner-popup-content").after(
      "<img src='./assets/images/trophy_silver.png' alt='silver trophy' class='trophy' id='trophy-silver' />",
    );
  } else if (currentPick === 3) {
    $("#winner-popup").css(
      "background",
      "linear-gradient(45deg, #7b6614 1%, #948442 65%, #9d9685 99%)",
    );
    $("#winner-popup-content").after(
      "<img src='./assets/images/trophy_bronze.png' alt='bronze trophy' class='trophy' id='trophy-bronze' />",
    );
  } else {
    $("#winner-popup").css("background", "rgb(250, 236, 208)");
  }
  $("#winner-popup").show();
  setTimeout(function () {
    popupStatus = "winner";
  }, 5);
}

//function to create popup when re-roll is required
function reRollPopup() {
  $("#reroll-popup").show();
  setTimeout(function () {
    popupStatus = "reroll";
  }, 5);
}

//function to close open popup
function closePopup(popup) {
  if (popup === "winner") {
    pickProgress();
  }
  $("#" + popup + "-popup").hide();
  $("img.trophy").remove();
  popupStatus = 0;
}

//calls function to close open popups when clicking anywhere
$("*").on("click", function () {
  if (popupStatus != 0) {
    closePopup(popupStatus);
  }
});

$("#shuffle-combos").on("click", function () {
  shuffleCombos();
});

function shuffleCombos() {
  removeCurrentComboTable();
  assignOdds();
  comboList();
}

//TO DO
//  publish a copy of the website with only draft official and draft simulator

//STYLING
//spacing for different screen sizes (min width for sidebar)
//  maybe rotate step labels in sidebar
//  if min size reached, sidebar collapses into side menu?
//  hide some columns of results table if screen too small?

//STYLING COMPLETE
//(DONE) make look nice (css/bootstrap)
//(DONE) overall color scheme
//(DONE) text style
//(DONE) center numbers in tables
//(DONE) nicer buttons
//(DONE)nicer input fields
//(DONE)less boring table format
//(DONE) ball shaped buttons (value lowers onto button)
//(DONE) background color and text color of balls
//(DONE) less boring table format
//(DONE) center numbers in tables
//(DONE) place in multiple columns, not just 1
//(DONE) vertical progress bar at left of the page to progress from step to step. Clickable sections that change color. Hide other sections on click. (done in test folder)
//(N/A) jump to results table / combination list x (scrollspy bootstrap)
//(DONE)lottery ball colours (enabled and disabled)
//(DONE) button vs input button
//(DONE) adjust button shadows -> more side shadow
//(DONE) tips in front of eveything (z-index)
//(DONE) show winner of official draft better (instead of default browser alert -> pop-out window with confetti?)
//    https://discourse.webflow.com/t/add-falling-confetti-with-css/103687
//    https://medium.com/@aleksej.gudkov/how-to-create-a-confetti-css-animation-a-step-by-step-guide-4ef79bf5ce2e
//(DONE) button sizing (2 rows?)
//(DONE) spread buttons out so box shadows don't overlap (or make tighter shadows)
//(DONE) set column and row sizes for all tables
//(DONE) format text in table headings (look nicer -> bold? match input text)
//(DONE) vertically center text with buttons (simulate x spins, reset results)
//(DONE) don't squish oods tables when more added -> min width?
//(DONE) odds tables to overflow to next row after 2 or 3
//(DONE) change elimated color to a lighter red
//(DONE) re-size results charts -> make div for chart (like odds charts)
//(DONE) nicely display final draft order (Coloured border around table?, different box shadow)
//(DONE) location of tip question marks
//(DONE) top bar color scheme
//(DONE) top bar -> active / inactive taps (red / work in progress links)
//(DONE) format input options headings/text (re-roll, draw number, spin type, spin method, winner, show results table)
//(DONE) button spacing/positioning
//(DONE) overall positioning (flex vs grid vs box)
//(DONE) tooltips hover consistent distance from question mark
//(DONE) 3D balls (or shadown under each) -> after proper positioning

//COMPLETE
//combine spin + filter functions
//buttons for each click
//button for all spins
//reset button
//switch button click in html to event listeners in js
//table for names / odds input
//	highlight leader in green, people with no combos in red, winner in gold
//list of teams in names array the adds a tally each time they win (resets on button or refresh)
//table for updated odds after each spin -> name, original combos, updated combos, original %, updated %, total wins
//allow to click any spin button first, but must assign spin1() to first click (and spin2() to second, etc.). Only allow each ball to be clicked once before reset
//add player names and odds to arrays on submit button click
//grey out all fields in odds table after submit
//Do not allow odds table to be submitted if odds don't equal 1001
//Do not allow odds table to be submitted if blank fields
//don't reset combos on "Spin All" or "Reset Spins"
//Button to edit odds table without resetting values already entered (refresh win count)
//different warning messages for number less than 1 (must be positive)
//do not submit table if there is an error (currently still adds data to results table)
//put odds table into table format (th, tr, td, etc.)
//collapse odds assignment section on submit
//collapsible section with combos assigned to each name
//add symbol to indicate collapsible section
//after editing and submitting the same form, combos get weird (duplicates or missing combos)
//comment on each function
//add percentage of wins column in results table
//no duplicates in players name inputs
//add spin animation to switch function
//change ball color when locked in
//animation of ball rolling and stopping with # on it
//add varibale for # of draws
//add error messages if submitting odds with improper secondary odds tables
//hide spins div on when clicking edit
//unhide final results on submit, but stay collapsed
//final results table with # of empty rows based on names length
//create final draft order table. Fill line by line as lotteries are done
//disable all spins buttons once final draw is complete
//add tables/spins/results for subsequent draws with one less row (i.e. second overall, thrird overall, etc.)
//text over lottery balls to indicate which lottery is being spun
//total spins under each results table
//delete results table wins sum table on edit
//reset results table without editing odds
//clear results table <tbody> on edit
//delete combinations list on edit
//black headers on each table
//header over everything else
//dropdown navbar in front of other objects
//add delay for spin result , updated odds, and winner after clicking spin button
//BUG***results table goes wonky after edit -> submit (sometimes no winner, sometimes 2 winners)
//BUG***final results table missing after edit->submit
//center text in input fields?
//BUG***sum "assigned combinations" before adding 2nd player (bug in odds table 1)
//progressToStep(3) after final simulation --> if process winner is called when currentPick = lotteryCount
//add winning combination final draft results table
//integrate progress bar
//random names for test fill names (manual array of 20 names, randomize each time you click)
//highlight winning combo in combo list (processWinner)
//fill "winning combo" column in final draft order table with "N/A" for auto filled players
//progress bar ---> don't change previous bubble to green if not complete (flag for section complete)
//progress bars and points stay same color if you click back a step
//full reset, edit odds, jump to top buttons at top of section
//jump to table x for results table (maybe combination tables too?). Dropdown bar to pick which to show
//add bar chart to combos section
//add bar chart to results section
//immediate load of charts, not "slide in" style
//jump to top when clicking on one of the steps in progress bar
//if looking at non-current results table, and click spin -> either jump to current table view or give an error message
//text to complete lottery spins if clicked on results before lottery spins are done
//***BUG -> 2 rows highlighted green after third spin (didn't have equal odds). After Submit -> edit -> submit -> try to disable balls until previous completes
//add question mark to balls to start (instead of blank)
//on submit odds, jump to top of page (and when final draft pick)
//button to auto simulate x amount of spins
//set all balls to "?" on "Reset Spins" button
//reset results chart on "reset results" button click
//tooltips instead of instructions tab (example complete)
//add re-roll check-box (1 combo)
//sum re-roll into total
//re-roll -> if official roll, different alert, don't update final results table, don't advance draw #, etc
//subsequent draw charts not updating on odds update (only on pre-set odds button click)
//Always put "Re-Roll" at the end of namesSorted
//1 combo re-roll check box -> auto fill last row with re-roll, 1 combo -> if processWinner selects re-roll, reset roll
//Re-Roll in final draft order table -> blank or "N/A" for draft # (or don't include in table at all)
//official page
//show draws remaining on lottery div (or "draw x of y" -> use "lotteryCount" variable)
//do I need "action" and "method" for form if I am not posting or getting any info from server? -> NO
//all buttons, not inputs
//keep ball numbers showing after simulation
//align wins total cell with wins column -> add a description cell to left of total (maybe make as a footer like odds tables?)
//prevent navigation header from scrolling with content
//cool radio button https://getcssscan.com/css-radios-examples
//cool checkbox button https://getcssscan.com/css-checkboxes-examples
//official spin radio not triggering
//keep results table styled until ball is finished rolling (then just update rather than clearing formatting) -> leader doesn't get removed if we don't run unstyle function
//reset lottery with same names/odds above or beside final results table (same funtionality as edit odds?)
//simulate x spins disable during spinning
//dafult to practice spin after official spin
//slight size change when "#spin-all-message" appears on spin "start spinning" button click
//funky if reset spins is clicked mid-spin (disable reset during spins? Or interrupt spin sequence?)
//pop-up sizing and centering and color (stand out from background)
//sizing, positioning, and border shadow on trophy pictures
//pop-up window with winner or re-roll
//wait for continue on winner popup before advancing to results page
//close winner popup when clicking anywhere else https://stackoverflow.com/questions/33657212/javascript-click-anywhere-in-body-except-the-one-element-inside-it (or disable everything until continue is clicked)
//question marks back on balls if "reset spins" clicked during spinning
//cool select dropdown https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select
//apply hover transition to spin type (practice / official) -> similar to dropdown menu <select>. And cursor -> pointer
//disable official/practice radio button if mid-spin ($(".spin-type-radio").prop("disabled", true);) -> when to fire? -> style disabled
//button to re-assign / shuffle combinations -> beside "Reset Results" button
//change ball colours
//assigned combo list table caption -> remove from table formatting
//tooltip display at front -> make new style of tooltips (maybe a border around text that can be hovered over instead of separate ? icon) -> try making z-index higher than all divs above it (header, h2, div-step-x)
//unlock spin-type radio when "reset spins" is clicked
//Auto-fill for each table -> even, linear, clear (separate) -> below table title (may have to change to <p class="table-caption">)
//new results chart created every time a simulation is done (old div not deleted)
//odds chart sizing (set sizing, not width of parent table)
//ball shadows sit over heading (z-index)
//"Proceed to Lottery" button text not vertically centered (Official lottery)
//  Add a logo to top bar (AI gen?)
//  split points in ranking ties for lottery standings?
//  table styling and constant column widths in lottery standings
//  hide detailed stats table to be shown on button click in lottery standings
//  make winner pop-up scale with screen size
//preset version of this sheet (and html) for official draft tab (link this sheet so any changes apply to both) -> don't think it can be done for static HTML. Can't call DOM objects if they are loaded after the page

//CAN'T FIGURE OUT
//add percentage beside odds table (divided by 1001)
//spinning cursor while large simulations take place

//NICE TO HAVE
//save / print results?
//potential window to instruct how to use website (modal from bootstrap?)
//Purge variables and classes/ids
//combine names and odds into 1 array with 2 items for each component
//re-organize .js and .css to make easier to read
