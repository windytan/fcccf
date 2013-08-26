var debug = false;
var startingLayer = menuLayer;
var startingLevelNumber = 2;

var ctx;


var global = {
	shape: {
		circle: 1,
		rectangular: 2,
		polygon: 3
	},
	hand: {
		y: 75,
		gapToWalls: 65
	},
	dropCooldown: 60
};


$(document).ready(function() {
  var canvas = $("canvas")[0];
	ctx = canvas.getContext("2d");
  loadResourcesAndRunInit(game);

  startMusic();
});


function loadResourcesAndRunInit (gameObject) {
  var images = {};
  var count = 0;
  var loadedCount = 0;

  var checkReady = function() {
    loadedCount += 1;
    console.log("Loaded %d/%d: %s", loadedCount, count, this.src);
    if (loadedCount === count) {
      // All images loaded
      console.log("All images (%d) loaded, running game.init...", loadedCount);
      gameObject.images = images;
      gameObject.init();
    }
  };

  var loadImage = function (src) {
    src = "img/" + src;
    // console.log("Loading image:", src);
    var img = new Image();
    img.onload = checkReady;
    img.src = src;
    return img;
  };

  console.log("Loading images...");
  var entity;
  var imageType;
  // Note: no isOwnProperty here, don't pass objects with stuff in the prototype!
  for (entity in imageDefs) {
    images[entity] = {};
    for (imageType in imageDefs[entity]) {
      images[entity][imageType] = loadImage(imageDefs[entity][imageType]);
      count += 1;
    }
  }
}


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
  images: null,

	init: function() {
    if (game.images == null) {
      console.log("Error: game.images is", game.images);
    }

		if (debug) {
			this.layer.push(startingLayer);
			this.currentLayer().init(startingLevelNumber);
		} else {
			this.layer.push(menuLayer);
			this.currentLayer().init();
		}
		
    // Use this to add a callback function that takes current mouse position
    // as an additional parameter. Only makes sense for mouse events (i.e. click)
    ctx.canvas.addMouseEventListener = function (type, callback, useCapture) {
      ctx.canvas.addEventListener(type, withMouse(callback), useCapture);
    };
    ctx.canvas.addMouseEventListener("click", game.onClick, false);
    ctx.canvas.addMouseEventListener("mousemove", game.onMouseMove, false);

    ctx.canvas.style.cursor = "none";
		game.step();
	},

	logic: function() {
    this.currentLayer().logic();
	},

	render: function() {
		this.currentLayer().render();
		
		drawCursor();
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
    var layer = game.currentLayer();
		/*
    if (layer.upperBorder !== undefined) {
      if (cursor.y > layer.upperBorder) {
        cursor.y = layer.upperBorder;
      }
    }
		*/
    game.cursor = cursor;
  },

	step: function() {
		game.tick++;
		game.logic();
		game.render();
		requestAnimFrame(game.step);
	},
};

function startMusic() {
  var music = new Audio('snd/kokomjau.ogg');
  music.loop = true;
  music.play();
}

function playSoundEffect(name) {
	var snd = new Audio(name);
	snd.play();
}

function soundEffectVariator(maxIndex) {
	return Math.floor(Math.random()*maxIndex+1);
}

window.requestAnimFrame = (function(){
  return window.requestAnimationFrame		  ||
		  window.webkitRequestAnimationFrame  ||
		  window.mozRequestAnimationFrame	  ||
		  window.oRequestAnimationFrame		  ||
		  window.msRequestAnimationFrame	  ||
		  function(callback, element){
			window.setTimeout(callback, 1000 / 60);
		  };
  }());
