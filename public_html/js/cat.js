var catDefs = {
	angle: 0,
	density: 2,
	friction: 1,
	restitution: 0.5,
	width: 50,
	height: 30,
	maxAmount: 12,
	minAmount: 3,
	spawnDistance: 70,
	maxSpawnY: 200,
  timeLeft: 1000,
	bottomRestitution: 1.2
};


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
  return cat;
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
	for (i = 0; i < numCats; i++)
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
	catzes: [],
	zeFood: [],
	jumpingPower: 30,
	
	init: function(catz) {
		this.catzes = catz;
	},
	
	logic: function() {
		if (0 < this.catzes.length) {
			if (this.catzes[0].GetLinearVelocity().Length() === 0) {
				var force = new Box2D.Common.Math.b2Vec2(15, 0 - this.jumpingPower);
				this.catzes[0].ApplyImpulse(force, this.catzes[0].GetPosition());
			}
		}
	},
	
	nearestFood: function(index) {
		var i = 0;
		var shortestD = Number.MAX_VALUE;
		var d = 0;
		for (i = 0; i < zeFood.length; i++) {
			d = this.distance(catzes[index].GetPosition(), zeFood[i].GetPosition());
		}
	},
	
	distance: function(position1, position2) {
		console.log(position1.x);
		return  Math.sqrt(Math.pow((position1.x - position2.x), 2) + Math.pow((position1.y - position2.y), 2));
	}
};