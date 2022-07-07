let startGame = false;
let selectedCharacter = 1;
let character2Unlocked = false;
let character3Unlocked = false;
$('.play-game').click(() => {
  $('.game-area').removeClass('d-none');
  $('.game-area').addClass('d-flex');
  startGame = true;
  animate();
});
$('.pause-game').click(() => {
  if (gamePaused) {
    $('.pause-game').html('Pause game');
    console.log('pause');
    gamePaused = false;
    animate();
  } else if (!gamePaused) {
    gamePaused = true;
    $('.pause-game').html('Restart game');
  }
  if (gameOver) {
    $('.pause-game').html('Pause game');
    score = 0;
    coins = 0;
    gameOver = false;
    animate();
  }
});
const backgroundMusic = document.createElement('audio');
backgroundMusic.src = 'background.mp3';

//Canvas setup
// function handleMusic() {
//   if (typeof backgroundMusic.loop == 'boolean') {
//     backgroundMusic.loop = true;
//   } else {
//     backgroundMusic.addEventListener(
//       'ended',
//       function () {
//         this.currentTime = 0;
//         this.play();
//       },
//       false
//     );
//   }
// }

backgroundMusic.play();
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let coins = 0;

let gameFrame = 0;
let gameOver = false;
let gamePaused = false;
let characterSpeed = 2;

let gameSpeed = 1;
let coinIncreaseRound = 1;

let powerUpScore = 1;
let powerUpCoins = 0;

// ctx.font = '20px Courier New';
let myFont = new FontFace('PressStart2P', `url('./PressStart2P-Regular.ttf')`);

myFont.load().then((font) => {
  document.fonts.add(font);
  console.log('Font loaded');
  ctx.font = '1rem PressStart2P';
});

//Mouse interactivity
let canvasPosition = canvas.getBoundingClientRect();

const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  click: false,
};

canvas.addEventListener('mousedown', (e) => {
  mouse.click = true;
  mouse.x = e.clientX - canvasPosition.left;
  mouse.y = e.clientY - canvasPosition.top;
});

canvas.addEventListener('mouseup', (e) => {
  mouse.click = false;
});
// Player
let playerLeft;
let playerRight;
let charaterSpriteWidth;
let charaterSpriteHeight;
function setCharacter() {
  if (selectedCharacter == 1) {
    playerLeft = new Image();
    playerLeft.src = './Monster/animations/run/run.png';

    playerRight = new Image();
    playerRight.src = './Monster/animations/run/run-left.png';
    charaterSpriteWidth = 575;
    charaterSpriteHeight = 542;
  } else if (selectedCharacter == 2) {
    playerLeft = new Image();
    playerLeft.src =
      './Monster/Monster2/pngs/spritesheets/wiggle-to-left-512px-by-512px-per-frame.png';

    playerRight = new Image();
    playerRight.src =
      './Monster/Monster2/pngs/spritesheets/wiggle-to-right-512px-by-512px-per-frame.png';
    charaterSpriteWidth = 512;
    charaterSpriteHeight = 512;
  } else if (selectedCharacter == 3) {
    playerLeft = new Image();
    playerLeft.src =
      './Monster/Monster3/animations/run/run-590px-by-592px-per-frame.png';

    playerRight = new Image();
    playerRight.src =
      './Monster/Monster3/animations/run/run-right-590px-by-592px-per-frame.png';
    charaterSpriteWidth = 590;
    charaterSpriteHeight = 592;
  }
}

let isPlayerRunning = false;

