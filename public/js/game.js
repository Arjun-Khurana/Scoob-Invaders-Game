let config = {
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x000000,
  physics: {
    default: 'arcade',
    arcade: {
      setBounds: {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: 600,
      }
    }
  },
  scene: [Scene1, Scene2]
}

let socket;

//socket = io(`http://localhost:8080`);
socket = io(`https://scoob-invaders-api.herokuapp.com`);

let game = new Phaser.Game(config);
game.scene.start("sideSelector", {
  socket: socket
})