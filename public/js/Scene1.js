class Scene1 extends Phaser.Scene {
    constructor() {
        super("sideSelector");
        this.selectedSide = 'rightSide'; 
    }

    init() {
        console.log("Hello world");
    }

    create() {
        this.clickCountText = this.add.text(10, 20, '');

        this.leftButton = this.add.image(200, 300, 'Left')
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.selectedSide = 'leftSide';  
            }); 
        this.rightButton = this.add.image(500, 300, 'Right')
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.selectedSide = 'rightSide';  
            }); 
        //this.scene.start("playGame");
    }
    
    preload() {

        this.load.image('Left', 'assets/GameSpritesL.png'); 
        this.load.image('Right', 'assets/GameSpritesR.png'); 
        this.load.image('LeftClick', 'assets/GameSpritesLC.png'); 
        this.load.image('RightClick', 'assets/GameSpritesRC.png'); 
    }

    update() {
        this.clickCountText.setText(`You have selected the ${this.selectedSide} Button`);
    }
}