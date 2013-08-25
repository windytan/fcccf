
var textureOverBody = 5;


var imageDefs = {
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
	ingame: "background.png",
	foreground: "foreground.png"
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


function drawCat (cat) {
  ctx.save();
  transformWorld(cat);
  var w = catDefs.width;
  var h = catDefs.height;
	var o = textureOverBody;
  var state = catState(cat);
  var img = game.images.cat[state];
  var c = cat.catColor;
  ctx.fillStyle = "rgb(" + c.r + "," + c.g + "," + c.b + ")";
  ctx.fillRect(-w/2, -h/2, w, h);
  ctx.drawImage(img, -w/2-o, -h/2-o, w+o*2, h+o*2);
  ctx.restore();
}


function drawItem (item) {
  ctx.save();
  transformWorld(item);
  if (item.entityType === "food") {
    var type = item.foodType;
    var state = foodState(item);
    var w = foodDefs.types[type].width;
    var h = foodDefs.types[type].height;
    var img = game.images[type][state];
    ctx.drawImage(img, -w/2, -h/2, w, h);
  }
  else {
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, 2*Math.PI, false);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBackground(gameState) 
{
	ctx.save();
	var img = game.images.background[gameState];
	ctx.drawImage(img, 0, 0);
	ctx.restore();
}
