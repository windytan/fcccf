
var menuLayer = {
	init: function() {
		ctx.canvas.addEventListener("click", function(event) {
			console.log(event);
			game.layer.push(levelLayer);
			game.layer[1].init();
			
			this.removeEventListener("click", arguments.callee, false);
		}, false);
	},
	
	logic: function() {
		
	},
	
	render: function() {
		ctx.fillStyle = "rgb(200, 100, 100";
		ctx.fillRect(50, 50, 300, 200);
	}
};



var levelLayer = {
	init: function() {
		gameWorld.init();
		if (debug) setupDebugDraw();
		
		createLevelFrames();
		createCat({x: 400, y: 400});
		game.spawnItem();
	},
	
	logic: function() {
		if (game.itemInHand != null) {
      // console.log(game.cursor);
      game.itemInHand.SetPosition(pxToM(game.cursor));
    }
    if (game.clicked) {
      game.clicked = false;
      game.dropItem();
    }

		world.Step(gameWorld.timeStep, gameWorld.velocityIterations, gameWorld.positionIterations);
		world.ClearForces();
	},
	
	render: function() {
		if (debug) world.DrawDebugData();
	}
};