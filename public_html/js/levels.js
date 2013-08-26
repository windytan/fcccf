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
		scoreGoal: 25,
		propellers: [{x: 650, y: 430}]
	},
	{
		cats: 5,
		yMax: 500,
		scoreGoal: 40,
		propellers: miniPropellers()
	},
	{
		cats: 3,
		yMax: 430,
		scoreGoal: 45,
		propellers: propellerwall()
	}
	
];


function amountOfLevels() {
	return levelInfo.length;
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
	for(var i = 0; i < 5; ++i) {
		propellers.push({
				x: x + i * distance,
				y: y,
				width: width,
				height: height,
				speed: speed,
				angle: angle,
				torque: 0,
				clockwise: true
			});
	}
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