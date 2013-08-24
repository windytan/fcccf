var debug = true;

var ctx;

$(document).ready(function() {
	ctx = $("canvas")[0].getContext("2d");
	
	game.init();
});






var game = {
	tick: 0,
	
	init: function() {
		gameWorld.init();
		if (debug) setupDebugDraw();
		
		createFloor();
		
		game.step();	// Start the game already!
	},

	logic: function() {
		if (this.tick % 50 === 1) {
			createRectangular();
		}
		
		world.Step(gameWorld.timeStep, gameWorld.velocityIterations, gameWorld.positionIterations);
		world.ClearForces();
	},

	render: function() {
		world.DrawDebugData();
	},

	step: function() {
		game.tick++;
		game.logic();
		game.render();
		requestAnimFrame(game.step);
	}
};










window.requestAnimFrame = (function(){
  return window.requestAnimationFrame		  ||
		  window.webkitRequestAnimationFrame  ||
		  window.mozRequestAnimationFrame	  ||
		  window.oRequestAnimationFrame		  ||
		  window.msRequestAnimationFrame	  ||
		  function(callback, element){
			window.setTimeout(callback, 1000 / 60);
		  };
  })();