class Player {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.radius = 50;
    this.angle = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = charaterSpriteWidth;
    this.spriteHeight = charaterSpriteHeight;
  }
  update() {
    const dx = this.x - mouse.x; //distance on the x axis
    const dy = this.y - mouse.y; //distance on y axis
    if (mouse.x != this.x) {
      this.x -= (dx / 20) * characterSpeed;
    }
    if (mouse.y != this.y) {
      this.y -= (dy / 20) * characterSpeed;
    }
    this.spriteWidth = charaterSpriteWidth;
    this.spriteHeight = charaterSpriteHeight;

    if (selectedCharacter == 1 || selectedCharacter == 3) {
      if (gameFrame % 5 == 0) {
        this.frame >= 16 ? (this.frame = 0) : this.frame++;
        if (
          this.frame == 3 ||
          this.frame == 7 ||
          this.frame == 11 ||
          this.frame == 15
        ) {
          this.frameX = 0;
        } else {
          this.frameX++;
        }

        if (this.frame < 3) {
          this.frameY = 0;
        } else if (this.frame < 7) {
          this.frameY = 1;
        } else if (this.frame < 11) {
          this.frameY = 2;
        } else if (this.frame < 15) {
          this.frameY = 3;
        } else {
          this.frameY = 0;
        }
      }
    } else {
      if (gameFrame % 5 == 0) {
        this.frame >= 10 ? (this.frame = 0) : this.frame++;
        if (this.frame == 3 || this.frame == 7 || this.frame == 9) {
          this.frameX = 0;
        } else {
          this.frameX++;
        }

        if (this.frame < 3) {
          this.frameY = 0;
        } else if (this.frame < 7) {
          this.frameY = 1;
        } else if (this.frame < 9) {
          this.frameY = 2;
        } else {
          this.frameY = 0;
        }
      }
    }
  }

  draw() {
    if (mouse.click) {
      isPlayerRunning = true;
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
    ctx.fillStyle = 'trasparent';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.fillRect(this.x, this.y, this.radius, 10);

    //args:
    // 1.image we want to draw
    // 2-5 area we want to crop out from the source spreadsheet (x, y, width, height)
    // 6-9: where on the destination canvas I want to place the image
    if (this.x <= mouse.x) {
      ctx.drawImage(
        playerRight,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.x - 48,
        this.y - 60,
        this.spriteWidth / 5,
        this.spriteHeight / 5
      );
    } else {
      ctx.drawImage(
        playerLeft,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.x - 48,
        this.y - 60,
        this.spriteWidth / 5,
        this.spriteHeight / 5
      );
    }
  }
}
setCharacter();

const player = new Player();
// Donuts
//blue & brown-drizzle: 1px; green& orange: 2pt, white&red: 3pt, pink: 4pt
const blueDonut = new Image();
blueDonut.src = './Donuts/pngs/blue_icing.png';
const brownDonut = new Image();
brownDonut.src = './Donuts/pngs/chocolate_icing_chocolate_drizzle.png';
const greenDonut = new Image();
greenDonut.src = './Donuts/pngs/green_icing_green_sprinkles.png';
const orangeDonut = new Image();
orangeDonut.src = './Donuts/pngs/orange_icing_chocolate_shaving.png';
const whiteDonut = new Image();
whiteDonut.src = './Donuts/pngs/white_icing_sprinkles.png';
const redDonut = new Image();
redDonut.src = './Donuts/pngs/red_icing_white_sprinkles.png';
const pinkDonut = new Image();
pinkDonut.src = './Donuts/pngs/pink_icing_sprinkles.png';

function getRandomDonut() {
  donutProps = { color: '', points: 0 };
  let donut = Math.random();
  if (donut <= 0.6) {
    Math.random() <= 0.5
      ? (donutProps = { color: 'blue', points: 1 })
      : (donutProps = { color: 'brown', points: 1 });
  } else if (donut <= 0.8) {
    Math.random() <= 0.5
      ? (donutProps = { color: 'green', points: 2 })
      : (donutProps = { color: 'orange', points: 2 });
  } else if (donut <= 0.95) {
    Math.random() <= 0.5
      ? (donutProps = { color: 'white', points: 3 })
      : (donutProps = { color: 'red', points: 3 });
  } else {
    donutProps = { color: 'pink', points: 4 };
  }

  return donutProps;
}
const donutsArray = [];
class Donut {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100 + Math.random() * canvas.height;

    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = 544;
    this.spriteHeight = 457;

