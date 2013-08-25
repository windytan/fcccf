function createLevel(levelNumber) {
	if (levelNumber === undefined)
		levelNumber = 0;
	
	createLevelFrames();
  levelLayer.props = [];
	levelLayer.cats = generateCats();
	catAI.init(levelLayer.cats);
	levelLayer.spawnItem();
	
	switch(levelNumber) {
		case 0:
			createDebugLevel(levelLayer);
			break;
	}
}




function createDebugLevel(layer) {
	var propeller = createPropeller({
		x: 650,
		y: 430,
		angle: 180
	});
  layer.props.push(propeller);
}

