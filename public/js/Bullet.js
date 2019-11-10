class Bullet extends Phaser.GameObjects.Image {
    

    constructor(scene, x, y) {
        super(scene, x, y, 'bomb')
        

        this.speed = 0;
        this.born = 0;
    }

    // create() {
    //     //Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bomb');
    // }

    fire(player) {
        console.log("Hi from bullet");
        this.setPosition(player.x, player.y);
        this.speed = Phaser.Math.GetSpeed(1000 + player.vel.x, 1)
        this.born = 0;
    }

    update(time, delta) {
        this.x += this.speed * delta;
        this.born += delta;
        if (this.born > 1000) {
            this.setActive(false);
            this.setVisible(false);
            console.log("Bye from bullet");
        }
    }
}