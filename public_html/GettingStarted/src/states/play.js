/* global Kiwi, text */

var PlayState = PlayState || {};

PlayState = new Kiwi.State('PlayState');

/**
 * El PlayState en el estado de núcleo que se utiliza en el juego. 
 *
 * Es el estado en el que se produce la mayoría de la funcionalidad ' en el juego ' se produce .
 * 
 */


/**
 * Este método se ejecuta cuando crear un estado kiwi ha terminado de cargar todos los recursos que se requieren para cargar.
 */
PlayState.create = function () {
    try {
        Kiwi.State.prototype.create.call(this);

        // Creación HUD Widgets
        this.playersHealth = new Kiwi.HUD.Widget.Bar(
                this.game, 100, 200, 354, 345, 70, 5);
        //70, 354
        //Color verde de la barra de la vida
        this.playersHealth.bar.style.backgroundColor = "#00eb21";
        //Color rojo cuando se le esta acabando los grumos de arena
        this.playersHealth.style.backgroundColor = "#ff0000";

        this.scoreBoard = new Kiwi.HUD.Widget.TextField(
                this.game, "Puntaje: 0", 10, 30);
        this.scoreBoard.style.fontFamily = "helvetica";

        //Texto del tiempo que inicia
        this.startTimer(370, 3);

        /*
         * ---------------------Grupos---------------------
         */
        this.grassGroup = new Kiwi.Group(this);
        this.rioGroup = new Kiwi.Group(this);

        this.group = new Kiwi.Group(this);


        //Fondo paisaje
        this.paisaje = new Kiwi.GameObjects.StaticImage(this, this.textures.paisajeFondo, 3, 0);
        //Suelo rocoso
        this.background = new Kiwi.GameObjects.StaticImage(this, this.textures.sueloRocoso, 3, 410);
        //Imagen del motor del juego
        this.name = new Kiwi.GameObjects.StaticImage(this, this.textures.kiwiName, 3, 410);

        this.rio = new Kiwi.GameObjects.StaticImage(this, this.textures.rio, 1, 464);

        this.cameraStep = 3;

        this.spriteWidth = -100;

//        for (var i = 0; i < 10; i++) {
        this.randX = Math.random() * (this.game.stage.width - this.spriteWidth);
        if (this.randX >= 1000) {
            this.excavadora = new Retroexcavadora(this, this.randX, 298);
        } else {
            this.excavadora = new Retroexcavadora(this, 1000, 298);
        }
        this.excavadora.xSpeed = 3;
        this.excavadora.scaleX = -1;
        this.excavadora.bounce = function (me) {
            if (this.transform.x >= 1423) {
                this.xSpeed *= -1;
                this.scaleX = 1;
                this.transform.x -= 3;
            } else if (this.transform.x <= 100) {
                this.xSpeed *= -1;
                this.scaleX = -1;
                this.transform.x += 3;
            }
        };
//        }        

        this.group.callAll('animation', 'play', ['walk']);

//        this.excavadora = new Retroexcavadora(this, 1510, 318);
        this.roca = new Roca_excavada(this, 1477, 358);
        this.character = new Ciudadano(this, 70, 354);

        //Icono de play y stop
        this.audioToggle = new Kiwi.GameObjects.Sprite(this, this.textures.sonidoOnOff, 1, 0, true);

        this.flechaLeft = new Kiwi.GameObjects.Sprite(this, this.textures.flechaIzq, 22, 420, true);
        this.flechaRigth = new Kiwi.GameObjects.Sprite(this, this.textures.flechaDere, 112, 420, true);
        
        //Añadir los controles clave para el personaje
        this.keyboard = this.game.input.keyboard;
        this.mouse = this.game.input.mouse;
        this.Controls();

        /* 
         * ---------------------Audio objects---------------------
         */
        this.music = new Kiwi.Sound.Audio(this.game, "backgroundAudio", 0.4, true);
        this.music.play();
        /* 
         * ---------------------animation---------------------
         */
        // Character 
        this.character.animation.add("idle", [1], 0.1, false);
        this.character.animation.add("walk", [2, 1, 2, 3, 5, 6, 3], 0.1, true);
        this.character.animation.add('jump', [7], 0.1, true);
        this.character.animation.play("idle");
        //Audio play o stop
        this.audioToggle.animation.add("state", [0, 1], 0.1, false);
        //roca excavada
        this.roca.animation.add('walk', [1, 1, 5, 1, 5, 5, 2, 6, 2, 6, 3, 4, 5], 0.4, true);
        this.roca.animation.play('walk');


        /* 
         * ---------------------addChild---------------------
         */
        this.addChild(this.paisaje);
        this.addChild(this.roca);
//        this.addChild(this.excavadora);
        this.group.addChild(this.excavadora);
        this.addChild(this.group);
        this.addChild(this.roca);
        this.addChild(this.character);
        this.addChild(this.background);
        this.addChild(this.rio);
        this.addChild(this.name);
        this.addChild(this.flechaLeft);
        this.addChild(this.flechaRigth);
        this.addChild(this.grassGroup);
        this.addChild(this.rioGroup);
        this.addChild(this.audioToggle);
//        this.addChild(this.text1);
//        this.addChild(this.text2);
//        
        // Adicionando HUD elementos para defaultHUD
        this.game.huds.defaultHUD.addWidget(this.scoreBoard);
        this.game.huds.defaultHUD.addWidget(this.playersHealth);

        //Movimiento de la nubes
        this.movimientoNube();
        this.movimientoRio();

        this.runI = 0;
        this.updateMoviento = 0;

    } catch (err) {
        console.log("Error en: " + err);
    }

};

