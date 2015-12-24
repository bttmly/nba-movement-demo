const path = require("path");
const fs   = require("fs");

const R        = require("ramda");
const movement = require("nba-movement");

const FILE = path.join(__dirname, "../public/data/plays.json");
const EVENT_ID = 21;
const MOMENT_ID = 0;

const events = fs.readFileSync(FILE)
  .toString()
  .trim()
  .split("\n")
  .map(JSON.parse)
  .map(movement.Event)

const moment = events[EVENT_ID].moments[MOMENT_ID];

const MAX = {x: Infinity, y: Infinity};

const sq = x => x * x;
const dist = ([_x, _y]) => ({x, y}) => Math.sqrt(sq(_x - x) + sq(_y - y));
const minFromBall = ball => R.minBy(dist([ball.x, ball.y]));
const isBall = R.whereEq({type: "ball"});

function closest (moment) {
  const [[ball], players] = R.partition(isBall, moment.coordinates);
  return R.reduce(minFromBall(ball), MAX, players);
}

