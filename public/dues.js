const duesThis = 30;
const duesNext = 30;
var playerDuesList = [];

function PlayerDues(name, paidThisYear, paidNextYear) {
  this.name = name;
  this.paidThisYear = paidThisYear;
  this.paidNextYear = paidNextYear;
  this.owesThisYear = duesThis - paidThisYear;
  this.owesNextYear = duesNext - paidNextYear;
  playerDuesList.push(this);
}

const player1 = new PlayerDues("Drew", 30, 30);
const player2 = new PlayerDues("Dylan", 30, 0);
const player3 = new PlayerDues("Graeme", 0, 0);
const player4 = new PlayerDues("Matt", 0, 0);
const player5 = new PlayerDues("Jake", 0, 0);
const player6 = new PlayerDues("Hudson", 0, 0);
const player7 = new PlayerDues("Josh", 0, 0);
const player8 = new PlayerDues("Parsa", 0, 0);
const player9 = new PlayerDues("Rob", 0, 0);
const player10 = new PlayerDues("Fernando", 0, 0);

playerDuesList.sort(function (a, b) {
  var textA = a.name;
  var textB = b.name;
  return textA < textB ? -1 : textA > textB ? 1 : 0;
});

$("#buy-in").html("$" + duesThis);

function fillDuesTable() {
  for (i = 0; i < playerDuesList.length; i++) {
    $("#dues-list").append(
      "<tr><td>" +
        playerDuesList[i].name +
        "</td><td>$" +
        playerDuesList[i].owesThisYear +
        "</td><td>$" +
        playerDuesList[i].owesNextYear +
        "</td></tr>",
    );
    if (
      $("#dues-table tr:nth-child(" + (i + 1) + ") td:nth-child(2)").html() ===
        "$0" &&
      $("#dues-table tr:nth-child(" + (i + 1) + ") td:nth-child(3)").html() ===
        "$0"
    ) {
      $("#dues-table tr:nth-child(" + (i + 1) + ") td:nth-child(1)").css(
        "background-color",
        "#48ff006b",
      );
      $("#dues-table tr:nth-child(" + (i + 1) + ") td:nth-child(2)").css(
        "background-color",
        "#48ff006b",
      );
      $("#dues-table tr:nth-child(" + (i + 1) + ") td:nth-child(3)").css(
        "background-color",
        "#48ff006b",
      );
    } else if (
      $("#dues-table tr:nth-child(" + (i + 1) + ") td:nth-child(2)").html() >
      "$0"
    ) {
      $("#dues-table tr:nth-child(" + (i + 1) + ") td:nth-child(1)").css(
        "background-color",
        "#ff0000e0",
      );
      $("#dues-table tr:nth-child(" + (i + 1) + ") td:nth-child(2)").css(
        "background-color",
        "#ff0000e0",
      );
      $("#dues-table tr:nth-child(" + (i + 1) + ") td:nth-child(3)").css(
        "background-color",
        "#ffee00e0",
      );
    } else {
      $("#dues-table tr:nth-child(" + (i + 1) + ") td:nth-child(1)").css(
        "background-color",
        "#ffee00e0",
      );
      $("#dues-table tr:nth-child(" + (i + 1) + ") td:nth-child(2)").css(
        "background-color",
        "#48ff006b",
      );
      $("#dues-table tr:nth-child(" + (i + 1) + ") td:nth-child(3)").css(
        "background-color",
        "#ffee00e0",
      );
    }
  }
}

fillDuesTable();

//TO DO
//cell spacing and header row text wrapping
//table format

//COMPLETE
//note about no trading draft picks until next season dues are paid
//highlight cells based on paid or not (red for owed this year, yellow for owed next year) -> add class to td based on content?