PlayState.cambioMediaQuery = function (mql) {
//    alert(mql.matches);
    //console.log("Matches Devuelve: true si la pantalla es más alta que ancha: " + mql.matches ? 'activo' : 'inactivo');
};



/*
 * Metodo update
 * Con este metodo mantengo actualizado todas las acciones del juego
 * @returns {undefined}
 */
PlayState.update = function () {
    try {
        Kiwi.State.prototype.update.call(this);

        this.movement();
        this.touchMusic();
        this.touchBtnLeft();
        this.touchBtnRigth();
        this.startSound();

        //animacion fondo
        this.updateParallax();

        var mql = window.matchMedia("(orientation: landscape)");
        this.cambioMediaQuery(mql);
        mql.addListener(this.cambioMediaQuery);

        //Llama al método forEach en 'this.group'. Pasando los parámetros personalizados en el tercer parámetro.
        if (this.updateMoviento >= 565) {
            this.contador = 0;
            while (this.contador < 15) {
                this.contador++;
//                this.randX = 0;
                this.group.forEach(this, this.updatePosition);
                // console.log( this.group )
                this.group.callAll(null, 'bounce', null);
            }
            this.updateMoviento = 0;
        }
        

    } catch (err) {
        console.log("Error en: " + err);
    }
};

PlayState.updatePosition = function (sprite, wobble) {
    sprite.x += sprite.xSpeed;
};

/* -------------------------------Comandos Start-------------------------------*/

/*
 * @metodo startTimer
 * Tiempo del cronometro
 * @param {type} x
 * @param {type} y
 * @returns {undefined}
 */
PlayState.startTimer = function (x, y) {
    // Se añade un widget de tiempo a la defaultHUD del juego.
    this.timer = new Kiwi.HUD.Widget.Time(this.game, "", x, y);
    this.game.huds.defaultHUD.addWidget(this.timer);

    this.timer.style.color = "red";
    this.timer.start();
};

/*
 * @Metodo startSound [Control de sonido]
 * @returns {undefined}
 */
PlayState.startSound = function () {
    if (!this.music.loop) {
        this.runI++;
        this.updateMoviento++;
//        console.log(this.runI);
        if (!this.music.isPlaying) {
            this.music.stop();
        } else {
            if (this.runI === 3150) {
                this.music.stop();
                this.music.play();
                this.runI = 0;
            }
        }
    }
};

/*
 * @Metodo Controls
 * Con este metodo controlo el juego mediante los botones
 * @returns {undefined}
 */
PlayState.Controls = function () {
    this.leftKey = this.keyboard.addKey(Kiwi.Input.Keycodes.LEFT);
    this.rightKey = this.keyboard.addKey(Kiwi.Input.Keycodes.RIGHT);
    this.jumpKey = this.keyboard.addKey(Kiwi.Input.Keycodes.UP);
    this.runKey = this.keyboard.addKey(Kiwi.Input.Keycodes.R);

    this.oneKey = this.keyboard.addKey(Kiwi.Input.Keycodes.ONE);
    this.twoKey = this.keyboard.addKey(Kiwi.Input.Keycodes.TWO);
    this.threeKey = this.keyboard.addKey(Kiwi.Input.Keycodes.THREE);

    this.keyboard.onKeyDownOnce.add(this.keyDownOnce, this);
    this.keyboard.onKeyUp.add(this.keyUp, this);
};

/*
 * Cuando se pulsa la tecla se crean los estados
 * @param {type} keyCode
 * @param {type} key
 * @returns {undefined}
 */
