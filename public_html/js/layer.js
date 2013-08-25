
var menuLayer = {
	buttons: [],
	
	init: function() {
		this.buttons.push(createButton(100, 200, 60, 60, function() {
			game.layer.push(levelLayer);
			game.currentLayer().init(0);
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
	items: [],
	levelNumber: 0,
	
  cats: [],
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

    // Decrement all cats' time left
    for (i = 0; i < this.cats.length; ++i) {
      cat = this.cats[i];
      cat.timeLeft -= 1;
      if (cat.timeLeft <= 0) {
        console.log("A cat just died!");
        world.DestroyBody(cat);
        this.cats.splice(i, 1);
        i -= 1;
        if (this.cats.length === 0) {
          console.log("All cats are dead!");
        }
      }
    }
	},

  onClick: function (event, cursor) {
    this.clicked = true;
  },

  onContact: function (a, b) {
    if (a.entityType === "cat" && b.entityType === "food") {
      this.eatings.push({cat: a, food: b});
    }
    else if (b.entityType === "cat" && a.entityType === "food") {
      this.eatings.push({cat: b, food: a});
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
		if (debug) {
			world.DrawDebugData();
    }

    this.cats.forEach(drawCat);
    this.items.forEach(drawItem);
    drawItem(this.itemInHand);
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

