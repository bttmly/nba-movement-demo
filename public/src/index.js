const d3 = require("d3");
const R = require("ramda");

const movement = require("nba-movement");

const WIDTH = 94;
const HEIGHT = 50;
const MULTIPLIER = 8;
const INTERVAL = 1000 / 24;

const pp = document.getElementById("play-pause");
const gc = document.getElementById("game-clock");
const sc = document.getElementById("shot-clock");
const bh = document.getElementById("ball-height");

let svgNode;

let isPaused = false;

main();

function main () {
  fetch("/data/plays.json")
    .then(res => res.text())
    .then(text => text.trim().split("\n"))
    .then(arr => arr.map(JSON.parse).map(Event))
    .then(queueDrawing)
}

function drawEvent (event) {
  return new Promise(function (resolve, reject) {
    let i = 0;
    const {players, moments} = event;
    const interval = setInterval(function () {

      if (isPaused) return;

      i += 1;
      if (moments[i] == null) {
        // stop drawing
        clearInterval(interval);
        // pause for a second
        setTimeout(resolve, 1000);
        return;
      }

      drawMoment(moments[i]);
    }, INTERVAL);
  });
}

function drawMoment (moment) {
  removeSvg();

  gameClock(moment);
  shotClock(moment);
  ballHeight(moment);

  const svg = d3.select("body").append("svg")
      .attr("width", WIDTH * MULTIPLIER)
      .attr("height", HEIGHT * MULTIPLIER);

  svgNode = svg[0][0];

  svg.selectAll(".player")
      .data(moment.coordinates).enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 6)
    .attr("cx", c => c.x * MULTIPLIER)
    .attr("cy", c => c.y * MULTIPLIER)
    .style("fill", function (c) {
      if (c.type === "ball") return "black";
      if (c.teamId === 1610612766) return "red";
      return "blue";
    });
}

function team (rawTeam) {
  return rawTeam.players.map(p => ({
    firstName: p.firstname,
    lastName: p.lastName,
    playerId: p.playerid,
    jerseyNo: p.jersey,
    position: p.position,
    teamName: rawTeam.name,
    teamId: rawTeam.teamid,
    teamAbbrev: rawTeam.abbreviation,
  }));
}

function queueDrawing (events) {
  events.reduce(
    (p, event) => p.then(() => drawEvent(event)), 
    Promise.resolve()
  );
}

function Event (data) {
  const players = team(data.home).concat(team(data.visitor));
  const moments = data.moments.map(movement.Moment);
  return {players, moments}
}

function removeSvg () {
  if (svgNode == null) return;
  svgNode.parentElement.removeChild(svgNode);
  svgNode = null;
}


function gameClock (moment) {
  let min = Math.floor(moment.gameClock / 60);
  let sec = Math.floor(moment.gameClock % 60);
  if (sec < 10) sec = "0" + sec;
  gc.textContent = `${min}:${sec}`;
}

function shotClock (moment) {
  let clock = moment.shotClock;
  if (Math.floor(clock) === clock) {
    clock = clock + ".00";
  }
  sc.textContent = clock;
}

function ballHeight (moment) {
  let ball = R.find(R.whereEq({type: "ball"}), moment.coordinates);
  bh.textContent = ball.radius;
}

pp.addEventListener("click", () => isPaused = !isPaused);
