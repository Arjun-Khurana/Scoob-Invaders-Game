class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
        this.socket = null;
        this.myScore = 0;
        this.theirScore = 0;
        this.particleConfig = {
            angle: { min: 170, max: 190 },
            scale: { start: 0.4, end: 0.1 },
            blendMode: 'ADD',
            lifespan: 250,
        }
    }

    preload() {
        //this.load.image('star', '../assets/snack.png')
        this.load.image('scooby', '../assets/scoobs.png')
        this.load.image('shaggy', '../assets/shags.png')
        this.load.image('bomb', '../assets/snack.png')
        this.load.image("flares", '../assets/yellow.png')
    }

    onCollision(x, star) {
        console.log("hit player");
        if (this.socket) {
            this.socket.emit(this.side, {
                type: "hitPlayer"
            })
        }
        star.deactivateParticles();
        star.disableBody(true, true);
    }

    create(data) {
        this.side = data.selectedSide;
        if (this.side === "leftSide") {
            this.player = this.physics.add.sprite(400,300, 'shaggy');
            this.player.setScale(0.1)
        } else {
            this.player = this.physics.add.sprite(400,300, 'scooby');
            this.player.setScale(0.25)
        }
        this.player.setMaxVelocity(1000).setFriction(800, 800);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        this.lastFired = 0;

        this.socket = data.socket;
        this.physics.add.overlap(this.player, this.bullets, this.onCollision, null, this)
        this.player.body.setCollideWorldBounds(true);

        this.particles = this.add.particles("flares");

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

                let particleEmitter = this.attachParticles(bullet);

                if (bullet) {
                    bullet.fire({
                        x: this.side == "leftSide" ? window.innerWidth : 0,
                        y: packet.y,
                        vel: {
                            x: 0
                        }
                    }, {
                        v: -this.flip,
                        selectedSide: this.selectedSide,
                        socket: this.socket,
                        emitter: particleEmitter
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

    attachParticles(bullet) {
        let particleEmitter = this.particles.createEmitter(this.particleConfig);
        particleEmitter.startFollow(bullet);

        bullet.addListener("hitBorder", (data) => {
            if (bullet.active) {
                this.socket.emit(this.side, data);
            }
            bullet.disableBody(true, true);
        });

        return particleEmitter;
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
            let bullet = this.bullets.get();
            bullet.setActive(true);
            bullet.setVisible(true);

            let particleEmitter = this.attachParticles(bullet);

            if (bullet) {
                bullet.fire({
                    x: this.player.x + 20*this.flip,
                    y: this.player.y
                }, {
                    v: this.flip,
                    selectedSide: this.side,
                    socket: this.socket,
                    emitter: particleEmitter
                });
                this.lastFired = 500 + this.time;
            }
        }
    }

}