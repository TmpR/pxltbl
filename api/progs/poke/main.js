/*
Poke-a-pixel Game by Steven Tomlinson https://github.com/TmpR

TODO
remove duplicate color object and ahve code use color index
add more colors
make game work for 3 and 4 players
add time limit that counts down maximum score
add more animations, effects and sounds

 */

exports.setup = function(api) {
  // Code here get's executed once at program startup.
  api.debug('Starting game...');
  api.fpsLimit = 30;

};

let hasRun = false;
let gameStatus = 0;
const gravity = 0.5;
let rotate = 0;
let introStatus = 0;
let introTicks = 0;
let level = 0;
let width = 0;
let towerLeft =0;
let scroll = 0;
let gameOverTicks = 0;
let players = [];
let gibs = [];

let numPlayers = 2;

let scoreTwinkle = 0;
let btnPressPlus = false;
let btnPressMinus = false;
let btnPressPlayer = [false,false,false,false];

const pointTwinkleSpeed = 16;
const colors = [
  {r:255, g:255, b:0},
  {r:255, g:0,   b:255},
  {r:0,   g:255, b:255},
  {r:0,   g:255, b:0},
  {r:255, g:0,   b:0},
  {r:0,   g:0,   b:255},
];
exports.loop = function(api) {
  switch (gameStatus) {
    case 0:
      gameStart(api);
      break;
    case 1:
      gamePlay(api);
      break;
    case 2:
      gameOver(api);
      break;
  }
};

function gameStart(api) {



  if (!hasRun) {
    hasRun = true;
    introStatus = 0;
    introTicks = 0;
    gameOverTicks = 0;

    for (let i = 0; i < 4; i++) {
      players[i] = {
        score: 0,
        color: colors[i],
        colorIndex: i
      };
      spawnPoint(api,i);
    }




  }




  switch (introStatus) {
    case 0:
      api.blank(0,0,0);

      // minus
      if(api.isTouchInBounds(1,api.getScreenHeight()-4,3,1)) {
        api.setDrawColor(255,0,255);
        if(!btnPressMinus) numPlayers--;
        btnPressMinus = true;
      } else {
        api.setDrawColor(255,255,255);
        btnPressMinus = false;
      }
      api.fillBox(1,api.getScreenHeight()-4,3,1);

      // plus
      if(api.isTouchInBounds(5,api.getScreenHeight()-5,3,3)) {
        api.setDrawColor(255,0,255);
        if(!btnPressPlus && numPlayers < 4) {
          numPlayers++;
          setPlayerColor(numPlayers-1);
        }
        btnPressPlus = true;
      } else {
        api.setDrawColor(255,255,255);
        btnPressPlus = false;
      }
      api.fillBox(5,api.getScreenHeight()-4,3,1);
      api.fillBox(6,api.getScreenHeight()-5,1,3);

      // play
      api.setDrawColor(0,255,0);
      api.fillBox(api.getScreenWidth()/2-1,api.getScreenHeight()-6,1,5);
      api.fillBox(api.getScreenWidth()/2,api.getScreenHeight()-5,1,3);
      api.fillBox(api.getScreenWidth()/2+1,api.getScreenHeight()-4,1,1);
      if(api.isTouchInBounds(api.getScreenWidth()/2-1,api.getScreenHeight()-6,3,5)) {
        introStatus = 1;
        api.clearInputs();
      }

      // exit
      api.setDrawColor(255,0,0);
      api.fillBox(api.getScreenWidth()-5,api.getScreenHeight()-5,3,3);
      if(api.isTouchInBounds(api.getScreenWidth()-5,api.getScreenHeight()-5,3,3)) {
        api.exit();
      }

      // players
      if(numPlayers > 4) numPlayers = 4;
      if(numPlayers < 2) numPlayers = 2;

      for (let i = 0; i < numPlayers; i++) {
        api.setDrawColor(players[i].color);
        api.fillBox(api.getScreenWidth()/2 - numPlayers*2 + i*4 + 1,2,2,2);
        if(api.isTouchInBounds(api.getScreenWidth()/2 - numPlayers*2 + i*4 + 1,2,2,2)) {
          if(!btnPressPlayer[i]) setPlayerColor(i);
          btnPressPlayer[i] = true;
        } else {
          btnPressPlayer[i] = false;
        }
      }


      break;

    case 1:
      //explode screen
      //api.playWav('sfx_exp_short_hard15');
      screenToGibs(api);
      introStatus++;
      introTicks=0;
      break;

    case 2:
      introTicks++;
      api.blank(0,0,0);
      animateGibs(api);
      if(introTicks === 60) {
        gibs = [];
        introStatus++;
      }
      break;

    case 3:

      gameStatus=1;
      api.clearInputs();


      gibs=[];
    }

}

