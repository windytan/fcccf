
var menuLayer = {
	buttons: [],
	
	init: function() {
		this.buttons.push(createButton(100, 200, 60, 60, function() {
			game.layer.push(levelLayer);
			game.currentLayer().init();
		}));

		this.buttons.push(createButton(40, 550, 200, 50, function() {
			game.layer.push(creditsLayer);
		}));
	},
	
	logic: function() {

	},
	
	render: function() {
		clearScreen();

		ctx.fillStyle = "#ff9933";
		$.each(this.buttons, function(i, button) {
			ctx.fillRect(button.x, button.y, button.width, button.height);
		});

		ctx.fillStyle = "#ffc0cb";
		ctx.fillRect(game.cursor.x - 5, game.cursor.y - 5, 10, 10);
	},
	
	onClick: function(event, cursor) {
		$.each(this.buttons, function(i, button) {
			if (cursor.x > button.x &&
							cursor.x < button.x + button.width &&
							cursor.y > button.y &&
							cursor.y < button.y + button.height) {
				button.callback();
			}
		});
	}
};


function createButton(x, y, width, height, callback) {
	return {
		x: x,
		y: y,
		width: width,
		height: height,
		callback: callback
	};
}


var creditsLayer = {
	logic: function() {

	},
	
	render: function() {
		clearScreen();
		ctx.fillStyle = "#000000";
		ctx.font = "20px Arial";
		ctx.fillText("Credits", 100, 100);
	},
	
	onClick: function() {
		game.layer.pop();
	}
};


var levelLayer = {
	clicked: false,
	upperBorder: 100,
	itemInHand: null,
	items: Array(),
	
	init: function() {
		gameWorld.init();
		if (debug)
			setupDebugDraw();

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
	
	onClick: function(event, cursor) {
		this.clicked = true;
	},
	
	render: function() {
		if (debug)
			world.DrawDebugData();
	},
	
	spawnItem: function() {
		this.itemInHand = createFood(game.cursor);
		this.itemInHand.SetActive(false);
	},
	
	dropItem: function() {
		var droppedItem = this.itemInHand;
		this.items.push(droppedItem);
		droppedItem.SetActive(true);
		this.spawnItem();
	}
};

