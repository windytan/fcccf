var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;


var world;
var scale = 30;

var gameWorld = {
	gravity: 9.81,
	velocityIterations: 16,
	positionIterations: 6,
	allowSleep: true,
	timeStep: 1 / 120,
	
	init: function() {
		var gravity = new b2Vec2(0, this.gravity);
		world = new b2World(gravity, this.allowSleep);
	}
};



var global = {
	shape: {
		circle: 1,
		rectangular: 2,
		polygon: 3
	}
};


var def = {
		body: {
			dynamic: true,
			x: 400,
			y: 320,
			angle: 0,
			density: 1.0,
			friction: 1.0,
			restitution: 0.0,
			shape: global.shape.circle,
			diameter: 10,
			width: 10,
			height: 10
		}
};


function checkDefaults(definition) {
	if (definition.dynamic === undefined) definition.dynamic = def.body.dynamic;
	if (definition.x === undefined) definition.x = def.body.x;
	if (definition.y === undefined) definition.y = def.body.y;
	if (definition.angle === undefined) definition.angle = def.body.angle;
	if (definition.density === undefined) definition.density = def.body.density;
	if (definition.friction === undefined) definition.friction = def.body.friction;
	if (definition.restitution === undefined) definition.restitution = def.body.restitution;
	if (definition.shape === undefined) definition.shape = def.body.shape;
	if (definition.width === undefined) definition.width = def.body.width;
	if (definition.height === undefined) definition.height = def.body.height;
	if (definition.diameter === undefined) definition.diameter = def.body.diameter;
	return definition;
}


function createBody(definition) {
	if (definition === undefined) definition = {};
	checkDefaults(definition);
	
	var bodyDef = createBodyDef(definition);
	var fixtureDef = createFixtureDef(definition);
	
	var body = world.CreateBody(bodyDef);
	body.CreateFixture(fixtureDef);
  return body;
}

/*
function createBodies(definitions, joints) {
	$.each(definitions, function(i, definition) {
		var bodyDef = createBodyDefinition(definition);
		var fixtureDef = createFixtureDefinition(definition);
	});
}
*/

function createBodyDef(definition) {
	var bodyDef = new b2BodyDef;
	
	if (definition.dynamic)
		bodyDef.type = b2Body.b2_dynamicBody;
	else
		bodyDef.type = b2Body.b2_staticBody;
	
	bodyDef.position.x = definition.x / scale;
	bodyDef.position.y = definition.y / scale;
	bodyDef.angle = degree(definition.angle);
	
	return bodyDef;
}


function createFixtureDef(definition) {
	var fixtureDef = new b2FixtureDef;
	fixtureDef.density = definition.density;
	fixtureDef.friction = definition.friction;
	fixtureDef.restitution = definition.restitution;
	
	if (definition.shape === global.shape.circle) {
		fixtureDef.shape = new b2CircleShape(definition.diameter / scale);
	} else if (definition.shape === global.shape.rectangular) {
		fixtureDef.shape = new b2PolygonShape;
		fixtureDef.shape.SetAsBox(definition.width / 2 / scale, definition.height / 2 / scale);
	} else if (definition.shape === global.shape.polygon) {
		fixtureDef.shape = new b2PolygonShape;
		var points = createPointVectories(definition.points);
		fixtureDef.shape.SetAsArray(points, points.length);
	}
	
	return fixtureDef;
}


function createJoint(body1, body2, x, y) {
	var jointDef = new b2RevoluteJointDef;
	var jointCenter = new b2Vec2(x / scale, y / scale);
	jointDef.Initialize(body1, body2, jointCenter);
	world.CreateJoint(jointDef);
}



function createPointVectories(points) {
	var vecPoints = [];
	
	$.each(points, function(i, point) {
		vecPoints.push(new b2Vec2(point[0] / scale, point[1] / scale));
	});
	
	return vecPoints;
}


function degree(radian) {
  return radian / 180 * Math.PI;
}


function radian(degree) {
	return degree / Math.PI * 180;
}


function pxToM (vector) {
  return { x: vector.x / scale, y: vector.y / scale };
}


function mToPx (vector) {
  return { x: vector.y * scale, y: vector.y * scale };
}


