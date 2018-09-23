// Final Reality command line javascript game
// (C) 2018 Zac Finger

// things left to do:
// ------ ---- -- ---
// add more commands to help menu/improve help menu
// clean up/document/comment main.js/main.css/index.html 
// make opening screen (first load up) block letter title screen
// add copyright info to title screen
// pull rooms and monsters programmatically from JSON file?
// add more rooms
// add north, south, west east functionality etc
// add ability to go backwards
// (load temporary save of each room so that monsters stay dead etc)
// add non violent NPCs
// make items more robust
// update battle system (earthbound battle system)
// test edge cases

// notes: http://www2.silverblade.net/cliches/
// https://stackoverflow.com/questions/1640502/pc-speaker-beep-via-javascript

///////////////////////////

// possible names
// -------- -----
// chairman of the rings // 2 results
// premier of the rings // 0 results
// president of the rings // 21 results
// citizen of the rings // 1 result
// legend of marie // 315000 results
// final reality // 61500 results
// peasant of the rings // 0 results
// bourgeoisie of the rings // 0 results
// bourgeois of the rings // 0 results

///////////////////////////

///////////////////////////

// define all the objects
var gordon = new Player(100,0);
var map = new Room(0);
var firstScreen = true;
var tempPlayer = new Player(100,0);

// set view elements to local variables
var output = document.getElementById("container");  // Get the content of the container element 
var answer = document.getElementById("answer"); // Get the answer field

//set up view
answer.focus(); // autofocus on input field
document.getElementById("answer") // answer field now allows enter key as input
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("enter").click();
    }
});

function isVowel(x) {

  var result;

  result = x == "A" || x == "E" || x == "I" || x == "O" || x == "U";
  return result;
}

function isVerbWeapon(word){ 	// Checks to see if verb issued is a weapon in inventory.
	for(var x=0; x < gordon.getWeaponAmount(); x++ ) // Cycles through inventory to check
	{
		w = gordon.getWeapon(x);

		if(word == w.getName())
			return x; // returns index of requested weapon
	}
	return -1; // returns -1 if weapon is not found in the inventory.
}

function help(){
	/* Task: Provide game information
	to user, including game description
	and a list of commands.
	In: Nothing. Out: Nothing. */
	/*
	output.innerHTML += "<br>F I N A L R E A L I T Y<br>";
	output.innerHTML += "= = = = = = = = = = = =<br><br>";*/

	output.innerHTML += "COMMAND LIST<br>";
	output.innerHTML += "======= ====<br>"
	output.innerHTML += "All commands in FINAL REALITY must be entered in verb-noun pairs.<br><br>";
	output.innerHTML += "Verb             - Noun               : Function<br>";
	output.innerHTML += "-------------    --------------------   --------<br>"
	output.innerHTML += "help             - me                 : Accesses this list at any time during gameplay.<br>";
	output.innerHTML += "scan             - environs           : Examine current location.<br>";
	output.innerHTML += "go               - (forward/backward) : Translates character in desired direction.<br>";
	output.innerHTML += "taketh           - (name of weapon)   : Allows user to add a weapon encountered in a room<br>";
	output.innerHTML += "										 to their inventory.<br>";
	output.innerHTML += "scan             - (name of monster)  : Allows user to examine monster.<br>";
	output.innerHTML += "(name of weapon) - (name of object)   : Uses desired weapon against desired object.<br>";
	output.innerHTML += "										 # Example: 'sword door' allows user to<br>";
	output.innerHTML += "										   use the SWORD against a stubborn DOOR.<br>";
	output.innerHTML += "(name of weapon) - (name of enemy)    : Uses desired weapon against desired enemy.<br>";
	output.innerHTML += "										 # Example: 'dagger imp' allows the user<br>";
	output.innerHTML += "										   to use the DAGGER against an IMP.<br>";
	output.innerHTML += "										 # Example: 'sword goblin' allows the user<br>"; 
	output.innerHTML += "										   to lance a GOBLIN with the SWORD.<br>";
	output.innerHTML += "eval 			  - stats 				: Allows user to check health, armor and inventory.<br><br>";

	output.innerHTML += "STORY SO FAR<br>";
	output.innerHTML += "===== == ===<br>";
	output.innerHTML += "Long ago in the Sixth Age of the World...<br>"+
	/*"Surrounded by mountains and forests...<br>"+*/
	"A long peace has ended...<br><br>"+

	"A mysterious wizard known as ROBESPIERRE used<br>" +
	"evil magic in hopes to rule the kingdom...<br><br>"+

	"He eliminated the good king and has imprisoned the<br>" +
	"beautiful PRINCESS MARIE ANTOINETTE in the royal castle.<br><br>"+ 

	"The people wait, their only hope, a prophecy...<br><br>" +

	"When the kingdom is in darkness, a HERO will come...<br>" +
	"Bearing the IRONWOOD SWORD...<br><br>";
	
}

