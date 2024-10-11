const colyseus = require("colyseus");
const http = require("http");
const express = require("express");
const app = express();
const port = 2567;

const server = http.createServer(app);
const gameServer = new colyseus.Server({
  server: server,
});

class GameRoom extends colyseus.Room {
  onCreate() {
    console.log("Room created!");

    this.onMessage("shapeUpdate", (client, message) => {
      console.log("Received shape update:", message);

      // Broadcast the position update to all players
      this.broadcast("shapeUpdate", message);
    });
  }

  onJoin(client) {
    console.log("Player joined:", client.sessionId);
  }

  onLeave(client) {
    console.log("Player left:", client.sessionId);
  }
}

gameServer.define("game_room", GameRoom);

server.listen(port, () =>
  console.log(`Colyseus server listening on port ${port}`)
);
