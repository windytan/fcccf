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
		cats: 1,
		scoreGoal: 0
	},
	{
		cats: 3,
		scoreGoal: 0,
		propellers: [{x: 650, y: 430}]
	},
	{
		cats: 4,
		yMax: 500,
		scoreGoal: 0,
		propellers: miniPropellers()
	}
];


function amountOfLevels() {
	return levelInfo.length;
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