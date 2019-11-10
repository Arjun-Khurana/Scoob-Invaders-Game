class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    init() {
        console.log("hello from scene 2");
    }

    preload() {
        this.load.image('star', '../assets/star.png')
        this.load.image('bomb', '../assets/bomb.png')
    }

    create() {
        this.player = this.impact.add.sprite(400,300, 'star');
        this.player.setMaxVelocity(1000).setFriction(800, 600).setPassiveCollision();
        this.cursors = this.input.keyboard.createCursorKeys();
    }
      
    update(time,delta) {
        if (this.cursors.left.isDown) {
            this.player.setAccelerationX(-800);
        }
        else if (this.cursors.right.isDown) {
            this.player.setAccelerationX(800);
        }
        else {
            this.player.setAccelerationX(0);
        }

        if (this.cursors.down.isDown) {
            this.player.setAccelerationY(800);
        }
        else if (this.cursors.up.isDown) {
            this.player.setAccelerationY(-800);
        }
        else {
            this.player.setAccelerationY(0);
        }
    }

}