class Cannon {
    constructor(x, y, width, height, angle) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.angle = angle;
        this.cannonTop = loadImage("assets/canon.png");
        this.canonBase = loadImage("assets/cannonBase.png");
    }

    display() {
        //console.log(this.angle);

        if (keyIsDown(LEFT_ARROW) && this.angle > -30) {
            this.angle -= 1;
        }
        if (keyIsDown(RIGHT_ARROW) && this.angle < 70) {
            this.angle += 1;
        }

        // Cannon Top
        push();
        translate(this.x, this.y);
        rotate(this.angle);
        imageMode(CENTER);
        image(this.cannonTop, 0, 0, this.width, this.height);
        pop();

        // Cannon Base
        image(this.canonBase, 60, 20, 200, 200);
        noFill();
    }
}