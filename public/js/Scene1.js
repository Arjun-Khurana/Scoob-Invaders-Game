class Scene1 extends Phaser.Scene {
    constructor() {
        super("sideSelector");
        this.selectedSide = 'rightSide'; 
    }

    init() {
        console.log("Hello world");
    }

    preload() {
        this.load.image('Left', 'assets/GameSpritesL.png'); 
        this.load.image('Right', 'assets/GameSpritesR.png'); 
        this.load.image('LeftClick', 'assets/GameSpritesLC.png'); 
        this.load.image('RightClick', 'assets/GameSpritesRC.png'); 
        this.load.image('NextButton', 'assets/GameSpritesNext.png'); 
    }

    create(data) {
        this.socket = data.socket;
        this.clickCountText = this.add.text(10, 20, '');

        this.leftButton = this.add.image(this.cameras.main.centerX-400, this.cameras.main.centerY, 'Left')
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.selectedSide = 'leftSide';  
            }); 

        this.rightButton = this.add.image(this.cameras.main.centerX+400, this.cameras.main.centerY, 'Right')
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.selectedSide = 'rightSide';  
            }); 

        this.nextButton = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'NextButton')
            .setInteractive({useHandCursor: true })
            .on('pointerdown', () => {
                this.socket.emit(this.selectedSide, {
                    type: "readyMessage",
                    status: "ready"
                });

                this.socket.on(this.selectedSide, (packet) => {
                    if (packet.type === "readyReply") {
                        this.scene.start("playGame", {
                            selectedSide: this.selectedSide,
                            height: window.innerHeight,
                            width: window.innerWidth,
                            socket: this.socket
                        });
                    }
                })
            });
        this.nextButton.setScale(0.25); 
    }

    update() {
        this.clickCountText.setText(`You have selected the ${this.selectedSide} Button`);
    }
}