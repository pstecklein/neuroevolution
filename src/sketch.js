var spacecrafts = [];
var landedRockets = [];
var spacecraftPool = [];
var timer = 0;

function startGame() {
  world.start();
}

var world = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = 700;
    this.canvas.height = 400;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    tf.setBackend("cpu");
    for (let i = 0; i < 100; i++) {
      spacecrafts[i] = new Spacecraft();
    }
    landingPad = new LandingPad();
    world.run();
  },
  run: function() {
    this.render = setInterval(render, 20);
  },
  stop: function() {
    clearInterval(this.render);
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

const canvas = world.canvas;

function render() {
  timer += 1;
  if (timer > 1000) {
    for (let i = 0; i < spacecrafts.length; i++) {
      spacecrafts[i].score += 0;
      spacecraftPool.push(spacecrafts.splice(i, 1)[0]);
    }
    landedRockets = [];
    timer = 0;
    nextGeneration();
  }
  if (spacecrafts.length === 0) {
    landedRockets = [];
    timer = 0;
    nextGeneration();
  }
  world.clear();
  renderCrafts();
  landingPad.update();

  for (let j = 0; j < spacecrafts.length; j++) {
    if (spacecrafts[j].crash(landingPad)) {
      spacecrafts[j].score += 1;
      spacecraftPool.push(spacecrafts.splice(j, 1)[0]);
    } else if (spacecrafts[j].badLanding(landingPad)) {
      spacecrafts[j].score +=
        1 +
        1000000 /
          Math.pow(
            Math.pow(Math.abs(spacecrafts[j].speedX), 2) +
              Math.pow(Math.abs(spacecrafts[j].speedY), 2),
            0.5
          );
      spacecraftPool.push(spacecrafts.splice(j, 1)[0]);
    } else if (spacecrafts[j].checkLanding(landingPad)) {
      landedRockets.push(new LandedRocket(spacecrafts[j].x));
      spacecrafts[j].score = 10000000;
      spacecraftPool.push(spacecrafts.splice(j, 1)[0]);
    }
  }
}

// Display for the the first robot of the population
function renderCrafts() {
  var ctx = world.context;
  for (let i = 0; i < spacecrafts.length; i++) {
    if (spacecrafts[i].speedY < 0) {
      ctx.beginPath();
      /*
      ctx.moveTo(
        spacecrafts[i].x + spacecrafts[i].width,
        spacecrafts[i].y + spacecrafts[i].height + 2
      );
      ctx.lineTo(
        spacecrafts[i].x + spacecrafts[i].width,
        spacecrafts[i].y + spacecrafts[i].height + 10
      );
      */
      ctx.moveTo(
        spacecrafts[i].x + spacecrafts[i].width / 2,
        spacecrafts[i].y + spacecrafts[i].height + 2
      );
      ctx.lineTo(
        spacecrafts[i].x - 2 + spacecrafts[i].width / 2,
        spacecrafts[i].y + spacecrafts[i].height + 10
      );
      ctx.moveTo(
        spacecrafts[i].x + spacecrafts[i].width / 2,
        spacecrafts[i].y + spacecrafts[i].height + 2
      );
      ctx.lineTo(
        spacecrafts[i].x + spacecrafts[i].width / 2,
        spacecrafts[i].y + spacecrafts[i].height + 10
      );
      ctx.moveTo(
        spacecrafts[i].x + spacecrafts[i].width / 2,
        spacecrafts[i].y + spacecrafts[i].height + 2
      );
      ctx.lineTo(
        spacecrafts[i].x + 2 + spacecrafts[i].width / 2,
        spacecrafts[i].y + spacecrafts[i].height + 10
      );
      /*
      ctx.moveTo(spacecrafts[i].x, spacecrafts[i].y + spacecrafts[i].height + 2);
      ctx.lineTo(spacecrafts[i].x, spacecrafts[i].y + spacecrafts[i].height + 10);
      */
      ctx.strokeStyle = "#ca3";
      ctx.stroke();
    }
    spacecrafts[i].predictThrust();
    spacecrafts[i].predictLateral();
    spacecrafts[i].newPosition();
    spacecrafts[i].update();
    if (spacecrafts[i].offScreen()) {
      spacecrafts[i].score +=
        1 /
        Math.pow(
          Math.pow(
            Math.abs(
              spacecrafts[i].x +
                spacecrafts[i].width / 2 -
                (landingPad.x + landingPad.width / 2)
            ),
            2
          ) +
            Math.pow(
              Math.abs(spacecrafts[i].y + spacecrafts[i].height - landingPad.y),
              2
            ),
          3
        );
      spacecraftPool.push(spacecrafts.splice(i, 1)[0]);
    }
  }
  for (let j = 0; j < landedRockets.length; j++) {
    landedRockets[j].update();
  }
}

// Get x coordinate of object
function checkPosition(i) {
  return i.x;
}

// Gets the time stamp
function getTime() {
  return Date.now();
}

// For testing, click on canvas and log the exact coordinates
function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  console.log("x: " + x + " y: " + y);
}

canvas.addEventListener("mousedown", function(e) {
  getCursorPosition(canvas, e);
});
