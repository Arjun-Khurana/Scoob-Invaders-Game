class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
        this.socket = null;
        this.myScore = 0;
        this.theirScore = 0;
    }

    preload() {
        this.load.image('star', '../assets/star.png')
        this.load.image('bomb', '../assets/bomb.png')
    }

    onCollision(x, star) {
        console.log("hit player");
        if (this.socket) {
            this.socket.emit(this.side, {
                type: "hitPlayer"
            })
        }
        star.disableBody(true, true);
    }

    create(data) {
        this.player = this.physics.add.sprite(400,300, 'star');
        this.player.setMaxVelocity(1000).setFriction(800, 800);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        this.lastFired = 0;
        this.side = data.selectedSide;
        this.socket = data.socket;
        this.physics.add.overlap(this.player, this.bullets, this.onCollision, null, this)
        
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
                }

                return;
            }
            else if (packet.type === "hitPlayer") {
                if (packet.increment === this.side) {
                    this.myScore++;
                } else {
                    this.theirScore++;
                }
            }
        });

        this.scoreDisplay = this.add.text(10, 20, '');
    }
      
    update(time,delta) {
        this.scoreDisplay.setText(`Your score: ${this.myScore}, opponent score: ${this.theirScore}`)
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
                bullet.fire({
                    x: this.player.x + 20*this.flip,
                    y: this.player.y
                }, {
                    v: this.flip,
                    selectedSide: this.side,
                    socket: this.socket
                });
                this.lastFired = 500 + this.time;
            }
        }
    }

}