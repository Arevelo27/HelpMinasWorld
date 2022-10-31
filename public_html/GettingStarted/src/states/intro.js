/* global game, Kiwi */

var IntroState = IntroState || {};

IntroState = new Kiwi.State('IntroState');

IntroState.create = function () {
    game.states.switchState("PlayState");
};