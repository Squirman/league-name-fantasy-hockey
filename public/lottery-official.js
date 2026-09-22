const namesOfficial = [
  "Josh",
  "Hudson",
  "Jake",
  "Matt",
  "Rob",
  "Fernando",
  "Drew",
  "Graeme",
  "Parsa",
  "Dylan",
];
const oddsOfficial = [
  [280, 233, 187, 140, 93, 47, 5, 5, 5, 5],
  [324, 259, 194, 130, 65, 7, 7, 7, 7],
  [378, 283, 189, 94, 14, 14, 14, 14],
];
const numDraws = 3;

applyOfficialData();
ChangeOfficialLotteryHTML();

function applyOfficialData() {
  $("#re-roll").prop("checked", true);
  reRollChange();
  let playerNum = namesOfficial.length;
  for (a = 0; a < playerNum - 1; a++) {
    $("#add-players").click();
  }
  for (b = 0; b < numDraws - 1; b++) {
    $("#add-lottery").click();
  }
  for (c = 0; c < numDraws; c++) {
    for (d = 0; d < playerNum; d++) {
      $("#name" + (d + 1) + "-" + (c + 1)).val(namesOfficial[d]);
      $("#odds" + (d + 1) + "-" + (c + 1)).val(oddsOfficial[c][d]);
    }
    createOddsChart(c + 1);
  }
  sumOddsTables();
  $(".disable-a").prop("disabled", true);
  $("#submit-odds").hide();
  submitOdds();
  $("#edit-odds").prop("disabled", true);
  progressToStepX(1);
}

function ChangeOfficialLotteryHTML() {
  $(".div-content")
    .first()
    .prepend(
      "<div class='submit-odds'><button class='button-65 button' id='official-proceed-button'>Proceed to Lottery</button><br><br></div>",
    );
  $("#selection-buttons-step-1").hide();
  $(".odds-assignment-buttons").hide();
  $(".sim-buttons").hide();
  $("#edit-odds").hide();
}

$("#official-proceed-button").on("click", function () {
  progressToStepX(2);
});

//TO DO

//COMPLETE
//trigger chart creation
//check "Re-Roll" box
//hide submit button
//"Continue to spin" button instead of "Submit" at bottom of step 1 -> new button for proceed to spins
//start on step 2, but show step 1
//edit divs to make hiding buttons simpler
//adjust location of proceed to lottery button (top of section)
//hide irrelevent buttons / sections ()
//official font to match simulation
