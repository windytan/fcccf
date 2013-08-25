var frame = {
	width: 10,
	friction: 0.6,
	restitution: 0.3,
	
	ceiling: {
		y: -400,
		restitution: 0.0
	}
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






function createPropeller(def) {
	defaults.propeller(def);
	
	var anchor = createBody({
		dynamic: false,
		x: def.x,
		y: def.y,
		shape: global.shape.circle,
		diameter: 1
	});
	
	var propeller = createBody({
		x: def.x,
		y: def.y,
		angle: def.angle,
		density: 100,
		shape: global.shape.rectangular,
		width: def.width,
		height: def.height
	});
	
	createMotorJoint(anchor, propeller, {
		x: def.x,
		y: def.y,
		speed: def.speed,
		torque: def.torque,
		clockwise: def.clockwise
	});
}

