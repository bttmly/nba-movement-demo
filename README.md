# nba movement demo

A tiny app using data plled with [`nba-movement`](https://github.com/nickb1080/nba-movement) to create animated sequences of NBA plays with D3.js. 

Like this, but moving
![example image](https://raw.githubusercontent.com/nickb1080/nba-movement-demo/master/img/example.gif)

### Running
- clone the repo
- `npm i`
- `npm start`
- browse to `localhost:4444`

### Upcoming work
Any ideas or contributions at any of the following are very welcome!

I plan to use this as a testing ground to develop some utility functions for `nba-movement`. In particular, the raw data says nothing directly about which team has possession of the ball, if a shot is in progress, if a pass is in progress, etc. A set of heuristics along with some work in tuning them should provide strong guesses for these situations and more. Another interesting problem is nailing down missed and made shots. This might involve matching up shooting data from [`nba`](https://github.com/nickb1080/nba-movement) with movement data. Simpler utilities might be helpers to track player distance from the ball, or touches by a player. Further, there is a non-trivial amount of overlap between some consecutive events. Helper functions to stitch these together seamlessly might be helpful. 
