class Bullet extends Phaser.GameObjects.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'bomb')
        this.speed = 0;
        this.born = 0;
    }

    fire(player, data) {
        this.selectedSide = data.selectedSide;
        this.setPosition(player.x, player.y);
        this.speed = Phaser.Math.GetSpeed(data.v * 1000 + player.vel.x, 1)
        this.born = 0;
    }

    update(time, delta) {
        this.x += this.speed * delta;
        this.born += delta;
        if (this.born > 5000) {
            this.setActive(false);
            this.setVisible(false);
        }
        if ((this.selectedSide == "rightSide" && this.x < 0) || 
            (this.selectedSide == "leftSide" && this.x > window.innerWidth)) {
            
            console.log("hit border");
            let x = this.emit("hitBorder", {
                y: this.y,
                velocity: this.speed,
                type: "projectile"
            });

            this.setActive(false);
            this.setVisible(false);
        }
    }
}