function printSpace(num){
	// returns num amount of non breaking space characters for 
	// building tables and other blocks requiring legibility
	var str = "";

	for(var x=0;x<num;x++){
		str+= "&nbsp;"
	}

	return str;
}

// called when a user enters any room
// or when loading up the most recent save point
function setUpMap(room){

	tempPlayer.setPlayer(gordon); // Sets up temporary save of game. (*)
	// tempMap.setMap(map) would go here as well
	// (if you are killed by a goblin here there is about 
	// 50% chance the room will respawn with an imp instead)

	// describe the room
	output.innerHTML += room.describeRoom(); // Provides verbal description of entering current room.
	output.innerHTML += room.getDescription2(); // Provides verbal description of current room.
	output.innerHTML += "<br>";

	if(room.getHealth() > 0) // If there are potions inside the room
	{						 // Player health is increased.
		output.innerHTML += "Thou encounterest ye olde POTION. Thou gain " + map.getHealth() + " HP.<br>";
		gordon.increaseHealth(map.getHealth());
	}

	if(room.getArmor() > 0) // If there are armor boosts inside the room
	{   					// Player armor is increased.
		output.innerHTML += "Thou encounterest ye olde GREENE ARMOUR. Thou gain " + map.getArmor() + " armor points.<br>";
		gordon.increaseArmor(map.getArmor());
	}
/*
	if(gordon.getPosition() == 0 && room.getMonsterAmount() > 0 && firstScreen == true){
	// hard coded, this is probably bad
		output.innerHTML += "<br>Verily something approaches from yonder umbrage! Thou haveth upon yeself only thy DAGGER.";
	}*/

	if(room.getMonsterAmount() > 0){ // If monsters are extant
		m = room.getMonster(); 
		console.log(m);
		output.innerHTML += "A";
		if(isVowel(m.getName().charAt(0)))
			output.innerHTML += "n"
		output.innerHTML += (" " + m.getName() + " standeths before ye.<br>"); // Player is reminded that this is so.
	}

	if(room.getObjectCount() > 0) // If objects are still extant
		output.innerHTML += room.getObjectDescription() + "<br>";  // Player is reminded as such.

	if(firstScreen == true){
		output.innerHTML += "Type HELP for a list of commands.<br>";
		firstScreen = false;
	}

	output.innerHTML += "What dost thou do?<br>"; // THE prompt
	$(window).scrollTop() + $(window).height();
}

