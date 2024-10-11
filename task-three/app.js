var app = angular.module("multiplayerGame", []);

app.controller("GameController", function ($scope) {
  var canvas = document.getElementById("renderCanvas");
  var engine = new BABYLON.Engine(canvas, true);
  var scene = createScene();

  // BabylonJS Scene Setup
  function createScene() {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera(
      "Camera",
      0,
      1,
      10,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight(
      "light1",
      new BABYLON.Vector3(1, 1, 0),
      scene
    );
    var ground = BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: 50, height: 50 },
      scene
    );

    return scene;
  }

  engine.runRenderLoop(function () {
    scene.render();
  });

  window.addEventListener("resize", function () {
    engine.resize();
  });

  // Colyseus Client Setup
  var client = new Colyseus.Client("ws://localhost:2567");

  client.joinOrCreate("game_room").then((room) => {
    console.log("Joined room!");

    room.onMessage("shapeUpdate", function (message) {
      updateShapePosition(message);
    });
  });

  // Shape creation and movement logic
  var shape;
  $scope.createShape = function () {
    var points = [
      new BABYLON.Vector3(0, 0, 0),
      new BABYLON.Vector3(2, 0, 0),
      new BABYLON.Vector3(1, 0, 2),
    ];
    shape = BABYLON.MeshBuilder.ExtrudePolygon(
      "extrude",
      { shape: points, depth: 1 },
      scene
    );
    shape.position.y = 1;
  };

  window.addEventListener("keydown", function (event) {
    if (!shape) return;

    switch (event.key) {
      case "ArrowUp":
        shape.position.z += 0.1;
        break;
      case "ArrowDown":
        shape.position.z -= 0.1;
        break;
      case "ArrowLeft":
        shape.position.x -= 0.1;
        break;
      case "ArrowRight":
        shape.position.x += 0.1;
        break;
    }
    client.send("shapeUpdate", { position: shape.position });
  });

  function updateShapePosition(data) {
    if (shape) {
      shape.position.x = data.position.x;
      shape.position.z = data.position.z;
    }
  }
});