PlayState.keyDownOnce = function (keyCode, key) {
    if (keyCode === this.rightKey.keyCode) {
        this.rightPressed = true;
    }

    if (keyCode === this.leftKey.keyCode) {
        this.leftPressed = true;
    }

    if (keyCode === this.jumpKey.keyCode) {
        this.jumpPressed = true;
    }

    if (keyCode === this.runKey.keyCode) {
        this.runPressed = true;
    }
};

/*
 * Cuando se suelta la tecla vuel a su estado anterior
 * @param {type} keyCode
 * @param {type} key
 * @returns {undefined}
 */
PlayState.keyUp = function (keyCode, key) {
    if (keyCode === this.rightKey.keyCode) {
        this.rightPressed = false;
    }

    if (keyCode === this.leftKey.keyCode) {
        this.leftPressed = false;
    }

    if (keyCode === this.jumpKey.keyCode) {
        this.jumpPressed = false;
    }

    if (keyCode === this.runKey.keyCode) {
        this.runPressed = false;
    }
};

/*
 * Movimiento del jugador, las acciones de las teclas izquirda y derecha
 * @Metodo movement
 * @returns {undefined}
 */
PlayState.movement = function () {
    if (this.leftPressed) {

        this.updateKeyLeft();

        if (this.runPressed) {
            this.updateRunKeyLeft();
        }

        if (this.jumpPressed) {
            this.updateKeyJump();
        }
    } else if (this.rightPressed) {

        this.updateKeyRight();

        if (this.runPressed) {
            this.updateRunKeyRight(2);
        }

        if (this.jumpPressed) {
            this.updateKeyJump();
        }
    } else if (this.jumpPressed) {
        this.updateKeyJump();
    } else {
        this.character.animation.play("idle");
    }

    var playerOffsetX = this.character.width * 0.5;
    // Se ajusta a la posición de la cámara del jugador.
    this.game.cameras.defaultCamera.transform.x = -1 * this.character.x + this.game.stage.width * 0.5 - playerOffsetX;
};

/*
 * @Metodo para mover hacia la izquierdad
 * @returns {undefined}
 */
PlayState.updateKeyLeft = function () {
    if (this.character.transform.x > 5) {
        this.character.transform.x -= 3;
        this.updateBtnKeyLeft(3);  
    } else {
        this.character.animation.add("idle", [1], 0.1, true);
        this.character.animation.play("idle");
    }

    this.game.cameras.defaultCamera.transform.x = this.cameraStep;
    this.character.scaleX = -1;
    if (this.character.animation.currentAnimation.name !== "walk") {
        this.character.animation.play("walk");
    }
};

/*
 * @Metodo para mover hacia la derecha
 * @returns {undefined}
 */
PlayState.updateKeyRight = function () {
    if (this.character.transform.x < 1350) {
        this.character.transform.x += 3;
        this.updateBtnKeyRight(3);   
    } else {
        this.character.animation.add("idle", [1], 0.1, true);
        this.character.animation.play("idle");
    }

    this.game.cameras.defaultCamera.transform.x -= this.cameraStep;
    this.character.scaleX = 1;
    if (this.character.animation.currentAnimation.name !== "walk") {
        this.character.animation.play("walk");
    }
};

/*
 * @Metodo para aumentar la velocidad del jugador principal hacia el lado izquierdo
 * @param {type} state
 * @param {type} x
 * @param {type} y
 * @returns {undefined}
 */
PlayState.updateRunKeyLeft = function () {
    if (this.character.transform.x > 5) {
        this.character.transform.x -= 1.3;
        this.updateBtnKeyLeft(1.3);   
    } else {
        this.character.animation.add("idle", [1], 0.1, true);
        this.character.animation.play("idle");
    }

    this.game.cameras.defaultCamera.transform.x = this.cameraStep;
    this.character.scaleX = -1;
    if (this.character.animation.currentAnimation.name !== "walk") {
        this.character.animation.play("walk");
    }
};

/*
 * @Metodo para aumentar la velocidad del jugador principal hacia el lado derecho
 * @param {type} state
 * @param {type} x
 * @param {type} y
 * @returns {undefined}
 */
