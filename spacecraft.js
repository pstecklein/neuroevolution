class Spacecraft {
  constructor(brain) {
    // Physics, graphics
    this.color = "rgba(250, 50, 50, 0.3)";
    this.width = 8;
    this.height = 20;
    this.x = 20;
    this.y = 300;
    this.speedX = 1;
    // start with a boost, simulate a real launch
    this.speedY = -4;
    this.gravity = 0.09;
    this.score = 0;
    this.fitness_normalized = 0;
    if (brain) {
      this.brain = [brain[0].copy(), brain[1].copy()];
    } else {
      this.brain = [new NeuralNetwork(4, 3, 2), new NeuralNetwork(4, 3, 2)];
    }
  }

  update() {
    var ctx = world.context;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  newPosition() {
    this.x += this.speedX;
    this.speedY += this.gravity;
    this.y += this.speedY;
  }

  dispose() {
    this.brain[0].dispose();
    this.brain[1].dispose();
  }

  mutate() {
    this.brain[0].mutate(0.1);
    this.brain[1].mutate(0.1);
  }

  predictThrust() {
    let inputs = [];
    //Need to normalize
    inputs[0] = this.y / 400;
    inputs[1] = this.x / 700;
    inputs[2] = this.speedX / 10;
    inputs[3] = this.speedY / 10;
    let output = this.brain[0].predict(inputs);
    if (output[0] > output[1]) {
      this.speedY += -1;
    }
  }

  predictLateral() {
    let inputs = [];
    //Need to normalize
    inputs[0] = this.y / 400;
    inputs[1] = this.x / 700;
    inputs[2] = this.speedX / 10;
    inputs[3] = this.speedY / 10;
    let output = this.brain[1].predict(inputs);
    if (output[0] > output[1]) {
      this.speedX += -0.001;
    } else {
      this.speedX += 0.001;
    }
  }

  offScreen() {
    return (
      this.y > world.canvas.height ||
      this.y < 0 ||
      this.x > world.canvas.width ||
      this.x < 0
    );
  }

  crash(landingPad) {
    if (
      this.y + this.height < landingPad.y ||
      this.y > landingPad.y + landingPad.height ||
      this.x + this.width < landingPad.x ||
      this.x > landingPad.x + landingPad.width
    ) {
      return false;
    } else if (
      this.x < landingPad.x ||
      this.x + this.width > landingPad.x + landingPad.width
    ) {
      return true;
    } else {
      return false;
    }
  }

  badLanding(landingPad) {
    if (
      this.y + this.height < landingPad.y ||
      this.y > landingPad.y + landingPad.height ||
      this.x + this.width < landingPad.x ||
      this.x > landingPad.x + landingPad.width
    ) {
      return false;
    } else if (
      this.x < landingPad.x ||
      this.x + this.width > landingPad.x + landingPad.width
    ) {
      return false;
    } else if (Math.abs(this.speedX) < 1.5 && this.speedY > -1.5) {
      return false;
    } else {
      return true;
    }
  }

  checkLanding(landingPad) {
    if (
      this.y + this.height < landingPad.y ||
      this.y > landingPad.y + landingPad.height ||
      this.x + this.width < landingPad.x ||
      this.x > landingPad.x + landingPad.width
    ) {
      return false;
    } else if (
      this.x < landingPad.x ||
      this.x + this.width > landingPad.x + landingPad.width ||
      Math.abs(this.speedX) > 1.5 ||
      Math.abs(this.speedY) > 1.5
    ) {
      return false;
    } else {
      return true;
    }
  }
}