    this.radius = 30;
    this.speed = Math.random() * 5 + 1;
    this.distance;
    this.counted = false;
    this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
    this.donutType = getRandomDonut();
  }

  update() {
    this.y -= this.speed;
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    this.distance = Math.sqrt(dx * dx + dy * dy);
  }
  draw() {
    ctx.fillStyle = 'transparent';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    if (this.donutType.color == 'brown') {
      ctx.drawImage(
        brownDonut,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.x - 30,
        this.y - 25,
        this.spriteWidth / 9,
        this.spriteHeight / 9
      );
    } else if (this.donutType.color == 'blue') {
      ctx.drawImage(
        blueDonut,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.x - 30,
        this.y - 25,
        this.spriteWidth / 9,
        this.spriteHeight / 9
      );
    } else if (this.donutType.color == 'orange') {
      ctx.drawImage(
        orangeDonut,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.x - 30,
        this.y - 25,
        this.spriteWidth / 9,
        this.spriteHeight / 9
      );
    } else if (this.donutType.color == 'green') {
      ctx.drawImage(
        greenDonut,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.x - 30,
        this.y - 25,
        this.spriteWidth / 9,
        this.spriteHeight / 9
      );
    } else if (this.donutType.color == 'white') {
      ctx.drawImage(
        whiteDonut,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.x - 30,
        this.y - 25,
        this.spriteWidth / 9,
        this.spriteHeight / 9
      );
    } else if (this.donutType.color == 'red') {
      ctx.drawImage(
        redDonut,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.x - 30,
        this.y - 25,
        this.spriteWidth / 9,
        this.spriteHeight / 9
      );
    } else {
      ctx.drawImage(
        pinkDonut,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.x - 30,
        this.y - 25,
        this.spriteWidth / 9,
        this.spriteHeight / 9
      );
    }
  }
}

const sound1 = document.createElement('audio');
sound1.src = 'chewing1.wav';

const sound2 = document.createElement('audio');
sound2.src = 'non_nom.wav';

function handleDonuts() {
  if (gameFrame % 50 === 0) {
    donutsArray.push(new Donut());
  }
  for (let i = 0; i < donutsArray.length; i++) {
    donutsArray[i].update();
    donutsArray[i].draw();

    if (donutsArray[i].y < 0 - donutsArray[i].radius * 2) {
      donutsArray.splice(i, 1);
      i--;
    } else if (
      donutsArray[i].distance <
      donutsArray[i].radius + player.radius
    ) {
      if (!donutsArray[i].counted) {
        if (donutsArray[i].sound === 'sound1') {
          sound1.play();
        } else {
          sound2.play();
        }
        score += donutsArray[i].donutType.points * powerUpScore;
        console.log('score:', score, ' powerupscore: ', powerUpScore);

        if (score >= 50 * coinIncreaseRound) {
          coinIncreaseRound++;
          coins += 5;
        }

        if (coins >= 10 && !character2Unlocked) {
          $('.character-2').removeAttr('disabled');

          character2Unlocked = true;
        }
        if (coins >= 20 && !character3Unlocked) {
          character3Unlocked = true;
          $('.character-3').removeAttr('disabled');
        }

        $('#actual-score').html(score);

        donutsArray[i].counted = true;
        donutsArray.splice(i, 1);
        i--;
      }
    }
  }
}

// coins
const coinImage = new Image();
coinImage.src = './Coins/01.png';

const coinsArray = [];
class Coin {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100 + Math.random() * canvas.height;

    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = 149;
    this.spriteHeight = 149;

    this.radius = 10;
    this.speed = Math.random() * 10 + 1;
    this.distance;
    this.counted = false;
    this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
  }

  update() {
    this.y -= this.speed;
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    this.distance = Math.sqrt(dx * dx + dy * dy);
  }
  draw() {
    ctx.fillStyle = 'transparent';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.drawImage(
      coinImage,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x - 9,
      this.y - 7,
      this.spriteWidth / 8,
      this.spriteHeight / 8
    );
  }
}

const coinSound1 = document.createElement('audio');
sound1.src = 'chewing1.wav';

const coinSound2 = document.createElement('audio');
sound2.src = 'non_nom.wav';

function handleCoins() {
  if (gameFrame % 150 === 0) {
    coinsArray.push(new Coin());
  }
  for (let i = 0; i < coinsArray.length; i++) {
    coinsArray[i].update();
    coinsArray[i].draw();

    if (coinsArray[i].y < 0 - coinsArray[i].radius * 2) {
      coinsArray.splice(i, 1);
      i--;
    } else if (coinsArray[i].distance < coinsArray[i].radius + player.radius) {
      if (!coinsArray[i].counted) {
        if (coinsArray[i].sound === 'sound1') {
          // coinSound1.play();
        } else {
          // coinSound2.play();
        }
        coins += 1 + powerUpCoins;
        $('#actual-coins').html(coins);

        coinsArray[i].counted = true;
        coinsArray.splice(i, 1);
        i--;
      }
    }
  }
}

