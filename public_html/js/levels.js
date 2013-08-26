function createLevel(levelNumber) {
	if (levelNumber === undefined)
		levelNumber = 0;
	
	var info = levelInfo[levelNumber];
	
	var levelLayer = new LevelLayer({
		levelNumber: levelNumber,
		scoreGoal: info.scoreGoal
	});
	
	createLevelFrames();
  levelLayer.props = [];
	
	levelLayer.cats = generateCats(info);
	catAI.init(levelLayer.cats);
	levelLayer.spawnItem();
	
	if (info.propellers !== undefined) {
		$.each(info.propellers, function(i, propellerDef) {
			levelLayer.props.push(createPropeller(propellerDef));
		});
	}
	
	return levelLayer;
}


var levelInfo = [
	{
		cats: 3,
		scoreGoal: 10
	},
	{
		cats: 4,
		scoreGoal: 20,
		propellers: [{x: 650, y: 430}]
	},
	{
		cats: 5,
		yMax: 500,
		scoreGoal: 30,
		propellers: miniPropellers()
	},
	{
		cats: 6,
		scoreGoal: 25,
		propellers: [{x: 400, y: 320, width: 200, height: 200}]
	},
	{

		cats: 6,
		yMin: 390,
		yMax: 460,
		scoreGoal: 30,
		propellers: funnelLevelPropellers()
	},
	{
		cats: 4,
		scoreGoal: 30,
		xMin: 300,
		xMax: 500,
		yMin: 300,
		yMax: 410,
		propellers: ballLevelPropellers()
	},
	{
		cats: 3,
		scoreGoal: 60,
		propellers: halfCirclePropels()
	},
	{
		cats: 5,
		yMin:300,
		yMax: 100,
		scoreGoal: 30,
		propellers: propellerRoof()
	},
	{
		cats: 3,
		yMax: 430,
		scoreGoal: 40,
		propellers: propellerwall()
	}
	
];


function amountOfLevels() {
	return levelInfo.length;
}

function massStationaryPropel(x, y, width, height, speed, angle, distance, amount, torque) 
{
	var propellers = [];
	for(var i = 0; i<amount; ++i) {
		propellers.push({
					x: x + i * distance,
					y: y,
					width: width,
					height: height,
					speed: speed,
					angle: angle,
					torque: torque,
					clockwise: true
				});
	}
	return propellers;
}

function halfCirclePropels() {
	var width = 120;
	var height = 8;
	var propellers = [];
	for(var i = 270; i > 150; i -= 30) {
		propellers.push({
					x: 400 + 300*Math.cos(i * (180/Math.PI)),			
					y: 300 + 300*Math.sin(i * (180/Math.PI)),
					width: width,
					height: height,
					angle: Math.random() * 360,
					clockwise: Math.random() < 0.5
				});
	}
	propellers.push({
					x: 400,
					y: 560,
					width: width,
					height: height,
					clockwise: true
				});
	return propellers;
}

function propellerRoof() {
	var x = 50;
	var y = 400;
	var width = 60;
	var height = 8;
	var speed = 0;
	var angle = 0;
	var propellers = [];
    var distance = 70;
	propellers = propellers.concat(massStationaryPropel(x, y, width, height, speed, angle, distance, 4, 100000));
	propellers = propellers.concat(massStationaryPropel(530, y, width, height, speed, angle, distance, 4, 100000));
	propellers.push({
				x: 400,
				y: 400,
				width: 160,
				height: 8,
				speed: 0,
				torque: 0,
				clockwise: false
			});
	return propellers
}

function propellerwall() {
	var x = 150;
	var y = 300;
	var width = 110;
	var height = 5;
	var speed = 0;
	var angle = 0;
	var propellers = [];
    var distance = 120;
	propellers = massStationaryPropel(x, y, width, height, speed, angle, distance, 5, 0);
	propellers.push({
				x: 25,
				y: 509,
				width: 30,
				height: 4,
				speed: 2000,
				clockwise: false
			});
	propellers.push({
				x: 775,
				y: 509,
				width: 30,
				height: 4,
				speed: 2000,
				clockwise: true
			});
	propellers.push({
				x: 58,
				y: 565,
				width: 95,
				height: 8,
				speed: 720,
				clockwise: false
			});
	propellers.push({
				x: 742,
				y: 564,
				width: 95,
				height: 8,
				speed: 720,
				clockwise: true
			});
	return propellers
}

function miniPropellers() {
	var x = 33;
	var y = 592;
	var width = 40;
	var height = 5;
	var speed = 1080;
	var angle = 0;
	
	var distance = 32;
		
	var propellers = [];
	for (var i = 0; i < 24; ++i) {
		var direction = false;
		if (i % 2 === 0)
			direction = true;
		
		propellers.push({
			x: x + i * distance,
			y: y,
			width: width,
			height: height,
			speed: speed,
			angle: angle + i % 2 * 90,
			clockwise: direction
		});
	}
	return propellers;
}

function funnelLevelPropellers() {
	var x = 110;
	var y = 300;
	var width = 200;
	var speed = 0;
	var angle = 25;
	
	var propellers = [];
	
	propellers.push({
		x: x,
		y: y,
		width: width,
		speed: speed,
		angle: angle
	});
	propellers.push({
		x: 800 - x,
		y: y,
		width: width,
		speed: speed,
		angle: -angle
	});
	propellers.push({
		x: 400,
		y: 550,
		width: 100,
		speed: 1080,
		clockwise: Math.random() < 0.5
	});
	
	return propellers;
}


function ballLevelPropellers() {
	var propellers = [];
	
	var x1 = 330;
	var y1 = 250;
	var angle1 = 25;
	
	var x2 = 250;
	var y2 = 350;
	var angle2 = 90;
	
	var x3 = 330;
	var y3 = 450;
	var angle3 = 155;
	
	var width = 120;
	var speed = 45;
	
	var direction = false;
	
	propellers.push({
		x: x1,
		y: y1,
		width: width,
		angle: -angle1,
		speed: speed,
		clockwise: direction
	});
	propellers.push({
		x: 800 - x1,
		y: y1,
		width: width,
		angle: angle1,
		speed: speed,
		clockwise: !direction
	});
	
	propellers.push({
		x: x2,
		y: y2,
		width: width,
		angle: -angle2,
		speed: speed,
		clockwise: direction
	});
	propellers.push({
		x: 800 - x2,
		y: y2,
		width: width,
		angle: angle2,
		speed: speed,
		clockwise: !direction
	});
	
	propellers.push({
		x: x3,
		y: y3,
		width: width,
		angle: -angle3,
		speed: speed,
		clockwise: direction
	});
	propellers.push({
		x: 800 - x3,
		y: y3,
		width: width,
		angle: angle3,
		speed: speed,
		clockwise: !direction
	});
	
	return propellers;
}