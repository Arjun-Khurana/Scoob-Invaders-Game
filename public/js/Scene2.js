class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
        this.socket = null;
        this.myScore = 0;
        this.theirScore = 0;
        this.particleConfig = {
            angle: { min: 160, max: 200 },
            scale: { start: 0.4, end: 0.1 },
            blendMode: 'ADD',
            lifespan: 250,
        }
    }

    preload() {
        this.load.audio('theme', [
            'assets/themeSong.oog',
            'assets/themeSong.mp3'
        ]);
        this.load.image('scooby', '../assets/scoobs.png')
        this.load.image('shaggy', '../assets/shags.png')
        this.load.image('bomb', '../assets/snack.png')
        this.load.image('bg', '../assets/ScoobyDoobieBackground.png')
        this.load.image("blueFlares", '../assets/blue.png')
        this.load.image("greenFlares", '../assets/scoob_particle.png')
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
        var music = this.sound.add('theme', {loop:true}); 
        //music.loop = true; 
        music.play(); 

        this.add.image(0, 0, "bg").setOrigin(0, 0).setScale(1);
        this.side = data.selectedSide;
        if (this.side === "leftSide") {
            this.player = this.physics.add.sprite(400,300, 'shaggy');
            this.particles = this.add.particles("greenFlares");
            this.opponentParticles = this.add.particles("blueFlares");
            this.player.setScale(0.05)
            this.flip = 1;
        } else {
            this.player = this.physics.add.sprite(400,300, 'scooby');
            this.particles = this.add.particles("blueFlares");
            this.opponentParticles = this.add.particles("greenFlares");
            this.player.setScale(0.05)
            this.flip = -1;
        }
        this.player.setMaxVelocity(1000).setFriction(800, 800);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        this.lastFired = 0;

        this.socket = data.socket;
        this.physics.add.overlap(this.player, this.bullets, this.onCollision, null, this)
        this.player.body.setCollideWorldBounds(true);

        this.socket.on(this.side, (packet) => {
            if (packet.type == "projectile") {
                let bullet = this.bullets.get();
                bullet.setActive(true);
                bullet.setVisible(true);

                let particleEmitter = this.attachParticles(bullet, this.opponentParticles);

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
                console.log(packet)
                if (this.side == "leftSide") {
                    this.myScore = packet.scores.leftScore;
                    this.theirScore = packet.scores.rightScore;
                } else {
                    this.myScore = packet.scores.rightScore;
                    this.theirScore = packet.scores.leftScore;
                }
            }
        });

        this.scoreDisplay = this.add.text(10, 20, '');
    }

    attachParticles(bullet, particles) {
        let particleEmitter = particles.createEmitter(this.particleConfig);
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

            let particleEmitter = this.attachParticles(bullet, this.particles);

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