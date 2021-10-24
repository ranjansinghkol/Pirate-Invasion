class CannonBall {
    constructor(x, y) {
        var options = {
            isStatic: true
        };

        this.r = 30;
        this.body = Bodies.circle(x, y, this.r, options);
        this.image = loadImage("./assets/cannonball.png");
        World.add(world, this.body);

        this.trajectory = [];
        this.speed = 0.05;
        this.animation = [this.image];

        this.isSink = false;
    }

    animate() {
        this.speed += 0.05;
    }

    shoot() {
        var newAngle = cannon.angle - 28;
        newAngle = newAngle * (3.14 / 180)
        var velocity = p5.Vector.fromAngle(newAngle);
        velocity.mult(0.5);
        Matter.Body.setStatic(this.body, false);
        Matter.Body.setVelocity(this.body, {
            x: velocity.x * (180 / 3.14),
            y: velocity.y * (180 / 3.14)
        })
    }

    remove(index) {
        this.isSink = true;
        this.animation = water_splash_animations;
        this.speed = 0.05;
        this.r = 150;

        Matter.Body.setVelocity(this.body, {
            x: 0,
            y: 0
        });

        setTimeout(() => {
            World.remove(world, this.body);
            delete balls[index];
        }, 1000);
    }

    display() {
        //var angle = this.body.angle;
        var pos = this.body.position;
        var index = floor(this.speed % this.animation.length);

        push();
        imageMode(CENTER);
        image(this.animation[index], pos.x, pos.y, this.r, this.r);
        pop();

        // Additional Activity
        if (this.body.velocity.x > 0 && pos.x > 10 && !this.isSink) {
            var position = [pos.x, pos.y];
            this.trajectory.push(position);
        }

        for (var i = 0; i < this.trajectory.length; i++) {
            image(this.image, this.trajectory[i][0], this.trajectory[i][1], 5, 5);
        }
    }
}