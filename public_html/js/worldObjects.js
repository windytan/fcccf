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