//powerups

// Donuts
//2x speed for 10s
//3x speed for 10s
//2x points for 10s
const speed2Image = new Image();
speed2Image.src = './Powerups/speed-x2.png';
const speed3Image = new Image();
speed3Image.src = './Powerups/speed-x3.png';
const points2Image = new Image();
points2Image.src = './Powerups/points-x2.png';

function getRandomPowerup() {
  powerupProps = { type: '', time: 0 };
  let powerup = Math.random();
  if (powerup <= 0.6) {
    powerupProps = { type: 'speed2', time: 10000 };
  } else if (powerup <= 0.8) {
    powerupProps = { type: 'speed3', time: 10000 };
  } else {
    powerupProps = { type: 'points2', time: 10000 };
  }
  return powerupProps;
}
const powerupsArray = [];
class Powerup {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100 + Math.random() * canvas.height;

    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = 93;
    this.spriteHeight = 88;

    this.radius = 10;
    this.speed = Math.random() * 10 + 1;
    this.distance;
    this.counted = false;
    this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
    this.powerupType = getRandomPowerup();
  }

  update() {
    this.y -= this.speed;
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    this.distance = Math.sqrt(dx * dx + dy * dy);
  }
  draw() {
    ctx.fillStyle = 'transparent';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    if (this.powerupType.type == 'speed2') {
      ctx.drawImage(
        speed2Image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.x - 10,
        this.y - 11,
        this.spriteWidth / 4,
        this.spriteHeight / 4
      );
    } else if (this.powerupType.type == 'speed3') {
      ctx.drawImage(
        speed3Image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.x - 10,
        this.y - 11,
        this.spriteWidth / 4,
        this.spriteHeight / 4
      );
    } else if (this.powerupType.type == 'points2') {
      ctx.drawImage(
        points2Image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.x - 10,
        this.y - 11,
        this.spriteWidth / 4,
        this.spriteHeight / 4
      );
    }
  }
}

const powerupSound1 = document.createElement('audio');
sound1.src = 'chewing1.wav';

const powerupSound2 = document.createElement('audio');
sound2.src = 'non_nom.wav';

function handlePowerups() {
  if (gameFrame % 1000 === 0) {
    powerupsArray.push(new Powerup());
  }
  for (let i = 0; i < powerupsArray.length; i++) {
    powerupsArray[i].update();
    powerupsArray[i].draw();

    if (powerupsArray[i].y < 0 - powerupsArray[i].radius * 2) {
      powerupsArray.splice(i, 1);
      i--;
    } else if (
      powerupsArray[i].distance <
      powerupsArray[i].radius + player.radius
    ) {
      if (!powerupsArray[i].counted) {
        if (powerupsArray[i].sound === 'sound1') {
          // powerupSound1.play();
        } else {
          // powerupSound2.play();
        }
        if (powerupsArray[i].powerupType.type == 'speed2') {
          $('.speedx2').removeClass('d-none');
          characterSpeed = 2;
          setTimeout(() => {
            characterSpeed = 1;
            $('.speedx2').addClass('d-none');
          }, powerupsArray[i].powerupType.time);
        } else if (powerupsArray[i].powerupType.type == 'speed3') {
          $('.speedx3').removeClass('d-none');

          characterSpeed = 3;
          setTimeout(() => {
            characterSpeed = 1;
            $('.speedx3').addClass('d-none');
          }, powerupsArray[i].powerupType.time);
        } else if (powerupsArray[i].powerupType.type == 'points2') {
          $('.pointsx2').removeClass('d-none');

          powerUpScore = 2;
          setTimeout(() => {
            $('.pointsx2').addClass('d-none');

            powerUpScore = 1;
          }, powerupsArray[i].powerupType.time);
        }

        powerupsArray[i].counted = true;
        powerupsArray.splice(i, 1);
        i--;
      }
      console.log(powerupsArray);
    }
  }
}

//Background

const background1 = new Image();
background1.src = './Background/noonbackground.png';

const background2 = new Image();
background2.src = './Background/noonbackground.png';

const BG = {
  x1: 0,
  x2: canvas.width,
  y: 0,
  width: canvas.width,
  height: canvas.height,
};

