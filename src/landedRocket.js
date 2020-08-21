class LandedRocket {
  constructor(x) {
    // Graphics
    this.color = "rgba(50, 200, 100, 0.6)";
    this.width = 8;
    this.height = 20;
    this.x = x;
    this.y = world.canvas.height - this.height - 15;
  }

  update() {
    var ctx = world.context;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
