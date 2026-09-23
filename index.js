var teamNameList = [];

function TeamName(name, teamName) {
  this.name = name;
  this.teamName = teamName;
  teamNameList.push(this);
}

const team1 = new TeamName("Drew", "Igor...She's Twerkin'");
const team2 = new TeamName("Dylan", "Cale Salad");
const team3 = new TeamName("Graeme", "Bread Roller");
const team4 = new TeamName("Matt", "Chicken Lips");
const team5 = new TeamName("Jake", "Neil Lander");
const team6 = new TeamName("Hudson", "SoftDumpInTheCorner");
const team7 = new TeamName("Josh", "Trust the Process");
const team8 = new TeamName("Parsa", "Dolla Dolla Bill Kirill");
const team9 = new TeamName("Rob", "Scheifele Tower");
const team10 = new TeamName("Fernando", "I've Got Rants in My Pants");

function teamDropdown() {
  teamNameList.sort(function (a, b) {
    var textA = a.teamName;
    var textB = b.teamName;
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });

  for (i = 0; i < teamNameList.length; i++) {
    $("#team-dropdown").append(
      "<a href='./1-" +
        (i + 1) +
        "-Team" +
        (i + 1) +
        ".html' class='not-active'>" +
        teamNameList[i].teamName +
        "</a>",
    );
  }
}

$(".navbar").load("0-Header.html");
setTimeout(function () {
  teamDropdown();
}, 20);
