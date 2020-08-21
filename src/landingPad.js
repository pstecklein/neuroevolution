class LandingPad {
  constructor(brain) {
    // Graphics
    this.color = "rgba(50, 50, 50, 0.8)";
    this.width = 80;
    this.height = 15;
    this.x = 540;
    this.y = world.canvas.height - 15;
  }

  update() {
    var ctx = world.context;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
