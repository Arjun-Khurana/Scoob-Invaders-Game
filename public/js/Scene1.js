class Scene1 extends Phaser.Scene {
    constructor() {
        super("sideSelector");
    }

    init() {
        console.log("Hello world");
    }

    create() {
        this.scene.start("playGame");
    }
    
    preload() {

    }

    update() {

    }

}