// called when a user enters any command
function yourMove(){
	/* Description: Inflicts various 
	actions upon the room, the things
	within it, or to the player.
	*/

	// set to false if any of the entered commands succeed
	// if still false at the end of yourMove(), error is printed
	var badCommand = true;

	// get the answer first
	var option = answer.value;

	// and reset the input field to blank
	document.getElementById("answer").value = "";
	
	// display the answer before reprinting 
	// screen for that cool CLI effect
	output.innerHTML += ">"+option+"<br>";

	// assumes the response is in two word format
	var verb = "";
	var noun = "";

	// get first two words in the response
	var words = option.split(" ");
	verb = words[0].toUpperCase();
	if(words[1] != null)
		noun = words[1].toUpperCase();

	// interpret the answer
	// checks if first word is an object in the inventory
	if(isVerbWeapon(verb) != -1)  // If verb inflicted was an object found
	{							  // in the user's inventory
		w = gordon.getWeapon(isVerbWeapon(verb));
		
		if(noun == m.getName()) // If noun is monster the user 
		{						// wishes to attack with noun			
			// Takes damage
			output.innerHTML += w.attackString() + "<br>";
			m.getHurt(w.getDamage());
			output.innerHTML += "The " + m.getName() + " takes " + w.getDamage() + " damage.<br>";
			map.setMonster(m); // Returns enemy to map

			if(m.getHealth() <= 0) // If monster == teh deadz0r
			{
					output.innerHTML += "The " + m.getName() + " is vanquished.<br>";
					map.destroyAllMonsters(); // Set monstercount to zero.
			}

			badCommand = false;

		}
	}

	// <Go>	

	else if(verb == "GO") // If user wishes to go...
	{	
		if(noun == "BACKWARD" || noun == "BACK") // backward...
		{
			output.innerHTML += "Thou canneth notst goeth in yonder direction.<br>";
			// ...they will find that quite difficult.

			badCommand = false;
		}

		if(noun == "FORWARD") // If user wishes to go forward...
		{
			if(map.getObstructCount() == 0){ 	// and there are no obstructions...
				gordon.incrementPosition(); 	// they will do so.
			}
			else // If there are obstructions...
			{
				output.innerHTML += map.describeObstruction() + "<br>";
				// These obstructions are described...
				if(map.getDamage() > 0)				  // If the obstructions are 
					gordon.getHurt(map.getDamage());  // dangerous (such as a cliff) 
													  // the damage is inflicted.

			}

			badCommand = false;
		}
	}

	else if(map.getObstructCount() > 0 && verb == map.getVerb() && noun == map.getNoun()){ 
	// If there are obstructions and the user applies the right verb...
			gordon.incrementPosition(); // They pass the current room.
			badCommand = false;
	}

	// </Go>

	// Allows user to examine environment.

	else if(verb == "SCAN" || verb == "LOOK"){
		if(noun == "AROUND" || noun == "ENVIRONS" || noun == "ROOM" || noun == ""){
			output.innerHTML += map.getDescription2() + "<br>"; // Describes current room at the user's request.

			// monster description should probably be a function
			if(map.getMonsterAmount() > 0){  // If there are monsters, the user is reminded.
				m = map.getMonster(); 
				output.innerHTML += "A";
				if(isVowel(m.getName().charAt(0)))
					output.innerHTML += "n"
				output.innerHTML += (" " + m.getName() + " standeths before ye.<br>");
			}

			if(map.getObjectCount() > 0){ // If there are items, the user is reminded.
				output.innerHTML += map.getObjectDescription() + "<br>";
			}

			badCommand = false;
		}

		if(map.getMonsterAmount() > 0 && noun == m.getName()) // If user looks at a monster
		{
			output.innerHTML += m.getDescription() + "<br>";  // The monster is described
			badCommand = false;
		}
	}

	// Allows user to take objects from room.
	else if((map.getObjectCount() > 0) && (verb == "TAKETH" || verb == "TAKE"
		|| verb == "GET") &&
		(noun == map.getObjectName() ) ) {
			output.innerHTML += "Thou takest ye olde " + map.getObjectName() + ".<br>";
			gordon.receiveWeapon(map.getObject()); 	// Adds item to inventory and
			badCommand = false;						// detracts item from map.
		}

	// Shows stats
	else if((verb == "EVAL" || verb == "CHECK") &&
		(noun == "STATISTICS" || noun == "STATS" || noun == "")){
		output.innerHTML += gordon.printStatus();
		badCommand = false;
	}

	// Shows help screen with list of commands
	else if(verb == "HELP"){
		help();
		badCommand = false;
	}

	// If bad command or object

	if(badCommand) {
		output.innerHTML += "Something command error happens. Error ";

		if(Math.floor((Math.random() * 100) + 1)>50)
			output.innerHTML += "-";

		output.innerHTML += (Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
		output.innerHTML += ": Bad command or non-extant object.<br>" + "Type 'help' for help.<br>";
	}

	if(map.getMonsterAmount() > 0){ // If monsters are extant.
			console.log(map.getMonsterAmount());
			output.innerHTML += m.attackString() + "<br>";
			output.innerHTML += "Thou takest " + m.getDamage() + " damage.<br>";
			gordon.getHurt(m.getDamage()); // Monster attacks.
	}

	// End of round

	if(gordon.getHealth() <= 0) // If player == teh deadz 
	{	
			output.innerHTML += "Thy bloody corpse falls lifelessly to ye olde grounde.<br>"; // Inform them
			output.innerHTML += "<br>Loading from most recent saved game...<br><br>";
			
			gordon.setPlayer(tempPlayer); // Load game from temporary save point at beginning of setUpMap (*)

			map = new Room(tempPlayer.getPosition()); // maybe this is retrieved from the temp map saved earlier
			setUpMap(map);

	} else if(gordon.getPosition()!=tempPlayer.getPosition()){
	// If user is still alive and has advanced into the next room
		
		map = new Room(gordon.getPosition());
		
		//update the view
		setUpMap(map);

	} else {
		output.innerHTML += "What dost thou do?<br>"; // THE prompt
		$(window).scrollTop() + $(window).height();
	}

}

// set up new game
setUpMap(map);
