
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
  cursor: { x: 0, y : 0 },
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
      this.itemInHand.SetPosition(pxToM(this.cursor));
    }
    if (this.clicked) {
      this.clicked = false;
      this.dropItem();
    }

		world.Step(gameWorld.timeStep, gameWorld.velocityIterations, gameWorld.positionIterations);
		world.ClearForces();
	},
	
	render: function() {
		if (debug) world.DrawDebugData();
	},

  onClick: function (event, cursor) {
    this.updateCursor(cursor);
    this.clicked = true;
  },

  onMouseMove: function (event, cursor) {
    this.updateCursor(cursor);
  },

  updateCursor: function (cursor) {
    if (cursor.y > this.upperBorder) {
      cursor.y = this.upperBorder;
    }
    this.cursor = cursor;
  },

  spawnItem: function () {
    this.itemInHand = createFood(this.cursor);
    this.itemInHand.SetActive(false);
  },

  dropItem: function () {
    var droppedItem = this.itemInHand;
    this.items.push(droppedItem);
    droppedItem.SetActive(true);
    this.spawnItem();
  },
};

