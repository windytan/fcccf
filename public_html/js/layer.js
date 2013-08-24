
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
  items: [],

  cats: [],
  eatings: [], // List of eatings that happened this step
               // Eatings are objects of form {cat, food}

	init: function() {
		gameWorld.init();
		if (debug) setupDebugDraw();
		
    world.SetContactListener(this.contactListener());
		createLevelFrames();
		this.cats = generateCats();
		this.spawnItem();
	},
	
	logic: function() {
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
    for (var i = 0; i < this.eatings.length; ++i) {
      var cat = this.eatings[i].cat;
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
    for (var i = 0; i < this.cats.length; ++i) {
      var cat = this.cats[i];
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

  // Remove item, return whether item was in list
  removeItem: function (item) {
    for (var i = 0; i < this.items.length; ++i) {
      if (this.items[i] === item) {
        this.items.splice(i, 1);
        return true;
      }
    }
    return false;
  },
};

