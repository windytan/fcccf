var debug = true;

var ctx;

$(document).ready(function() {
  var canvas = $("canvas")[0];
	ctx = canvas.getContext("2d");
  // Use this to add a callback function that takes current mouse position
  // as an additional parameter. Only makes sense for mouse events (i.e. click)
  canvas.addMouseEventListener = function (type, callback, useCapture) {
    canvas.addEventListener(type, withMouse(ctx.canvas, callback), useCapture);
  };
  canvas.addMouseEventListener("click", game.onClick, false);
	game.init();
});


function withMouse (canvas, func) {
  var co = $(ctx.canvas).offset();
  return function (event) {
    var mouse = {
      x: event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(co.left),
      y: event.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(co.top) + 1
    };
    func(event, mouse);
  };
}


var game = {
	tick: 0,
	
	init: function() {
		gameWorld.init();
		if (debug) setupDebugDraw();
		
		createFloor();
		
		game.step();	// Start the game already!
	},

	logic: function() {
		// if (this.tick % 50 === 1) {
		// 	createRectangular();
		// }
		
		world.Step(gameWorld.timeStep, gameWorld.velocityIterations, gameWorld.positionIterations);
		world.ClearForces();
	},

	render: function() {
		world.DrawDebugData();
	},

  onClick: function (event, mouse) {
    // console.log(mouse);
    createFood(mouse);
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
