let config = {
    width: 800,
    height: 600, 
    backgroundColor: 0x000000,
    physics: {
        default: 'impact',
        impact: {
            setBounds: {
                x: 0,
                y: 0,
                width: 800,
                height: 600,
                thickness: 32
            }
        }
    },
    scene: [Scene1, Scene2]
}

let game = new Phaser.Game(config);