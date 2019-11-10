class Bullet extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'bomb')
        this.speed = 0;
        this.born = 0;
    }

    fire(player, data) {
        this.selectedSide = data.selectedSide;
        this.selectedSide == "leftSide" ? 
            this.setPosition(player.x + 60, player.y) :
            this.setPosition(player.x - 100, player.y) 
            
        this.speed = Phaser.Math.GetSpeed(data.v * 1000, 1)
        this.born = 0;
        this.enableBody();
        this.particleEmitter = data.emitter;
    }
    
    deactivateParticles() {
        this.particleEmitter.stop();
        
        this.particleEmitter.killAll();
    }

    update(time, delta) {
        this.particleEmitter.emitParticle(1);        

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
            
            this.deactivateParticles();
            this.setActive(false);
            this.setVisible(false);
        }
    }
}