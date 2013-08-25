function createLevel(levelNumber) {
	if (levelNumber === undefined)
		levelNumber = 0;
	
	createLevelFrames();
	levelLayer.cats = generateCats();
	catAI.init(levelLayer.cats);
	levelLayer.spawnItem();
	
	switch(levelNumber) {
		case 0:
			createDebugLevel();
			break;
	}
}




function createDebugLevel() {
	createPropeller({
		x: 650,
		y: 430,
		angle: 180
	});
}

