function createLevel(levelNumber) {
	if (levelNumber === undefined)
		levelNumber = 0;
	
	var info = levelInfo[levelNumber];
	
	createLevelFrames();
  levelLayer.props = [];
	
	levelLayer.cats = generateCats(info.cats);
	catAI.init(levelLayer.cats);
	levelLayer.spawnItem();
	
	if (info.propellers !== undefined) {
		$.each(info.propellers, function(i, propellerDef) {
			levelLayer.props.push(createPropeller(propellerDef));
		});
	}
	
//	switch(levelNumber) {
//		case 0:
//			createDebugLevel(levelLayer);
//			break;
//	}
}


var levelInfo = [
	{	// Test level
		cats: 4,
		scoreGoal: 10,
		propellers: [{x: 650, y: 430, angle: 180}]
	},
	{	// Level 1
		cats: 2,
		scoreGoal: 10
	}
];





function createDebugLevel(layer) {
	var propeller = createPropeller({
		x: 650,
		y: 430,
		angle: 180
	});
  layer.props.push(propeller);
}

