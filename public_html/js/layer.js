var button = {
	type: {
		circle: 0,
		rectangular: 1
	}
};

var menuLayer = {
	buttons: [],
	init: function() {

		this.buttons.push(createButton({
			type: button.type.circle,
			x: 340,
			y: 522,
			radius: 65,
			texture: "startButton",
			callback: function() {
				game.layer.push(new SelectionLayer());
			}
		}));

		this.buttons.push(createButton({
			type: button.type.rectangular,
			x: 590,
			y: 580,
			width: 200,
			height: 50,
			texture: "creditsButton",
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



function SelectionLayer() {
	this.backButton;
	this.buttons = [];
	
	this.backButton = createButton({
		type: button.type.rectangular,
		x: 590,
		y: 580,
		width: 200,
		height: 50,
		texture: "backButton",
		callback: function() {
			game.layer.pop();
		}
	});
	
	var radius = 50;
	var gap = 80;
	var amount = levelInfo.length;
	var x = (ctx.canvas.width / 2) - (amount-1) * (radius+gap) / 2;
	var y = 470;
	
	for (var i = 0; i < amount; ++i) {
		this.buttons.push(createButton({
			type: button.type.circle,
			x: x,
			y: y,
			radius: radius,
			texture: "levelButton",
			callback: function(levelNumber) {
				game.layer.push(createLevel(levelNumber));
			}
		}));
		x += radius + gap;
	}
	
	this.logic = function() {
		
	};
	
	this.render = function() {
		clearScreen();
		drawBackground("selection");
		
		this.backButton.render();
		
		$.each(this.buttons, function(i, button) {
			button.render();
			ctx.font = "70px Arial";
			ctx.textAlign = "center";
			ctx.fillStyle = rainbowGradient();
			ctx.fillText(i+1, button.x, button.y+24);
			ctx.strokeText(i+1, button.x, button.y+24);
		});
	};
					
	this.onClick = function(event, cursor) {
		if (this.backButton.isInRange(cursor.x, cursor.y))
			this.backButton.callback();
		
		$.each(this.buttons, function(i, button) {
			if (button.isInRange(cursor.x, cursor.y))
				button.callback(i);
		});
	};
};




function LevelLayer(info) {
	this.clicked = false;
	this.upperBorder = 100;
	this.hand = {
		x: 0,
		y: 0
	};
	this.gameLost = false;
	this.itemInHand = null;
	this.items = [];
	this.levelNumber = 0;
	this.dropCooldown = 0;
	this.score = 0;
	this.scoreGoal = info.scoreGoal;
	this.props = [];
	this.cats = [];
	this.deadCats = [];
	this.eatings = []; // List of eatings that happened this step
  this.eventInterval = 10 * 60;
  this.eventTimer = this.eventInterval;
	this.goingEventCallBack = null;
	
	this.buttons = [];

	// "Constructor"
	this.levelNumber = info.levelNumber;
	gameWorld.init();

	if (debug) {
		setupDebugDraw();
	}
	world.SetContactListener(createContactListener(this));
	
	this.buttons.push(createButton({
		type: button.type.rectangular,
		x: 300,
		y: 430,
		width: 200,
		height: 50,
		texture: "quit",
		callback: function() {
			game.layer.pop();
			game.layer.pop();
		}
	}));
	
	
	// Event archive
  this.events = [
    function(levelLayer) {		// 5-10 foods drop from hand
      var i = Math.floor(Math.random() * 6) + 5;
      while (i --> 0) {
        levelLayer.dropItem();
        levelLayer.spawnItem();
      }
    },
		function(levelLayer) {		// 5-8 foods drop from heaven
			var moarFood = Math.floor(Math.random() * 4) + 5;

			for (var i = 0; i < moarFood; ++i) {
				var food = createFood({x: Math.random()*700+50, y: -30});
				levelLayer.items.push(food);
				catAI.updateFood(levelLayer.items);
				food.SetActive(true);
			}
		},
		function(levelLayer) {		// Cats get rotation boost
			$.each(levelLayer.cats, function(i, cat) {
				if (Math.random() < 0.5)
					cat.m_angularVelocity = -70;
				else
					cat.m_angularVelocity = 70;
			});
		},
		function(levelLayer) {		// 2-3 cats drop from heaven
			var moarCats = 2;
			if (Math.random() < 0.3)
				moarCats = 3;
			
			for (var i = 0; i < moarCats; ++i) {
				var cat = createCat({x: Math.random()*700+50, y: -30});
				cat.m_linearVelocity.SetV({x: 0, y: 10});
				levelLayer.cats.push(cat);
			}
		},
		function(levelLayer) {
			var propellerDef = {
				x: Math.random()*600+100,
				y: Math.random()*435+60,
				clockwise: Math.random() < 0.5
			};
			levelLayer.props.push(createPropeller(propellerDef));
		},
		
		function(levelLayer) {
			var multiplier = Math.random() + 2;
			
			if (Math.random() < 0.5)
				world.SetGravity({x: gameWorld.gravity*multiplier, y: 0});
			else
				world.SetGravity({x: -gameWorld.gravity*multiplier, y: 0});
			
			levelLayer.goingEventCallBack = function() {
				world.SetGravity({x: 0, y: gameWorld.gravity});
			};
		}
  ],
		
	this.logic = function() {
		if(this.winClause()) {
			return;
		}
		var i;
		var cat;
		
		this.moveHand();

		if (!this.gameLost)
			this.eventTimer -= 1; // TÄMÄ KUULUU OLLA 1 ----------------------
		
    if (this.eventTimer <= 0 && this.events.length > 0) {
			if (this.goingEventCallBack !== null) {
				this.goingEventCallBack();
				this.goingEventCallBack = null;
			}
      this.eventTimer = this.eventInterval;
      var event = randomChoice(this.events);
      console.log("Event triggered!");
			playSoundEffect('snd/gong.ogg');
      event(this);
    }
		
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
				this.loseGame();
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
		if(!this.winClause() && !this.gameLost) {
			this.clicked = true;
		}
		else {
			$.each(this.buttons, function(i, button) {
			if (button.isInRange(cursor.x, cursor.y))
				button.callback();
		});
		}
	};
	
	this.onContact = function(a, b) {
		if (a.entityType === "cat" && b.entityType === "food") {
			this.onContactCatFood(a, b);
		}
		else if (b.entityType === "cat" && a.entityType === "food") {
			this.onContactCatFood(b, a);
		}
	};
	
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
		if(this.winClause() && !this.gameLost) {
			drawButtonImage("completed", 100, 90);
			$.each(this.buttons, function(i, button) {
				button.render();
			});
		}
		if(this.gameLost)
		{
			drawButtonImage("lost", 100, 90);
			$.each(this.buttons, function(i, button) {
					button.render();
			});
		}
	};


  this.spawnItem = function() {
    this.itemInHand = createFood(this.hand);
    this.itemInHand.SetActive(false);
		playSoundEffect('snd/puff.ogg');
  };

  this.dropItem = function() {
    var droppedItem = this.itemInHand;
		if (droppedItem !== null) {
			this.items.push(droppedItem);
			catAI.updateFood(this.items);
			droppedItem.SetActive(true);
			this.itemInHand = null;
			playSoundEffect('snd/slip.ogg');
		}
  };
	
	// Remove item, return whether item was in list
	this.removeItem = function(item) {
		var i;
		for (i = 0; i < this.items.length; ++i) {
			if (this.items[i] === item) {
				this.items.splice(i, 1);
				catAI.updateFood(this.items);
				playSoundEffect('snd/omnom' + soundEffectVariator(2) + '.ogg');
				if(!this.gameLost) {
					this.score++;
					if(this.winClause()) {
						this.gameWon();
					}
				}
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
	
	this.loseGame = function() {
		if (!this.gameLost) {
			this.gameLost = true;
			playSoundEffect('snd/defeat.ogg');
			this.buttons.push(createButton({
				type: button.type.rectangular,
				x: 300,
				y: 340,
				width: 200,
				height: 50,
				texture: "tryagain",
				levelNumber: this.levelNumber,
				callback: function() {
					game.layer.pop();
					game.layer.push(createLevel(this.levelNumber));
				}
			}));
		}
	};
	
	this.gameWon = function() {
		playSoundEffect('snd/victory.ogg');
		if (this.levelNumber < amountOfLevels() - 1) {
					this.buttons.push(createButton({
						type: button.type.rectangular,
						x: 300,
						y: 340,
						width: 200,
						height: 50,
						texture: "nextlevel",
						levelNumber: this.levelNumber,
						callback: function() {
							game.layer.pop();
							game.layer.push(createLevel(this.levelNumber + 1));
						}
					}));
				}
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
			texture: def.texture,
			callback: def.callback,
			isInRange: function(x, y) {
				var distance = Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
				return distance < this.radius;
			},
			render: function() {
				if(this.texture !== undefined) {
					var width = game.images.buttons[this.texture].width;
					var height = game.images.buttons[this.texture].height;
					drawButtonImage(this.texture, this.x-width/2, this.y-height/2);
				}
				else {
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
			texture : def.texture,
			levelNumber: def.levelNumber,
			callback: def.callback,
			isInRange: function(x, y) {
				return x > this.x && x < this.x + this.width &&
								y > this.y && y < this.y + this.height;
			},
			render: function() {
				if(this.texture !== undefined) {
					drawButtonImage(this.texture, this.x, this.y);
				}
				else {
					ctx.strokeRect(this.x, this.y, this.width, this.height);
				}
			}
		};
	}
}
