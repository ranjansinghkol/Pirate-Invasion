const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world, backgroundImg, boat;
var canvas, angle, tower, ground, cannon;
var balls = [];
var boats = [];

var boat_animations = [];
var broken_boat_animations = [];
var water_splash_animations = []
var boat_sprite_sheets, boat_sprite_data, broken_boat_spritesheet, broken_boat_sprite_data, water_splash_spritesheet, water_splash_sprite_data;

var bg_music, cannon_explosion, cannon_water, pirate_laugh;

var score = 0;
var isGameOver = false;
var isLaughing = false;

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  boat_sprite_sheets = loadImage("./assets/boat/boat.png");
  broken_boat_spritesheet = loadImage("./assets/boat/brokenBoat.png");
  water_splash_spritesheet = loadImage("./assets/waterSplash/waterSplash.png");

  boat_sprite_data = loadJSON("./assets/boat/boat.json");
  broken_boat_sprite_data = loadJSON("./assets/boat/brokenBoat.json");
  water_splash_sprite_data = loadJSON("./assets/waterSplash/waterSplash.json");

  bg_music = loadSound("./assets/background_music.mp3");
  cannon_explosion = loadSound("./assets/cannon_explosion.mp3");
  cannon_water = loadSound("./assets/cannon_water.mp3");
  pirate_laugh = loadSound("./assets/pirate_laugh.mp3");
}

function setup() {
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  angleMode(DEGREES)
  angle = 15

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, {
    isStatic: true
  });
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, {
    isStatic: true
  });
  World.add(world, tower);

  cannon = new Cannon(180, 110, 130, 100, angle);

  var boat_frames = boat_sprite_data.frames;
  var broken_boat_frames = broken_boat_sprite_data.frames;
  var water_splash_frames = water_splash_sprite_data.frames;

  for (var i = 0; i < boat_frames.length; i++) {
    var pos = boat_frames[i].position;
    var img = boat_sprite_sheets.get(pos.x, pos.y, pos.w, pos.h);
    boat_animations.push(img);
  }

  for (var i = 0; i < broken_boat_frames.length; i++) {
    var pos = broken_boat_frames[i].position;
    var img = broken_boat_spritesheet.get(pos.x, pos.y, pos.w, pos.h);
    broken_boat_animations.push(img);
  }

  for (var i = 0; i < water_splash_frames.length; i++) {
    var pos = water_splash_frames[i].position;
    var img = water_splash_spritesheet.get(pos.x, pos.y, pos.w, pos.h);
    water_splash_animations.push(img);
  }
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  if (!bg_music.isPlaying()) {
    bg_music.play();
    bg_music.setVolume(0.1);
  }

  Engine.update(engine);

  rect(ground.position.x, ground.position.y, width * 2, 1);

  push();
  imageMode(CENTER);
  image(towerImage, tower.position.x, tower.position.y, 160, 310);
  pop();

  showBoats();

  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);

    checkCollision(i);
  }

  cannon.display();

  textSize(40);
  fill(177);

  text("Score: " + score, width - 200, 50);
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
  }
}

function showCannonBalls(ball, index) {
  if (ball) {
    ball.display();
    ball.animate();
    if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
      cannon_water.play();
      cannon_water.setVolume(0.1);
      ball.remove(index);
    }
  }
}

function showBoats() {
  if (boats.length > 0) {
    if (boats[boats.length - 1] === undefined || boats[boats.length - 1].body.position.x < width - 300) {
      var positions = [-40, -60, -70, -20];
      var position = random(positions);
      var boat = new Boat(width, height - 100, 170, 170, position, boat_animations);

      boats.push(boat);
    }

    for (var i = 0; i < boats.length; i++) {
      if (boats[i]) {
        Matter.Body.setVelocity(boats[i].body, {
          x: -0.9,
          y: 0
        });

        boats[i].display();
        boats[i].animate();

        var collide = Matter.SAT.collides(this.tower, boats[i].body);

        if (collide.collided && !boats[i].isBroken) {
          if (!isLaughing && !pirate_laugh.isPlaying()) {
            pirate_laugh.play();
            pirate_laugh.setVolume(0.1);
            isLaughing = true;
          }

          isGameOver = true;
          gameOver();
        }
      }
    }
  } else {
    var boat = new Boat(width, height - 60, 170, 170, -60, boat_animations);
    boats.push(boat);
  }
}

function checkCollision(index) {
  for (var i = 0; i < boats.length; i++) {
    if (balls[index] != undefined && boats[i] != undefined) {
      var collision = Matter.SAT.collides(balls[index].body, boats[i].body);
      if (collision.collided) {
        score ++;
        boats[i].remove(i);
        balls[index].remove(index);
      }
    }
  }
}

function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    balls[balls.length - 1].shoot();
    cannon_explosion.play();
    cannon_explosion.setVolume(0.1);
  }
}

function gameOver() {
  swal({
    title: `Game Over!`,
    text: `Better Luck Next Time!`,
    imageUrl: "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
    imageSize: `150x150`,
    confirmButtonText: `Restart`
  }, function(isConfirm){
    if (isConfirm) {
      location.reload();
    }
  });
}