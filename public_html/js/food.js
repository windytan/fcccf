
var foodDefs = {
  diameter: 15,
  density: 1.0,
  friction: 0.8,
  restitution: 0.3,
  types: {
    fish: {
      width: 40,
      height: 20
    },

    cheezburger: {
      width: 20,
      height: 20
    }
  }
};


function createFood(position) {
  var type = randomFoodType();

  var newFood = createBody({
    dynamic: true,
    x: position.x,
    y: position.y,
    angle: Math.floor(Math.random()*360),
    density: foodDefs.density,
    friction: foodDefs.friction,
    restitution: foodDefs.restitution,
    shape: global.shape.rectangular,
    width: foodDefs.types[type].width,
    height: foodDefs.types[type].height
  });
  newFood.entityType = "food";
  newFood.foodType = type;
  return newFood;
}


function randomFoodType () {
  var choices = [];
  var key;
  for (key in foodDefs.types) {
    choices.push(key);
  }
  return randomChoice(choices);
}


function randomChoice (choices) {
  var i = randomInt(choices.length);
  return choices[i]; 
}


// Random integer between 0 and max (exclusive, i.e. randomInt(1) is always 0)
function randomInt (upper) {
  return Math.floor(Math.random() * upper);
}

