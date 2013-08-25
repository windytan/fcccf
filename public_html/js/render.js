var textureOverBody = 5;


var imageDefs = {
  cat: {
    normal: "cat_normal_texture.png"
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
  // ctx.fillStyle = "red";
  transformWorld(cat);
  var w = catDefs.width;
  var h = catDefs.height;
	var o = textureOverBody;
  // ctx.translate(-w/2, -h/2);
  // ctx.fillRect(0, 0, w, h);
  var img = game.images.cat.normal;
  ctx.drawImage(img, -w/2-o, -h/2-o, w+o*2, h+o*2);
  ctx.restore();
}


function drawItem (item) {
  ctx.save();
  ctx.strokeStyle = "blue";
  transformWorld(item);
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, 2*Math.PI, false);
  ctx.stroke();
  ctx.restore();
}

