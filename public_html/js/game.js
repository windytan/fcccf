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

	layer: [],
  currentLayer: function () { return this.layer[this.layer.length-1]; },
	
  cursor: { x: 0, y: 0 },

	init: function() {
		this.layer.push(menuLayer);
		this.currentLayer().init();
    ctx.canvas.style.cursor = "none";
		game.step();
	},

	logic: function() {
    this.currentLayer().logic();
	},

	render: function() {
		this.currentLayer().render();
	},

  onClick: function (event, cursor) {
    game.updateCursor(cursor);
    var layer = game.currentLayer();
    if (layer.onClick !== undefined) {
      layer.onClick(event, cursor);
    }
  },

  onMouseMove: function (event, cursor) {
    game.updateCursor(cursor);
  },

  updateCursor: function (cursor) {
    if (cursor.y > this.upperBorder) {
      cursor.y = this.upperBorder;
    }
    this.cursor = cursor;
  },

	step: function() {
		game.tick++;
		game.logic();
		game.render();
		requestAnimFrame(game.step);
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
