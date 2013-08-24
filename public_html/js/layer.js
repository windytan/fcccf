
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
  clicked: false,
  upperBorder: 100,

  itemInHand: null,
  items: Array(),

	init: function() {
		gameWorld.init();
		if (debug) setupDebugDraw();
		
		createLevelFrames();
		generateCats();
		this.spawnItem();
	},
	
	logic: function() {
		if (this.itemInHand != null) {
      this.itemInHand.SetPosition(pxToM(game.cursor));
    }
    if (this.clicked) {
      this.clicked = false;
      this.dropItem();
    }

		world.Step(gameWorld.timeStep, gameWorld.velocityIterations, gameWorld.positionIterations);
		world.ClearForces();
	},

  onClick: function (event, cursor) {
    this.clicked = true;
  },
	
	render: function() {
		if (debug) world.DrawDebugData();
	},

  spawnItem: function () {
    this.itemInHand = createFood(game.cursor);
    this.itemInHand.SetActive(false);
  },

  dropItem: function () {
    var droppedItem = this.itemInHand;
    this.items.push(droppedItem);
    droppedItem.SetActive(true);
    this.spawnItem();
  },
};

