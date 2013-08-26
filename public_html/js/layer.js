var button = {
	type: {
		circle: 0,
		rectangular: 1
	},
	drawLines: true
};

var menuLayer = {
	buttons: [],
	init: function() {

		this.buttons.push(createButton({
			type: button.type.circle,
			x: 340,
			y: 522,
			radius: 65,
			callback: function() {
				game.layer.push(selectionLayer);
				game.currentLayer().init();
			}
		}));

		this.buttons.push(createButton({
			type: button.type.rectangular,
			x: 590,
			y: 580,
			width: 200,
			height: 50,
			callback: function() {
				game.layer.push(creditsLayer);
			}
		}));
	},
	
	logic: function() {

	},
	
	render: function() {
		clearScreen();
		drawBackground("menu");

		$.each(this.buttons, function(i, button) {
			button.render();
		});
	},
	
	onClick: function(event, cursor) {
		$.each(this.buttons, function(i, button) {
			if (button.isInRange(cursor.x, cursor.y))
				button.callback();
		});
	}
};



var creditsLayer = {
	logic: function() {

	},
	
	render: function() {
		clearScreen();
		drawBackground("ingame");
		drawBackground("credits");
	},
	
	onClick: function() {
		game.layer.pop();
	}
};



var selectionLayer = {
	buttons: [],
	
	init: function() {
		var radius = 50;
		var gap = 40;
		var amount = levelInfo.length;
		var x = (ctx.canvas.width / 2) - (amount-1) * (radius+gap) / 2;
		var y = 400;
		
		for (var i = 0; i < amount; ++i) {
			this.buttons.push(createButton({
				type: button.type.circle,
				x: x,
				y: y,
				radius: 30,
				callback: function(levelNumber) {
					game.layer.push(createLevel(levelNumber));
				}
			}));
			x += radius + gap;
		}
	},
	
	logic: function() {
		
	},
	
	render: function() {
		clearScreen();
		
		$.each(this.buttons, function(i, button) {
			button.render();
		});
	},
	onClick: function(event, cursor) {
		$.each(this.buttons, function(i, button) {
			if (button.isInRange(cursor.x, cursor.y))
				button.callback(i);
		});
	}
};




