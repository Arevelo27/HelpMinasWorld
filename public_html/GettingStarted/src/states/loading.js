/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global KiwiLoadingScreen */

var LoadingState = LoadingState || {};
LoadingState = new KiwiLoadingScreen('LoadingState', 'IntroState', 'assets/img/loading/');

    
//            "Hola Kiwi...."
LoadingState.preload = function () {
    
    //Make sure to call the super at the top.
    //Otherwise the loading graphics will load last, and that defies the whole point in loading them. 
    KiwiLoadingScreen.prototype.preload.call(this);

    /**
    * Replace with your own in-assets to load.
    **/    
    
    this.addImage('kiwiName', 'assets/img/kiwijs-name.png');
    this.addImage('nube', 'assets/img/nube.png');
    this.addImage('rio', 'assets/img/rio_play.png');
    this.addImage('sueloRocoso', 'assets/img/sueloRocoso.png');
    this.addImage('paisajeFondo', 'assets/img/fondo_paisaje.png');
    this.addImage('nube', 'assets/img/nube.png');
    this.addAudio( "backgroundAudio", "assets/sound/backgraund.wav" );
    this.addAudio( "canaveral", "assets/sound/canaveral_seco_moviendose_con_la_brisa.mp3" );
    this.addSpriteSheet('icons', 'assets/img/kiwijs-icons.png', 100, 90);
    this.addSpriteSheet('caracter', 'assets/img/muñeco3.png', 76.8, 87.7);
//    this.addSpriteSheet('caracter', 'assets/img/muñeco2.png', 91.5, 112);
    this.addSpriteSheet("sonidoOnOff", "assets/img/sonido.png", 60, 60);
    this.addSpriteSheet("rocas_excavadas", "assets/img/rocas_excavadora.png", 100, 100);
//    this.addSpriteSheet('retroexcavadora', 'assets/img/retro_excavadora.png', 215, 140);
//    this.addSpriteSheet('retroexcavadora', 'assets/img/retro_excavadora.png', 228, 152);
    this.addSpriteSheet('retroexcavadora', 'assets/img/retro_excavadora.png', 241, 159);
    this.addSpriteSheet('flechaIzq', 'assets/img/flecha_izquierda.png', 80, 80);
    this.addSpriteSheet('flechaDere', 'assets/img/flecha_derecha.png', 80, 80);
//    this.addSpriteSheet('policia', 'assets/img/policiaSprite2.png', 124, 125);

};


