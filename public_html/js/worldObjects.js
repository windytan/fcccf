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
	var catLocations = new Array();
	var numCats = catDefs.minAmount + Math.random()*catDefs.maxAmount;
	var spawnSpot;
  var cats = [];
	for (var i = 0; i < numCats; i++)
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
	for(var i = 0; i < catPosiArray.length; i++)
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









// Test objects

function createRectangular(x, y) {
	return createBody({
		dynamic: true,
		x: x,
		y: y,
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

function createPolygon(x, y) {
	return createBody({
		x: x,
		y: y,
		shape: global.shape.polygon,
		points: [[0,0], [40, 50], [50, 100], [-50, 100], [-40, 50]]
	});
}


function createJointTest() {
	var definition1 = {
		x: 100,
		y: 300,
		shape: global.shape.polygon,
		points: [[0,0], [40, 50], [50, 100], [-50, 100], [-40, 50]]
	};
	
	var definition2 = {
		x: 100,
		y: 350,
		shape: global.shape.rectangular,
		width: 150,
		height: 5
	};
	
	var body1 = createBody(definition1);
	var body2 = createBody(definition2);
	
	createJoint(body1, body2, 150, 100);
}











function createRevoluteJoint() {
	var bodyDef1 = new b2BodyDef;
	bodyDef1.type = b2Body.b2_dynamicBody;
	bodyDef1.position.x = 480/scale;
	bodyDef1.position.y = 50/scale;
	var body1 = world.CreateBody(bodyDef1);
	
	var fixtureDef1 = new b2FixtureDef;
	fixtureDef1.density = 1.0;
	fixtureDef1.friction = 0.5;
	fixtureDef1.restitution = 0.5;
	fixtureDef1.shape = new b2PolygonShape;
	fixtureDef1.shape.SetAsBox(50/scale, 10/scale);
	
	body1.CreateFixture(fixtureDef1);
	
	var bodyDef2 = new b2BodyDef;
	bodyDef2.type = b2Body.b2_dynamicBody;
	bodyDef2.position.x = 470/scale;
	bodyDef2.position.y = 50/scale;
	var body2 = world.CreateBody(bodyDef2);
	
	var fixtureDef2 = new b2FixtureDef;
	fixtureDef2.density = 1.0;
	fixtureDef2.friction = 0.5;
	fixtureDef2.restitution = 0.5;
	fixtureDef2.shape = new b2PolygonShape;
	var points = [
		new b2Vec2(0, 0),
		new b2Vec2(40/scale, 50/scale),
		new b2Vec2(50/scale, 100/scale),
		new b2Vec2(-50/scale, 100/scale),
		new b2Vec2(-40/scale, 50/scale)
	];
	fixtureDef2.shape.SetAsArray(points, points.length);
	body2.CreateFixture(fixtureDef2);
	
	
	var jointDef = new b2RevoluteJointDef;
	jointCenter = new b2Vec2(470/scale, 50/scale);
	
	jointDef.Initialize(body1, body2, jointCenter);
	world.CreateJoint(jointDef);
}