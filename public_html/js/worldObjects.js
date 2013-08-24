var frame = {
	width: 10,
	friction: 0.6,
	restitution: 0.3,
	
	ceiling: {
		y: -400,
		restitution: 0.0
	}
};

var catDefs = {
	angle: 0,
	density: 20,
	friction: 1,
	restitution: 0.1,
	width: 50,
	height: 30,
	maxAmount: 12,
	minAmount: 3,
	spawnDistance: 70,
	maxSpawnY: 200,
  timeLeft: 1000
};

function createLevelFrames() {
	// Ceiling
	createBody({
		dynamic: false,
		x: ctx.canvas.width / 2,
		y: frame.ceiling.y + frame.width / 2,
		friction: frame.friction,
		restitution: frame.ceilingRestitution,
		shape: global.shape.rectangular,
		width: ctx.canvas.width,
		height: frame.width
	});
	
	// Floor
	createBody({
		dynamic: false,
		x: ctx.canvas.width / 2,
		y: 640 - frame.width / 2,
		friction: frame.friction,
		restitution: frame.restitution,
		shape: global.shape.rectangular,
		width: ctx.canvas.width,
		height: frame.width
	});
	
	// Left wall
	createBody({
		dynamic: false,
		x: frame.width / 2,
		y: ctx.canvas.height / 2 + frame.ceiling.y / 2,
		friction: frame.friction,
		restitution: frame.restitution,
		shape: global.shape.rectangular,
		width: frame.width,
		height: ctx.canvas.height - frame.ceiling.y
	});
	
	// Right wall
	createBody({
		dynamic: false,
		x: ctx.canvas.width - frame.width / 2,
		y: ctx.canvas.height / 2 + frame.ceiling.y / 2,
		friction: frame.friction,
		restitution: frame.restitution,
		shape: global.shape.rectangular,
		width: frame.width,
		height: ctx.canvas.height - frame.ceiling.y
	});
}




function createRectangular() {
	return createBody({
		dynamic: true,
		x: 200,
		y: -20,
		angle: Math.random()*360,
		density: 1.0,
		friction: 0.8,
		restitution: 1.3,
		shape: global.shape.rectangular,
		width: 10,
		height: 15
	});
}


function createCircle() {
	return createBody({
		restitution: 2.0
	});
}

function createPolygon() {
	return createBody({
		shape: global.shape.polygon,
		points: [[0,0], [40, 50], [50, 100], [-50, 100], [-40, 50]]
	});
}


function createFood(position) {
  var newFood = createBody({
    dynamic: true,
    x: position.x,
    y: position.y,
    angle: Math.floor(Math.random()*360),
    density: 1.0,
    friction: 0.8,
    restitution: 0.3,
    shape: global.shape.circular,
    diameter: Math.floor(10 + Math.random()*5),
  });
  newFood.entityType = "food";
  return newFood;
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
  cat.timeLeft = catDefs.timeLeft;
  cat.entityType = "cat";
  return cat;
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

function validSpawnSpot(position, catPosiArray) {
	var distance = 0;
  var i;
	for(i = 0; i < catPosiArray.length; i++)
	{
		distance = Math.sqrt(Math.pow((catPosiArray[i].x-position.x), 2) + Math.pow((catPosiArray[i].y-position.y), 2));
		console.log(distance);
		if(distance < catDefs.spawnDistance) 
		{
			return false;
		}
	}
	return true;
}
