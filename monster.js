class Monster {

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * 
     * Monster class
     *
     * * * * * * * * 
     *
     * Parameters:
     *
     * @param 	type 		// 0: imp
	 *						// 1: peasant
	 *						// 3: grue
	 *			name
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

	constructor (num){
		if(num == 0)
			this.name = "IMP";
		if(num == 1)
			this.name = "PEASANT";
			// "'Death to collaborators,' he yells"
		if(num == 2)
			this.name = "GRUE";

		this.type = num;
		this.health = num * 3;
		

	}

	getName(){
		return this.name;
	}
}