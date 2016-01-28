// Need state. All game logic goes in state

var GameState = {

    // Load all your images. Thats what the preload function is
    preload : function(){
        //Load Image
      this.load.image('background' , 'assets/images/background.png');
    

    },

    //Execute after everything is loaded
    create: function(){
        //From top left param = (x,y)
        this.background = this.game.add.sprite( 0, 0, 'background' );

    },

    update: function(){


    }

}

// New Game instance, 3rd parameter WEBGL or CANVAS automatic  GL
var game = new Phaser.Game(640,360,Phaser.automatic);

// add state to game

// First just a name, second par is the actual Object
game.state.add('GameState', GameState);
game.state.start('GameState');