function gamePlay(api) {
  //playing game

  //draw background

  api.setDrawColor(0,0,0, 0.9);
  api.fillBox(0,1,api.getScreenWidth(),api.getScreenHeight());

  api.setDrawColor(100,100,100);
  api.fillBox(0,0,api.getScreenWidth(),1);


  const touches = api.getTouch();

  //draw gibs
  animateGibs(api);

  let totalScore = 0;


  for(let i=0; i < players.length; i++) {

    //draw point
    api.setDrawColor(players[i].color);
    api.setPixel(players[i].point.x, players[i].point.y);
    //draw twinkle
    api.setDrawColor(255,255,255,0.2  );
    if(scoreTwinkle %pointTwinkleSpeed < pointTwinkleSpeed/4) api.setPixel(players[i].point.x, players[i].point.y);

    //check if point touched
    for(let j=0; j < touches.length; j++) {
      if(players[i].point.x === touches[j].x && players[i].point.y === touches[j].y) {
        players[i].score++;
        api.playWav('sfx_coin_single1');
        spawnPoint(api,i);
      }
    }

    //draw scores
    api.setDrawColor(players[i].color);

    switch (i) {
      case 0:
        api.fillBox(0,0,players[i].score,1);
        //draw twinkle
        api.setDrawColor(255,255,255,0.3);
        if(scoreTwinkle <= players[i].score) api.setPixel(scoreTwinkle,0);
        break;
      case 1:
        api.fillBox(api.getScreenWidth()-players[i].score,0,players[i].score,1);
        //draw twinkle
        api.setDrawColor(255,255,255,0.3);
        if(scoreTwinkle <= players[i].score) api.setPixel(api.getScreenWidth() - scoreTwinkle,0);
        break;
    }




    //check for winner
    if(players[i].score >= 16) {
      api.clearInputs();
      gameStatus=2;
      api.playWav('sfx_sounds_powerup1');
    }



  }


  scoreTwinkle++;
  if(scoreTwinkle > 64) scoreTwinkle = 0;


}

function gameOver(api) {

  gameOverTicks++;

  if(gameOverTicks < 90) api.clearInputs();

  //work out the winner
  let score = 0;
  let winner;

  for(let i=0; i < players.length; i++){
    if(players[i].score > score) {
      score = players[i].score;
      winner = i;
    }
  }

  animateGibs(api);

  api.blank(players[winner].color.r,players[winner].color.g,players[winner].color.b);
  api.setDrawColor(0, 0, 0);
  const bounds = api.textBounds('WIN');
  api.text('WIN', (api.getScreenWidth()-bounds.w)/2, (api.getScreenHeight()-bounds.h)/2);
  if (api.getTouch().length) {
      gameStatus = 0;
      hasRun = false;

  }

}


function animateGibs(api) {
  if(gibs.length && gibs[0].y+scroll > api.getScreenHeight()){
    gibs.shift();
  }
  for (let i = 0; i < gibs.length; i++) {
      api.setDrawColor(gibs[i]);
      api.setPixel(gibs[i].x, gibs[i].y);
      //movement
      gibs[i].x+=gibs[i].vX;
      gibs[i].y+=gibs[i].vY;
      //gravity
      gibs[i].vY+=gravity;
      //fade
      //gibs[i].a-=16;
  }
}

function screenToGibs(api) {
  for (let y = 0; y < api.getScreenHeight(); y++) {
      for (let x = 0; x < api.getScreenWidth(); x++) {
          let i = y * api.getScreenWidth() + x;
          let r = api.getBuffer()[i * 3];
          let g = api.getBuffer()[i * 3 + 1];
          let b = api.getBuffer()[i * 3 + 2];
          spawnGib(x,y,Math.round(Math.random()),r,g,b);
      }
  }
}

function spawnPoint(api,player) {

  players[player].point = {
    x: Math.floor(Math.random()*api.getScreenWidth()/2+api.getScreenWidth()/2*player),
    y: Math.floor(Math.random()*(api.getScreenHeight()-2)+2),

  }

}

function setPlayerColor(player) {

  let inUse;


  do {
    inUse = false;
    players[player].colorIndex++;

    if (players[player].colorIndex >= colors.length) players[player].colorIndex = 0;
    for (let i = 0; i < numPlayers; i++) {
      if (players[player].colorIndex === players[i].colorIndex && player !== i ) inUse = true;

    }
  } while(inUse);

  players[player].color = colors[players[player].colorIndex];

}

function spawnGib(x,y,left,r,g,b) {
  let vX = -0.8 + (Math.random()*0.5);
  let vY =  -2 + (Math.random());
  if(!left) {
    vX*= -1;
  }

  gibs.push({
      x: x,
      y: y,
      vX: vX,
      vY: vY,
      r: r,
      g: g,
      b: b,
      a: 1
  });
}
