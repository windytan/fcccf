var catTextureOverBody = 5;
var itemTextureOverBody = 2;


var imageDefs = {
  hand: {
    normal: "player.png"
  },

  cat: {
    normal: "cat_normal_texture.png",
    hungry: "cat_hungry_texture.png",
    starving: "cat_starving_texture.png",
    dead: "cat_dead_texture.png"
  },

  cheezburger: {
    normal: "cheezburger.png",
    rotten: "cheezburger_rotten.png"
  },

  fish: {
    normal: "fish.png",
    rotten: "fish_rotten.png"
  },
  background: {
    menu: "titleScreen.jpg",
		selection: "level_select.png",
    ingame: "background.png",
    foreground: "foreground.png",
		credits: "credits.png",
  },
  props: {
    propeller: "woodplank.png"
  },
  buttons: {
		startButton: "button_start.png",
		creditsButton: "button_credits.png",
		levelButton: "button_level.png",
		backButton: "button_back.png",
		tryagain: "button_try_again.png",
		nextlevel: "button_next_level.png",
		quit: "button_quit.png",
		completed: "level_completed.png",
		lost: "game_over.png"
  }
};


function clearScreen() {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}


function setupDebugDraw() {
	var debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(ctx);
	debugDraw.SetDrawScale(scale);
	debugDraw.SetFillAlpha(0.3);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	
	world.SetDebugDraw(debugDraw);
}


function transformWorld (thingy) {
  var pos = mToPx(thingy.GetPosition());
  ctx.translate(pos.x, pos.y);
  ctx.rotate(thingy.GetAngle());
}


function drawProp (prop) {
  if (prop.propType === "propeller") {
    ctx.save();
    transformWorld(prop);
    // console.log(mToPx(prop.GetPosition()));
    var type = prop.propType;
    var img = game.images.props[type];
    var def = prop.GetUserData();
    defaults.propeller(def);
    var w = def.width;
    var h = def.height;
    ctx.drawImage(img, -w/2, -h/2, w, h);
    ctx.restore();
  }
  else {
    console.log("Unknown prop type:", prop.propType);
  }
}


function drawCat (cat) {
  ctx.save();
  transformWorld(cat);
  var w = catDefs.width;
  var h = catDefs.height;
	var o = catTextureOverBody;
  var state = catState(cat);
  var img = game.images.cat[state];
  var c = cat.catColor;
  var ac;
  if (cat.timeLeft <= 0) {
    ac = { r: 128, g: 128, b: 128 };
  }
  else {
    var hunger = 1 - Math.max(0, cat.timeLeft) / catDefs.timeLeft;
    ac = {
      r: Math.floor(Math.max(c.r, 128 * (1 + hunger))),
      g: Math.floor(c.g * (1 - 0.75 * hunger)),
      b: Math.floor(c.b * (1 - 0.75 * hunger))
      // g: c.g,
      // b: c.b
    };
  }
  ctx.fillStyle = "rgb(" + ac.r + "," + ac.g + "," + ac.b + ")";
  ctx.fillRect(-w/2, -h/2, w, h);
  ctx.drawImage(img, -w/2-o, -h/2-o, w+o*2, h+o*2);
  ctx.restore();
}


function drawHand(x, y) {
	var img = game.images.hand.normal;
	var w = img.width;
	var h = img.height;
	ctx.translate(x, y);
	ctx.drawImage(img, -w / 2, -h / 2 - 20, w, h);
	ctx.restore();
	
	var number = game.currentLayer().eventTimer / 60;
	number = Math.ceil(number);
	ctx.font = "30px Arial";
	ctx.textAlign = "center";
	ctx.fillStyle = rainbowGradient();

	ctx.fillText(number, x, y-45);
	ctx.strokeText(number, x, y-45);
}

function rainbowGradient() {
	var grd = ctx.createLinearGradient(0, 640, 800, 0);
	var gradientStops = 300;

	for (var i = 0; i < gradientStops; ++i) {
		var color = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#8F00FF"];
		grd.addColorStop(i/gradientStops, color[i % color.length]);
	}
	return grd;
}


function drawItem (item) {
  ctx.save();
  transformWorld(item);
  if (item.entityType === "food") {
    var type = item.foodType;
    var state = foodState(item);
    var w = foodDefs.types[type].width;
    var h = foodDefs.types[type].height;
		var o = itemTextureOverBody;
    var img = game.images[type][state];
    ctx.drawImage(img, -w/2-o, -h/2-o, w+o*2, h+o*2);
  }
  else {
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, 2*Math.PI, false);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBackground(gameState) {
	ctx.save();
	var img = game.images.background[gameState];
	ctx.drawImage(img, 0, 0);
	ctx.restore();
}

function drawButtonImage(name, x, y, width, height) {
	ctx.save();
	var img = game.images.buttons[name];
	ctx.drawImage(img, x, y);
	ctx.restore();
}

function drawCursor() {
	ctx.beginPath();
	ctx.strokeStyle = "#000000";
	ctx.arc(game.cursor.x, game.cursor.y, 7, 0, 2*Math.PI);
	ctx.stroke();
	ctx.fillStyle = "#ffc0cb";
	ctx.fill();
}
