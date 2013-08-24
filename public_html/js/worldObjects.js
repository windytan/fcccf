var frame = {
	width: 10,
	friction: 0.6,
	restitution: 0.3,
	
	ceiling: {
		y: -400,
		restitution: 0.0
	}
};

var cat = {
	angle: 0,
	density: 20,
	friction: 1,
	restitution: 0.1,
	width: 50,
	height: 30,
	maxAmount: 12,
	minAmount: 3,
	spawnDistance: 70,
	maxSpawnY: 200
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


function createFood(position) {
  return createBody({
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
}

function createCat(position) {
	return createBody({
		dynamic: true,
		x: position.x,
		y: position.y,
		angle: cat.angle,
		density: cat.density,
		friction: cat.friction, 
		restitution: cat.restitution,
		shape: global.shape.rectangular,
		width: cat.width,
		height: cat.height
	});
}

function generateCats() {
	var catLocations = new Array();
	var numCats = cat.minAmount + Math.random()*cat.maxAmount;
	var spawnSpot;
	for (var i = 0; i < numCats; i++)
	{
		spawnSpot = {x: Math.random()*(ctx.canvas.width-cat.width/2), y: ctx.canvas.height-cat.height/2- Math.random()*cat.maxSpawnY};
		while(!validSpawnSpot(spawnSpot, catLocations))
		{
			spawnSpot = {x: Math.random()*(ctx.canvas.width-cat.width/2), y: ctx.canvas.height-cat.height/2- Math.random()*cat.maxSpawnY};
		}
		catLocations[i] = spawnSpot;
		createCat(catLocations[i]);
	}
}

function validSpawnSpot(position, catPosiArray) {
	var distance = 0;
	for(var i = 0; i < catPosiArray.length; i++)
	{
		distance = Math.sqrt(Math.pow((catPosiArray[i].x-position.x), 2) + Math.pow((catPosiArray[i].y-position.y), 2));
		console.log(distance);
		if(distance < cat.spawnDistance) 
		{
			return false;
		}
	}
	return true;
}
