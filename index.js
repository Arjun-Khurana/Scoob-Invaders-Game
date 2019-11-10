const express = require("express");
const app = express();

const server = require('http').Server(app);
const io = require("socket.io")(server);

server.listen(process.env.PORT || 3000);
app.use(express.static('public'));

app.get('/phaser/phaser.js', function (req, res) {
    res.sendFile(__dirname + '/node_modules/phaser/dist/phaser.min.js');
  });