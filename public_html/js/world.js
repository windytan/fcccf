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
var b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef;


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






var defaults = {
	body: function(def) {
		if (def.dynamic === undefined) def.dynamic = true;
		if (def.x === undefined) def.x = 400;
		if (def.y === undefined) def.y = 320;
		if (def.angle === undefined) def.angle = 0;
	},
	
	fixture: function(def) {
		if (def.density === undefined) def.density = 1.0;
		if (def.friction === undefined) def.friction = 1.0;
		if (def.restitution === undefined) def.restitution = 0.0;
		if (def.shape === undefined) def.shape = global.shape.circle;
		if (def.width === undefined) def.width = 10;
		if (def.height === undefined) def.height = 10;
		if (def.diameter === undefined) def.diameter = 10;
		return def;
	},
	
	joint: function(def) {
		
	},
	
	motorJoint: function(def) {
		if (def.x === undefined) def.x = 400;
		if (def.y === undefined) def.y = 320;
		if (def.speed === undefined) def.speed = 45;
		if (def.torque === undefined) def.torque = 100;
		if (def.clockwise === undefined) def.clockwise = true;
	},
	
	propeller: function(def) {
		if (def.width === undefined) def.width = 150;
		if (def.height === undefined) def.height = 10;
		if (def.speed === undefined) def.speed = 360;
		if (def.torque === undefined) def.torque = 100000;
	},
	
	catGeneration: function(info) {
		if (info.cats === undefined) info.cats = 4;
		if (info.xMin === undefined) info.xMin = 50;
		if (info.xMax === undefined) info.xMax = 750;
		if (info.yMin === undefined) info.yMin = 320;
		if (info.yMax === undefined) info.yMax = 540;
	}
};



function createBody(definition) {
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
	defaults.body(definition);
	var bodyDef = new b2BodyDef;

	if (definition.dynamic)
		bodyDef.type = b2Body.b2_dynamicBody;
	else
		bodyDef.type = b2Body.b2_staticBody;

	bodyDef.position.x = definition.x / scale;
	bodyDef.position.y = definition.y / scale;
	bodyDef.angle = toRadians(definition.angle);

	return bodyDef;
}


function createFixtureDef(definition) {
	defaults.fixture(definition);
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


function createJoint(bodyA, bodyB, x, y) {
	var jointDef = new b2RevoluteJointDef;
	var jointCenter = new b2Vec2(x / scale, y / scale);
	jointDef.Initialize(bodyA, bodyB, jointCenter);
	return world.CreateJoint(jointDef);
}


function createWeldJoint(bodyA, bodyB, x, y) {
	var jointDef = new b2WeldJointDef;
	var jointCenter = new b2Vec2(x / scale, y / scale);
	jointDef.Initialize(bodyA, bodyB, jointCenter);
	return world.CreateJoint(jointDef);
}


function createMotorJoint(bodyA, bodyB, def) {
	defaults.motorJoint(def);
	var joint = createJoint(bodyA, bodyB, def.x, def.y);
	joint.EnableMotor(true);
	if (def.clockwise)
		joint.SetMotorSpeed(toRadians(def.speed));
	else
		joint.SetMotorSpeed(toRadians(-def.speed));
	
	joint.SetMaxMotorTorque(def.torque);
}


function createPointVectories(points) {
	var vecPoints = [];

	$.each(points, function(i, point) {
		vecPoints.push(new b2Vec2(point[0] / scale, point[1] / scale));
	});

	return vecPoints;
}


function toRadians(degrees) {
  return degrees / 180 * Math.PI;
}


function toDegrees(radians) {
	return radians / Math.PI * 180;
}


function pxToM (vector) {
  return { x: vector.x / scale, y: vector.y / scale };
}


function mToPx (vector) {
  return { x: vector.x * scale, y: vector.y * scale };
}