function LevelLayer(levelNumber) {
	this.clicked = false;
	this.upperBorder = 100;
	this.hand = {
		x: 0,
		y: 0
	};
	this.itemInHand = null;
	this.items = [];
	this.levelNumber = 0;
	this.dropCooldown = 0;
	this.score = 0;
	this.scoreGoal = 50;
	this.props = [];
	this.cats = [];
	this.deadCats = [];
	this.eatings = []; // List of eatings that happened this step
	// Eatings are objects of form {cat, food}

	// "Constructor"
	this.levelNumber = levelNumber;
	gameWorld.init();

	if (debug)
		setupDebugDraw();

	world.SetContactListener(createContactListener(this));
	
	
	
	this.logic = function() {
		var i;
		var cat;
		if(this.winClause())
		{
			//Show win scene
		}
		this.moveHand();
		
		if (this.dropCooldown === 0 && this.itemInHand === null) {
			this.spawnItem();
		}
		catAI.logic();
		if (this.itemInHand !== null) {
			this.itemInHand.SetPosition(pxToM(this.hand));
		}
		if (this.clicked && this.dropCooldown === 0) {
			this.dropCooldown = global.dropCooldown;
			this.dropItem();
		}
		this.clicked = false;
		world.Step(gameWorld.timeStep, gameWorld.velocityIterations, gameWorld.positionIterations);
		world.ClearForces();
		
		// Handle all eatings that happened this step
		for (i = 0; i < this.eatings.length; ++i) {
			cat = this.eatings[i].cat;
			var food = this.eatings[i].food;
			// Only one cat can eat even if more than one cat touches the item
			var notYetEaten = this.removeItem(food);
			if (notYetEaten) {
				cat.timeLeft = catDefs.timeLeft;
				world.DestroyBody(food);
				// console.log("Cat", cat, "eats", food);
			}
		}
		if (this.dropCooldown > 0) {
			this.dropCooldown -= 1;
		}
		this.eatings.length = 0; // clear list of eatings

		// Decrement living cats' time left
		for (i = 0; i < this.cats.length; ++i) {
			cat = this.cats[i];

      cat.timeLeft -= 1;
      if (cat.timeLeft <= 0 && catDefs.canDie) {
        console.log("A cat just died!");
		playSoundEffect('snd/die.ogg');
        cat.timeLeft -= 1;
        this.cats.splice(i, 1);
        this.deadCats.push(cat);
        if (this.cats.length === 0) {
          console.log("All cats are dead!");
        }
        i -= 1;
      }
    }

		// Handle dead cats
		for (i = 0; i < this.deadCats.length; ++i) {
			cat = this.deadCats[i];
			cat.timeLeft -= 1;
			if (cat.timeLeft <= catDefs.removeAt) {
				world.DestroyBody(cat);
				this.deadCats.splice(i, 1);
				i -= 1;
			}
		}

		// Decrement all items' time left
		for (i = 0; i < this.items.length; ++i) {
			item = this.items[i];
			if (item.timeLeft > 0) {
				item.timeLeft -= 1;
			}
		}
	};
	
	this.onClick = function(event, cursor) {
		this.clicked = true;
	};
	
	this.onContact = function(a, b) {
		if (a.entityType === "cat" && b.entityType === "food") {
			this.onContactCatFood(a, b);
		}
		else if (b.entityType === "cat" && a.entityType === "food") {
			this.onContactCatFood(b, a);
		}
	}
	
	this.onContactCatFood = function(cat, food) {
		if (catCanEat(cat) && food.timeLeft > 0) {
			this.eatings.push({cat: cat, food: food});
		}
	};
	
	
	this.render = function() {
		clearScreen();

		if (debug)
			world.DrawDebugData();

		drawBackground("ingame");
		this.props.forEach(drawProp);
		this.deadCats.forEach(drawCat);
		this.cats.forEach(drawCat);
		ctx.save();
		
		drawHand(this.hand.x, this.hand.y);
		this.items.forEach(drawItem);

		if (this.itemInHand !== null) {
			drawItem(this.itemInHand);
		}
		drawBackground("foreground");
		ctx.fillStyle = "#FFFFFF";
		ctx.font = "20px Arial";
		ctx.fillText("Score: ", 520, 630);
		ctx.fillText("Level Score Goal: ", 100, 630);
		ctx.fillStyle = "#FF00FF";
		ctx.fillText(this.score , 600, 631);
		ctx.fillText(this.scoreGoal, 280, 631);
	};

  this.spawnItem = function() {
    this.itemInHand = createFood(game.cursor);
    this.itemInHand.SetActive(false);
	playSoundEffect('snd/puff.ogg');
  };

  this.dropItem = function() {
    var droppedItem = this.itemInHand;
    this.items.push(droppedItem);
	catAI.updateFood(this.items);
    droppedItem.SetActive(true);
	this.itemInHand = null;
	playSoundEffect('snd/slip.ogg');
  };
	
	// Remove item, return whether item was in list
	this.removeItem = function(item) {
		var i;
		for (i = 0; i < this.items.length; ++i) {
			if (this.items[i] === item) {
				this.items.splice(i, 1);
				catAI.updateFood(this.items);
				playSoundEffect('snd/omnom' + soundEffectVariator(2) + '.ogg');
				this.score++;
				return true;
			}
		}
		return false;
	};
	
	this.moveHand = function() {
		if (game.cursor.x < global.hand.gapToWalls)
			this.hand.x = global.hand.gapToWalls;
		else if (game.cursor.x > ctx.canvas.width - global.hand.gapToWalls)
			this.hand.x = ctx.canvas.width - global.hand.gapToWalls;
		else
			this.hand.x = game.cursor.x;
		
		this.hand.y = global.hand.y;
	};
	
	this.winClause = function() {
		return this.scoreGoal <= this.score;
	};
};



function createContactListener(self) {
		var listener = new Box2D.Dynamics.b2ContactListener();
		listener.BeginContact = function(contact) {
			self.onContact(contact.GetFixtureA().GetBody(),
							contact.GetFixtureB().GetBody());
		};
		listener.EndContact = function() {
		};
		listener.PostSolve = function() {
		};
		listener.PreSolve = function() {
		};
		return listener;
	};




function createButton(def) {
	if (def.type === button.type.circle) {
		return {
			x: def.x,
			y: def.y,
			radius: def.radius,
			callback: def.callback,
			isInRange: function(x, y) {
				var distance = Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
				return distance < this.radius;
			},
			render: function() {
				if (button.drawLines) {
					ctx.beginPath();
					ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
					ctx.stroke();
				}
			}
		};
	} else if (def.type === button.type.rectangular) {
		return {
			x: def.x,
			y: def.y,
			width: def.width,
			height: def.height,
			callback: def.callback,
			isInRange: function(x, y) {
				return x > this.x && x < this.x + this.width &&
								y > this.y && y < this.y + this.height;
			},
			render: function() {
				if (button.drawLines)
					ctx.strokeRect(this.x, this.y, this.width, this.height);
			}
		};
	}
}
