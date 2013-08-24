var debug = true;

var ctx;

$(document).ready(function() {
  var canvas = $("canvas")[0];
	ctx = canvas.getContext("2d");
  // Use this to add a callback function that takes current mouse position
  // as an additional parameter. Only makes sense for mouse events (i.e. click)
  canvas.addMouseEventListener = function (type, callback, useCapture) {
    canvas.addEventListener(type, withMouse(callback), useCapture);
  };
  canvas.addMouseEventListener("click", game.onClick, false);
  canvas.addMouseEventListener("mousemove", game.onMouseMove, false);
	game.init();
});


function withMouse (func) {
  return function (event) {
    var co = $(ctx.canvas).offset();
    var mouse = {
      x: event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(co.left),
      y: event.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(co.top) + 1
    };
    func(event, mouse);
  };
}


var game = {
	tick: 0,

  cursor: { x: 0, y : 0 },
  clicked: false,
  upperBorder: 100,

  itemInHand: null,
  items: Array(),
	
	init: function() {
		gameWorld.init();
		if (debug) setupDebugDraw();
    document.body.style.cursor = "none";
		
		createLevelFrames();
    createCat({x: 400, y: 400});
    game.spawnItem();
		
		game.step();	// Start the game already!
	},

	logic: function() {
		// if (this.tick % 50 === 1) {
		// 	createRectangular();
		// }
    
    if (game.itemInHand != null) {
      // console.log(game.cursor);
      game.itemInHand.SetPosition(pxToM(game.cursor));
    }
    if (game.clicked) {
      game.clicked = false;
      game.dropItem();
    }

		world.Step(gameWorld.timeStep, gameWorld.velocityIterations, gameWorld.positionIterations);
		world.ClearForces();
	},

	render: function() {
		world.DrawDebugData();
	},

  onClick: function (event, cursor) {
    game.updateCursor(cursor);
    game.clicked = true;
  },

  onMouseMove: function (event, cursor) {
    game.updateCursor(cursor);
  },

  updateCursor: function (cursor) {
    if (cursor.y > game.upperBorder) {
      cursor.y = game.upperBorder;
    }
    game.cursor = cursor;
  },

	step: function() {
		game.tick++;
		game.logic();
		game.render();
		requestAnimFrame(game.step);
	},

  spawnItem: function () {
    game.itemInHand = createFood(game.cursor);
    game.itemInHand.SetActive(false);
  },

  dropItem: function () {
    var droppedItem = game.itemInHand;
    game.items.push(droppedItem);
    droppedItem.SetActive(true);
    game.spawnItem();
  },
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
