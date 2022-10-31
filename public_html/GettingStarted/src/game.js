
/* global Kiwi, PlayState, IntroState, LoadingState */

/**
* The core GettingStarted game file.
* 
* This file is only used to initalise (start-up) the main Kiwi Game 
* and add all of the relevant states to that Game.
*
*/

//Initialise the Kiwi Game. 

var gameOptions = {
	renderer: Kiwi.RENDERER_WEBGL, 
	width: 768,
	height: 522,
        top: 10
};

var game = new Kiwi.Game('content', 'Key Board', null, gameOptions);

//Todos los estados
game.states.addState(LoadingState);
game.states.addState(IntroState);
game.states.addState(PlayState);

game.states.switchState("LoadingState");