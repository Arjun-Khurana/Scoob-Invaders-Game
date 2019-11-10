class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    preload() {
        this.load.image('star', '../assets/star.png')
        this.load.image('bomb', '../assets/bomb.png')
    }

    create(data) {
        this.player = this.impact.add.sprite(400,300, 'star');
        this.player.setMaxVelocity(1000).setFriction(800, 600).setPassiveCollision();
        this.cursors = this.input.keyboard.createCursorKeys();
        this.bullets = this.add.group({ classType: Bullet, runChildUpdate: true });
        this.lastFired = 0;
        this.side = data.selectedSide;
        this.socket = data.socket;

        if (this.side == "leftSide") {
            this.flip = 1;
        } else if (this.side == "rightSide") {
            this.flip = -1;
        } else {
            console.error("Selected Side not read from Scene1");
        }
    }
      
    update(time,delta) {
        if (this.cursors.left.isDown) {
            this.player.setAccelerationX(-800);
        } else if (this.cursors.right.isDown) {
            this.player.setAccelerationX(800);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.down.isDown) {
            this.player.setAccelerationY(800);
        } else if (this.cursors.up.isDown) {
            this.player.setAccelerationY(-800);
        } else {
            this.player.setVelocityY(0);
        }

        if (this.cursors.space.isDown && time > this.lastFired) {
            //console.log("Hello from fire");
            //console.log(this.bullets);
            let bullet = this.bullets.get();
            bullet.setActive(true);
            bullet.setVisible(true);

            if (bullet) {
                bullet.fire(this.player, {
                    v: this.flip,
                    socket: this.socket
                });
                this.lastFired = 500 + time;
            }
        }
    }

}