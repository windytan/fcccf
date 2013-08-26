function createLevel(levelNumber) {
	if (levelNumber === undefined)
		levelNumber = 0;
	
	var levelLayer = new LevelLayer(levelNumber)
	
	var info = levelInfo[levelNumber];
	
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
		cats: 2,
		scoreGoal: 10
	},
	{
		cats: 3,
		scoreGoal: 10,
		propellers: [{x: 650, y: 430}]
	},
	{
		cats: 4,
		yMax: 500,
		scoreGoal: 10,
		propellers: miniPropellers()
	}
];



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