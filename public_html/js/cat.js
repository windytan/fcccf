
var catDefs = {
	angle: 0, // 0
	density: 2,
	friction: 1,
	restitution: 0.3,
	width: 50,
	height: 30,
	maxAmount: 12, // 12
	minAmount: 3, // 3
	spawnDistance: 70,
	maxSpawnY: 200,
  timeLeft: 1000,
	bottomRestitution: 1.1,
  // States and their lower thresholds (where 1 is healthy and 0 is dead)
  states: {
    normal: 0.75,
    hungry: 0.5,
    starving: 0,
    dead: -1000000
  },
	rotationMultiplier: {
		straightenStrong: 0.00025,
		straightenMild: 0.00005,
		over90Degrees: 0.000125,
		velocityReducer: 0.005
	},
  removeAt: -500,
	jumpingPower: 60,
	canDie: true // true
};


function catState(cat) {
  var x = cat.timeLeft / catDefs.timeLeft;
  var state;
  for (state in catDefs.states) {
    var lowerThreshold = catDefs.states[state];
    if (x >= lowerThreshold) {
      return state;
    }
  }
  console.log("Error: No cat state matches timeLeft = ", cat.timeLeft);
}


function catCanEat (cat) {
  return cat.timeLeft > 0;
}


function createCat(position) {
	var cat = createBody({
		dynamic: true,
		x: position.x,
		y: position.y,
		angle: catDefs.angle,
		density: catDefs.density,
		friction: catDefs.friction, 
		restitution: catDefs.restitution,
		shape: global.shape.rectangular,
		width: catDefs.width,
		height: catDefs.height
	});
	
	var bottom = createFixtureDef({
		density: catDefs.density,
		friction: catDefs.friction, 
		restitution: catDefs.bottomRestitution,
		shape: global.shape.polygon,
		points: [
			[0, 0],
			[catDefs.width/2, catDefs.height/2+1],
			[-catDefs.width/2, catDefs.height/2+1]
		]
	});
	
	cat.CreateFixture(bottom);
	
  cat.timeLeft = catDefs.timeLeft;
  cat.entityType = "cat";
  cat.catColor = randomColor();
  return cat;
}


function randomColor () {
  var r, g, b;
  var bottom = 128;
  var range = 256 - bottom;
  r = randomInt(range);
  do {
    g = randomInt(range);
  }
  while (Math.abs(r - g) < 20);
  do {
    b = randomInt(range);
  }
  while (b > r && b > g);

  return { r: bottom + r,  g: bottom + g, b: bottom + b };
}


function validSpawnSpot(position, catPosiArray) {
	var distance = 0;
  var i;
	for(i = 0; i < catPosiArray.length; i++)
	{
		distance = Math.sqrt(Math.pow((catPosiArray[i].x-position.x), 2) + Math.pow((catPosiArray[i].y-position.y), 2));
		if(distance < catDefs.spawnDistance) 
		{
			return false;
		}
	}
	return true;
}


function generateCats() {
	var catLocations = [];
	var numCats = catDefs.minAmount + Math.random()*catDefs.maxAmount;
	var spawnSpot;
  var cats = [];
  var i = 0;
	for (i = 0; i < numCats-1; i++)
	{
		spawnSpot = {x: Math.random()*(ctx.canvas.width-catDefs.width/2), y: ctx.canvas.height-catDefs.height/2- Math.random()*catDefs.maxSpawnY};
		while(!validSpawnSpot(spawnSpot, catLocations))
		{
			spawnSpot = {x: Math.random()*(ctx.canvas.width-catDefs.width/2), y: ctx.canvas.height-catDefs.height/2- Math.random()*catDefs.maxSpawnY};
		}
		catLocations[i] = spawnSpot;
		var cat = createCat(catLocations[i]);
    cats.push(cat);
	}
  return cats;
}



var catAI = {
	cats: [],
	zeFood: [],
	actionCap: 0.1,
	
	init: function(catz) {
		this.cats = catz;
	},
	
	updateFood: function(foodz)
	{
	    this.zeFood = foodz;
	},
	
    logic: function() {
	    var position;
			var angle = 0;
			var j = 0;
	    if(0<this.cats.length) {
		    for(j = 0; j < this.cats.length; j++) {
				this.rotate(this.cats[j]);
				
				if(this.cats[j].GetLinearVelocity().Length()<this.actionCap) {
					position = this.nearestFood(j);
					if(position!==0) {
						angle = this.angleInRadians(this.cats[j].GetPosition(), position);
						var force = new Box2D.Common.Math.b2Vec2(Math.cos(angle) * catDefs.jumpingPower, 
																							Math.sin(angle) * catDefs.jumpingPower);
						this.cats[j].ApplyImpulse(force, this.cats[j].GetPosition());
						playSoundEffect('snd/bounce'+soundEffectVariator(3)+'.ogg');
					}
				}
			}
		}
	},
	
	nearestFood: function(index) {
		var i = 0;
		var shortestD = Number.MAX_VALUE;
		var d = 0;
		var foodToReturn = 0;
		
		if (0<this.zeFood.length) {
            for(i = 0; i < this.zeFood.length; i++)
		    {
				if (foodState(this.zeFood[i]) !== "rotten") {
					d = this.distance(this.cats[index].GetPosition(), this.zeFood[i].GetPosition());
					if(d<shortestD)
					{
						shortestD = d;
						foodToReturn = i;
					}
				}
		    }
			if (shortestD !== Number.MAX_VALUE)
			{
				return this.zeFood[foodToReturn].GetPosition();
			}
		}
		return 0;
	},
	
	
	angleInRadians: function(position1, position2) {
	  return Math.atan2(position2.y-position1.y, position2.x-position1.x) ;
	},
	
	distance: function(position1, position2) {
		return  Math.sqrt(Math.pow((position1.x-position2.x), 2) + Math.pow((position1.y-position2.y), 2));
	},
	
	rotate: function(cat) {
		var angle = toDegrees(cat.GetAngle()) % 360;
		var change = 0;
		
		if (angle < -180)
			angle += 360;
		else if (angle > 180)
			angle -360;
		
		if ((cat.m_angularVelocity < 0 && angle < 0) ||
				(cat.m_angularVelocity > 0 && angle > 0)) {
			change -= angle * catDefs.rotationMultiplier.straightenStrong;
		} else {
			change -= angle * catDefs.rotationMultiplier.straightenMild;
		}
		
		if (angle < -90 || angle > 90)
			change -= angle * catDefs.rotationMultiplier.over90Degrees;
		
		change -= cat.m_angularVelocity * catDefs.rotationMultiplier.velocityReducer;
		
		cat.m_angularVelocity += change;
	}
};