PlayState.updateRunKeyRight = function (xxx) {
    if (this.character.transform.x < 1350) {
        this.character.transform.x += xxx;
        this.updateBtnKeyRight(xxx);        
    } else {
        this.character.animation.add("idle", [1], 0.1, true);
        this.character.animation.play("idle");
    }

    this.game.cameras.defaultCamera.transform.x -= this.cameraStep;
    this.character.scaleX = 1;
    if (this.character.animation.currentAnimation.name !== "walk") {
        this.character.animation.play("walk");
    }
};
/*
 * @Metodo updateKeyJump es usuado para cuando el jugar precione la tecla hacia arriba se actualice 
 * el estado del muñeco haciendolo saltar
 * @returns {undefined}
 */
PlayState.updateKeyJump = function () {
    if (this.character.transform.y < 100) {
        this.character.transform.y += 12;
    }

    this.character.scaleY = 1;
    if (this.character.animation.currentAnimation.name !== "jump") {
        this.character.animation.play("jump");
    }
};

PlayState.updateBtnKeyLeft = function(vlr){  
    this.flechaLeft.transform.x -= vlr;
    this.flechaRigth.transform.x -= vlr;  
};

PlayState.updateBtnKeyRight = function(vlr){  
    this.flechaLeft.transform.x += vlr;
    this.flechaRigth.transform.x += vlr;  
};


/* -------------------------------Jugadores-------------------------------*/

/*
 * @Jugador protagonista
 * @metodo Ciudadano, es usado para crear la acciones del muñeco
 * @param {type} state
 * @param {type} x
 * @param {type} y
 * @returns {undefined}
 */
var Ciudadano = function (state, x, y) {
    Kiwi.GameObjects.Sprite.call(this, state, state.textures.caracter, x, y);
    this.animation.add("walk", [2, 1, 2, 3, 5, 6, 3], 0.1, true);
    this.animation.play("walk");
    this.animation.add('jump', [7], 0.1, true);
    this.animation.play("jump");
};
Kiwi.extend(Ciudadano, Kiwi.GameObjects.Sprite);

/*
 * @metodo Retroexcavadora, es usado para crear la acciones de la retroexcavadora
 * @param {type} state
 * @param {type} x
 * @param {type} y
 * @returns {undefined}
 */
var Retroexcavadora = function (state, x, y) {
    Kiwi.GameObjects.Sprite.call(this, state, state.textures.retroexcavadora, x, y);
    //, 1, 2, 3, 3, 1, 4, 5
    this.animation.add('walk', [0, 2, 1, 2, 1, 2, 2, 1, 4, 4, 5, 5, 0], 0.4, true, false);
    this.animation.play('walk');
};
Kiwi.extend(Retroexcavadora, Kiwi.GameObjects.Sprite);

/*
 * @metodo Roca_excavada, es usado para crear la acciones de la roca que son excavadas
 * @param {type} state
 * @param {type} x
 * @param {type} y
 * @returns {undefined}
 */
var Roca_excavada = function (state, x, y) {
    Kiwi.GameObjects.Sprite.call(this, state, state.textures.rocas_excavadas, x, y);
    this.animation.add('walk', [3, 2, 3, 4, 1, 5, 6], 0.4, true);
    this.animation.play('walk');
};
Kiwi.extend(Roca_excavada, Kiwi.GameObjects.Sprite);


/* -------------------------------Movimientos-------------------------------*/

/*
 * fondo background 
 * @returns {undefined}
 */
PlayState.updateParallax = function () {
    var i;
    //Ground cielo
    for (i = 0; i < this.grassGroup.members.length; i++) {
        this.grassGroup.members[ i ].transform.x -= 1;
        if (this.grassGroup.members[ i ].transform.worldX <= -50) {
            this.grassGroup.members[ i ].transform.x = 48 * 48;
        }
    }

    //Ground rio
    for (i = 0; i < this.rioGroup.members.length; i++) {
        this.rioGroup.members[ i ].transform.x -= 1;
        if (this.rioGroup.members[ i ].transform.worldX <= -2) {
            this.rioGroup.members[ i ].transform.x = 165 * 6;
        }
    }
};

/*
 * @Metodo movimientoNube
 * Con este metodo controlo las nubes para crearlas y darle movimiento
 * @returns {undefined}
 */
