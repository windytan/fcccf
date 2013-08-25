var catAI = {
    catzes: [],
	zeFood: [],
	jumpingPower: 30,
	
	init: function(catz) {
		this.catzes = catz;
	},
	
    logic: function() {
	    if(0<this.catzes.length) {
		    if(this.catzes[0].GetLinearVelocity().Length()===0)
			{
	            var force = new Box2D.Common.Math.b2Vec2(15, 0 - this.jumpingPower);
		        this.catzes[0].ApplyImpulse(force, this.catzes[0].GetPosition());
			}
		}
	},
	
	nearestFood: function(index) {
	    var i = 0;
		var shortestD = Number.MAX_VALUE;
		var d = 0;
        for(i =0; i < zeFood.length; i++)
		{
            d = this.distance(catzes[index].GetPosition(), zeFood[i].GetPosition());
		}
	},
	
	distance: function(position1, position2)
	{
	    console.log(position1.x);
		return  Math.sqrt(Math.pow((position1.x-position2.x), 2) + Math.pow((position1.y-position2.y), 2));
	}
};