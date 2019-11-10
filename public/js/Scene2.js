class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    preload() {
        this.load.image('star', '../assets/star.png')
        this.load.image('bomb', '../assets/bomb.png')
    }

    onCollision() {
        console.log("hit player");
        this.socket.emit(this.side, {
            type: "hitPlayer"
        })
    }

    create(data) {
        this.player = this.impact.add.sprite(400,300, 'star');
        this.player.setMaxVelocity(1000).setFriction(800, 600).setPassiveCollision();
        this.cursors = this.input.keyboard.createCursorKeys();
        this.bullets = this.add.group({ classType: Bullet, runChildUpdate: true });
        this.lastFired = 0;
        this.side = data.selectedSide;
        this.socket = data.socket;
        this.game.physics.impact.collide(this.player, this.bullets, this.onCollision);

        if (this.side == "leftSide") {
            this.flip = 1;
        } else if (this.side == "rightSide") {
            this.flip = -1;
        } else {
            console.error("Selected Side not read from Scene1");
        }
        
        this.socket.on(this.side, (packet) => {
            if (packet.type == "projectile") {
                let bullet = this.bullets.get();
                bullet.setActive(true);
                bullet.setVisible(true);

                if (bullet) {
                    bullet.fire({
                        x: this.side == "leftSide" ? 800 : 0,
                        y: packet.y,
                        vel: {
                            x: 0
                        }
                    }, {
                        v: -this.flip,
                        selectedSide: this.selectedSide,
                        socket: this.socket
                    });
                    this.lastFired = 500 + this.time;
                }
            }
        })
    }
      
    update(time,delta) {
        this.time = time;
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-400);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(400);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.down.isDown) {
            this.player.setVelocityY(400);
        } else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-400);
        } else {
            this.player.setVelocityY(0);
        }

        if (this.cursors.space.isDown && this.time > this.lastFired) {
            //console.log("Hello from fire");
            //console.log(this.bullets);
            let bullet = this.bullets.get();
            bullet.setActive(true);
            bullet.setVisible(true);

            bullet.addListener("hitBorder", (data) => {
                this.socket.emit(this.side, data);
            });

            if (bullet) {
                bullet.fire(this.player, {
                    v: this.flip,
                    selectedSide: this.side,
                    socket: this.socket
                });
                this.lastFired = 500 + this.time;
            }
        }
    }

}