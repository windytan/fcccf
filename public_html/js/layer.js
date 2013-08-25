var buttonType = {
	circle: 0,
	rectangular: 1
};

var menuLayer = {
	buttons: [],
	
	init: function() {
		
		this.buttons.push(createButton({
			type: buttonType.circle,
			x: 340,
			y: 522,
			radius: 65,
			callback: function() {
				game.layer.push(levelLayer);
				game.currentLayer().init(0);
			}
		}));

		this.buttons.push(createButton({
			type: buttonType.rectangular,
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
		ctx.fillStyle = "#ff9933";
		
		$.each(this.buttons, function(i, button) {
			button.render();
		});

		ctx.fillStyle = "#ffc0cb";
		ctx.fillRect(game.cursor.x - 5, game.cursor.y - 5, 10, 10);
	},
	
	onClick: function(event, cursor) {
		$.each(this.buttons, function(i, button) {
			if (button.isInRange(cursor.x, cursor.y))
				button.callback();
		});
	}
};


function createButton(def) {
	if (def.type === buttonType.circle) {
		return {
			x: def.x,
			y: def.y,
			radius: def.radius,
			callback: def.callback,
			
			isInRange: function(x, y) {
				var distance = Math.sqrt(Math.pow(this.x-x, 2) + Math.pow(this.y-y, 2));
				return distance < this.radius;
			},
			render: function() {
				//ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
				//ctx.stroke();
			}
		};
	} else if (def.type === buttonType.rectangular) {
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
				ctx.fillRect(this.x, this.y, this.width, this.height);
			}
		};
	}
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
	items: [],
	levelNumber: 0,
	
  cats: [],
  deadCats: [],
  eatings: [], // List of eatings that happened this step
               // Eatings are objects of form {cat, food}
  
	init: function(levelNumber) {
		this.levelNumber = levelNumber;
		gameWorld.init();

		if (debug)
			setupDebugDraw();

    world.SetContactListener(this.contactListener());
		createLevel(this.levelNumber);
	},
	
	logic: function() {
    var i;
    var cat;
		
		catAI.logic();
	
		if (this.itemInHand !== null) {
      this.itemInHand.SetPosition(pxToM(game.cursor));
    }
    if (this.clicked) {
      this.clicked = false;
      this.dropItem();
    }

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
    this.eatings.length = 0; // clear list of eatings

    // Decrement living cats' time left
    for (i = 0; i < this.cats.length; ++i) {
      cat = this.cats[i];

      cat.timeLeft -= 1;
      if (cat.timeLeft <= 0 && catDefs.canDie) {
        console.log("A cat just died!");
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
	},

  onClick: function (event, cursor) {
    this.clicked = true;
  },

  onContact: function (a, b) {
    if (a.entityType === "cat" && b.entityType === "food") {
      this.onContactCatFood(a, b);
    }
    else if (b.entityType === "cat" && a.entityType === "food") {
      this.onContactCatFood(b, a);
    }
  },

  onContactCatFood: function (cat, food) {
    if (catCanEat(cat)) {
      this.eatings.push({cat: cat, food: food});
    }
  },

  contactListener: function () {
    var listener = new Box2D.Dynamics.b2ContactListener();
    var self = this;
    listener.BeginContact = function (contact) {
      self.onContact(contact.GetFixtureA().GetBody(),
                     contact.GetFixtureB().GetBody());
    };
    listener.EndContact = function () {};
    listener.PostSolve = function () {};
    listener.PreSolve = function () {};
    return listener;
  },

	render: function() {
		clearScreen();
			
		if (debug)
			world.DrawDebugData();
		
	  drawBackground("ingame");
    this.deadCats.forEach(drawCat);
    this.cats.forEach(drawCat);
    this.items.forEach(drawItem);
    drawItem(this.itemInHand);
		drawBackground("foreground");
	},

  spawnItem: function () {
    this.itemInHand = createFood(game.cursor);
    this.itemInHand.SetActive(false);
  },

  dropItem: function () {
    var droppedItem = this.itemInHand;
    this.items.push(droppedItem);
	catAI.updateFood(this.items);
    droppedItem.SetActive(true);
    this.spawnItem();
  },

  // Remove item, return whether item was in list
  removeItem: function (item) {
    var i;
    for (i = 0; i < this.items.length; ++i) {
      if (this.items[i] === item) {
        this.items.splice(i, 1);
		catAI.updateFood(this.items);
        return true;
      }
    }
    return false;
  }
};

