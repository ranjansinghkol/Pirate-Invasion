class Boat {
    constructor(x, y, width, height, boatPos, boat_animations) {
        this.width = width;
        this.height = height;
        this.boatPos = boatPos;

        this.animations = boat_animations;
        this.animation_speed = 0.05;

        this.isBroken = false;

        this.body = Bodies.rectangle(x, y, this.width, this.height);
        this.image = loadImage("assets/boat.png");

        World.add(world, this.body);
    }

    animate() {
        this.animation_speed += 0.05
    }

    remove(index) {
        this.animations = broken_boat_animations;
        this.isBroken = true;
        this.animation_speed = 0.05;
        this.width = 300;
        this.height = 300;

        setTimeout(() => {
            Matter.World.remove(world, this.body);
            delete boats[index];
        }, 2000);
    }

    display() {
        var pos = this.body.position;
        var angle = this.body.angle;
        var index = floor(this.animation_speed % this.animations.length);

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        imageMode(CENTER);
        image(this.animations[index], 0, this.boatPos, this.width, this.height);
        pop();
    }
}