PlayState.movimientoNube = function () {
    for (var i = 0; i < 2; i++) {
        this.grassGroup.addChild(new Kiwi.GameObjects.Sprite(
                this, this.textures.nube, i * 2030, 40, true));

        this.grassGroup.addChild(new Kiwi.GameObjects.Sprite(
                this, this.textures.nube, i * 1830, 4, true));

        this.grassGroup.addChild(new Kiwi.GameObjects.Sprite(
                this, this.textures.nube, i * 1630, 15, true));

        this.grassGroup.addChild(new Kiwi.GameObjects.Sprite(
                this, this.textures.nube, i * 1598, 30, true));

        this.grassGroup.addChild(new Kiwi.GameObjects.Sprite(
                this, this.textures.nube, i * 1368, 28, true));

        this.grassGroup.addChild(new Kiwi.GameObjects.Sprite(
                this, this.textures.nube, i * 1258, 36, true));

        this.grassGroup.addChild(new Kiwi.GameObjects.Sprite(
                this, this.textures.nube, i * 1100, 24, true));

        this.grassGroup.addChild(new Kiwi.GameObjects.Sprite(
                this, this.textures.nube, i * 908, 4, true));

        this.grassGroup.addChild(new Kiwi.GameObjects.Sprite(
                this, this.textures.nube, i * 2030, 40, true));

        this.grassGroup.addChild(new Kiwi.GameObjects.Sprite(
                this, this.textures.nube, i * 2330, 10, true));

        this.grassGroup.addChild(new Kiwi.GameObjects.Sprite(
                this, this.textures.nube, i * 2530, 40, true));

        this.grassGroup.addChild(new Kiwi.GameObjects.Sprite(
                this, this.textures.nube, i * 908, 24, true));
    }
};

/*
 * @metodo movimientoRio
 * Con este metodo controlo el rio para crearlo y darle movimiento
 * @returns {undefined}
 */
PlayState.movimientoRio = function () {
    for (var i = 0; i < 2; i++) {
        this.rioGroup.addChild(new Kiwi.GameObjects.Sprite(
                this, this.textures.rio, i * 2103, 463, true));
        this.rioGroup.addChild(new Kiwi.GameObjects.Sprite(
                this, this.textures.rio, i * 15, 463, true));
        this.rioGroup.addChild(new Kiwi.GameObjects.Sprite(
                this, this.textures.rio, i * 45, 463, true));
        this.rioGroup.addChild(new Kiwi.GameObjects.Sprite(
                this, this.textures.rio, i * 2403, 463, true));
        this.rioGroup.addChild(new Kiwi.GameObjects.Sprite(
                this, this.textures.rio, i * 2003, 463, true));
        this.rioGroup.addChild(new Kiwi.GameObjects.Sprite(
                this, this.textures.rio, i * 1700, 463, true));
        this.rioGroup.addChild(new Kiwi.GameObjects.Sprite(
                this, this.textures.rio, i * 1203, 463, true));
        this.rioGroup.addChild(new Kiwi.GameObjects.Sprite(
                this, this.textures.rio, i * 15, 463, true));
        this.rioGroup.addChild(new Kiwi.GameObjects.Sprite(
                this, this.textures.rio, i * 48, 463, true));
    }
};


/* -------------------------------Botone Sonido-------------------------------*/

/*
 * @Metodo touchMusic
 * Metodo usado para darle accion a la imagen del boton de sonido, para encenderlo o apargar el sonido
 */
PlayState.touchMusic = function () {
    if (this.audioToggle.input.isDown) {
        this.audioToggle.animation.nextFrame();
        if (this.music.isPlaying) {
            this.music.stop();
        } else {
            this.music.play();
        }
        this.mouse.reset();
    }
};


/* -------------------------------Botones flechas-------------------------------*/

/*
 * Boton imagen izquierda
 * Esta accion es usado cuando se este mostrando en pantallas de celulares
 * Ya que no tiene teclado fisico, se crea un boton para mover al muñeco a la izquierda
 * @Metodo touchBtnLeft
 */
PlayState.touchBtnLeft = function () {
    if (this.flechaLeft.input.isDown) {

        this.updateKeyLeft();
        
        var playerOffsetX = this.character.width * 0.5;
        // Set the cameras position to that of the player.
        this.game.cameras.defaultCamera.transform.x = -1 * this.character.x + this.game.stage.width * 0.5 - playerOffsetX;
        
        this.character.animation.play("walk");

    }
};

/*
 * Boton imagen derecha
 * Esta accion es usado cuando se este mostrando en pantallas de celulares
 * Ya que no tiene teclado fisico, se crea un boton para mover al muñeco al lado derecho
 * @Metodo touchBtnRigth
 */
PlayState.touchBtnRigth = function () {
    if (this.flechaRigth.input.isDown) {

        this.updateKeyRight();

        var playerOffsetX = this.character.width * 0.5;
        // Ajuste la posición de las cámaras a la del jugador.
        this.game.cameras.defaultCamera.transform.x = -1 * this.character.x + this.game.stage.width * 0.5 - playerOffsetX;
                
        this.character.animation.play("walk");
        
    }
};