function handleBckground() {
  BG.x1 -= gameSpeed;
  if (BG.x1 < -BG.width) BG.x1 = canvas.width;
  ctx.drawImage(background1, BG.x1, BG.y, BG.width, BG.height);

  BG.x2 -= gameSpeed;
  if (BG.x2 < -BG.width) BG.x2 = canvas.width;
  ctx.drawImage(background2, BG.x2, BG.y, BG.width, BG.height);
}

//Enemy

const enemyImage = new Image();
enemyImage.src =
  'Enemies/FlyingMonster/spritesheets/__flying_monster_three_blue_fly_snapping.png';

class Enemy {
  constructor() {
    this.x = canvas.width + 10;
    this.y = Math.random() * (canvas.height - 150) + 90;
    this.radius = 50;
    this.speed = Math.random() * 2 + 2;
    this.frame = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.spriteWidth = 797;
    this.spriteHeight = 921;
  }
  draw() {
    ctx.fillStyle = 'transparent';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    ctx.drawImage(
      enemyImage,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x - 70,
      this.y - 120,
      this.spriteWidth / 5,
      this.spriteHeight / 5
    );
  }
  update() {
    this.x -= this.speed;
    if (this.x < 0 - this.radius * 2) {
      this.x = canvas.width + this.radius * 2 + 10;
      this.y = Math.random() * (canvas.height - 150) + 90;
      this.speed = Math.random() * 2 + 2;
    }

    const dx = this.x - player.x;
    const dy = this.y - player.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.radius + player.radius) {
      handleGameOver();
    }

    if (gameFrame % 5 == 0) {
      this.frame >= 10 ? (this.frame = 0) : this.frame++;
      if (this.frame == 4 || this.frame == 9) {
        this.frameX = 0;
      } else {
        this.frameX++;
      }

      if (this.frame < 4) {
        this.frameY = 0;
      } else if (this.frame < 9) {
        this.frameY = 1;
      } else {
        this.frameY = 0;
      }
    }
  }
}

function handleGameOver() {
  ctx.fillStyle = '#d13068';
  ctx.fillText(`Game Over, you reached the score ${score}`, 100, 200);
  console.log(`Game Over, you reached the score ${score}`);
  gameOver = true;
}

const enemy = new Enemy();

function handleEnemies() {
  enemy.draw();
  enemy.update();
}

//new characters
$('.character-1').on('click', (e) => {
  $('.character-1').attr('disabled', true);
  $('.character-1').html('selected');
  if (character2Unlocked) {
    $('.character-2').removeAttr('disabled');
    $('.character-2').html('select');
  }
  if (character3Unlocked) {
    $('.character-3').removeAttr('disabled');
    $('.character-3').html('select');
  }

  selectedCharacter = 1;
  setCharacter();
});

$('.character-2').on('click', (e) => {
  if (character2Unlocked && selectedCharacter != 2) {
    $('.character-1').removeAttr('disabled');
    $('.character-1').html('select');

    $('.character-2').attr('disabled', true);
    $('.character-2').html('selected');

    if (character3Unlocked) {
      $('.character-3').removeAttr('disabled');
      $('.character-3').html('select');
    }
    selectedCharacter = 2;
    setCharacter();
  }
});
$('.character-3').on('click', (e) => {
  if (character3Unlocked && selectedCharacter != 3) {
    $('.character-1').removeAttr('disabled');
    $('.character-1').html('select');

    $('.character-2').removeAttr('disabled');
    $('.character-2').html('select');

    $('.character-3').attr('disabled'.true);
    $('.character-3').html('selected');

    selectedCharacter = 3;
    setCharacter();
  }
});

// Animation loop

function animate() {
  if (selectedCharacter != 1) {
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleBckground();
  handleDonuts();
  handleCoins();
  player.update();
  player.draw();
  handleEnemies();
  handlePowerups();
  backgroundMusic.play();
  // ctx.fillStyle = 'black';
  // ctx.fillText(`Score: ${score}`, 30, 30);
  $('#actual-score').html(score);
  $('#actual-coins').html(coins);

  gameFrame++;
  if (!gameOver && !gamePaused) {
    requestAnimationFrame(animate);
  } else if (gameOver) {
    $('.pause-game').html('Start again');
  }
}

window.addEventListener('resize', () => {
  canvasPosition = canvas.getBoundingClientRect();
});
