function createLevel(levelNumber) {
	if (levelNumber === undefined)
		levelNumber = 0;
	
	createLevelFrames();
	levelLayer.cats = generateCats();
	levelLayer.spawnItem();
	
	switch(levelNumber) {
		case 0:
			createDebugLevel();
			break;
	}
}




function createDebugLevel() {
	createJointTest();
	createPropeller({
		x: 650,
		y: 430,
		angle: 180
	});
}

