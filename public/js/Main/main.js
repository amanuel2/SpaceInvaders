var game = new Phaser.Game(500, 550, Phaser.CANVAS, 'gameDiv');

var CountDown = {

    preload: function() {


    },
    update: function() {

    },
    render: function() {


    }
}
var player;
var enemy;
var bullets;
var shields;
var bossRealHealth = 1550;
var enemies;
var greenEnemies;
var enemyBullet;
var bossLaunched = false;
var blueEnemiesBullets;
var bossEnemiesBullets;
var bossHealth = 50000;
var explosions;
var score = 0;
var scoreText;
var bulletTimer = 0;
var blueEnemies;
var mainState = {

    preload: function() {
        game.load.image('background', 'http://s1.postimg.org/nqynk9tkv/starfield.png')
        game.load.image('player', 'http://s28.postimg.org/9qdf4xrfx/145103252914234.gif')
        game.load.image('bullet', 'http://s9.postimg.org/z2bptetxn/bullet.png');
        game.load.image('green', 'http://s28.postimg.org/kpmq4byt5/enemy_green.png')
        game.load.spritesheet('explosionAnim', 'https://raw.githubusercontent.com/jschomay/phaser-demo-game/master/assets/explode.png', 128, 128)
        game.load.bitmapFont('spacefont', 'https://raw.githubusercontent.com/jschomay/phaser-demo-game/master/assets/spacefont/spacefont.png', 'https://rawgit.com/jschomay/phaser-demo-game/master/assets/spacefont/spacefont.xml');
        game.load.image('blue', 'https://raw.githubusercontent.com/jschomay/phaser-demo-game/master/assets/enemy-blue.png')
        game.load.image('blueEnemyBullet', 'https://raw.githubusercontent.com/jschomay/phaser-demo-game/master/assets/enemy-blue-bullet.png');
        game.load.image('boss', 'https://raw.githubusercontent.com/jschomay/phaser-demo-game/master/assets/boss.png');
        game.load.image('deathRay', 'https://raw.githubusercontent.com/jschomay/phaser-demo-game/master/assets/death-ray.png');

    },

    create: function() {
        this.backgroundImg = this.game.add.tileSprite(0, 0, 500, 550, 'background')
        player = game.add.sprite(game.world.centerX, 500, 'player')
        player.health = 200;
        player.anchor.setTo(0.5)
        player.scale.setTo(0.25)
        game.physics.arcade.enable(player);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.collideWorldBounds = true;
        this.game.inputEnabled = true;
        this.game.input.useHandCursor = true;
        player.body.maxVelocity.setTo(400, 400)
        player.body.drag.setTo(400, 400)

        //  The baddies!
        greenEnemies = game.add.group();
        greenEnemies.enableBody = true;
        greenEnemies.physicsBodyType = Phaser.Physics.ARCADE;
        greenEnemies.createMultiple(5, 'green');
        greenEnemies.setAll('anchor.x', 0.5);
        greenEnemies.setAll('anchor.y', 0.5);
        greenEnemies.setAll('scale.x', 0.5);
        greenEnemies.setAll('scale.y', 0.5);
        greenEnemies.setAll('angle', 180);
        greenEnemies.setAll('outOfBoundsKill', true);
        greenEnemies.setAll('checkWorldBounds', true);
        greenEnemies.forEach(function(enemy) {
            enemy.body.setSize(enemy.width * 3 / 4, enemy.height * 3 / 4);
            enemy.damageAmount = 20;
        })

        blueEnemies = game.add.group();
        blueEnemies.enableBody = true;
        blueEnemies.physicsBodyType = Phaser.Physics.ARCADE;
        blueEnemies.createMultiple(30, 'blue');
        blueEnemies.setAll('anchor.x', 0.5);
        blueEnemies.setAll('anchor.y', 0.5);
        blueEnemies.setAll('scale.x', 0.5);
        blueEnemies.setAll('scale.y', 0.5);
        blueEnemies.setAll('angle', 180);
        blueEnemies.forEach(function(enemy) {
            enemy.damageAmount = 40;
        });

        boss = game.add.sprite(160, -110, 'boss');
        boss.exists = true;
        boss.alive = false;
        boss.dead = false;
        boss.move = false;
        boss.anchor.setTo(0.5, 0.5);
        boss.damageAmount = 50;
        boss.angle = 180;
        boss.scale.x = 0.6;
        boss.scale.y = 0.6;
        game.physics.enable(boss, Phaser.Physics.ARCADE);
        boss.body.maxVelocity.setTo(100, 80);
        boss.dying = false;



        //  Shields stat
        shields = game.add.bitmapText(game.world.width - 250, 10, 'spacefont', '' + player.health + '%', 40);
        shields.render = function() {
            shields.text = 'Shields: ' + Math.max(player.health, 0) + '%';
        };
        shields.render();


        //  Score
        scoreText = game.add.bitmapText(10, 10, 'spacefont', '', 40);
        scoreText.render = function() {
            scoreText.text = 'Score: ' + score;
            if (score == 100) {
                console.log("OK")
            }
        };
        scoreText.render();




        this.launchGreenEnemy();

        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 1);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);

        //  Blue enemy's bullets
        blueEnemiesBullets = game.add.group();
        blueEnemiesBullets.enableBody = true;
        blueEnemiesBullets.physicsBodyType = Phaser.Physics.ARCADE;
        blueEnemiesBullets.createMultiple(30, 'blueEnemyBullet');
        blueEnemiesBullets.callAll('crop', null, {
            x: 90,
            y: 0,
            width: 90,
            height: 70
        });
        blueEnemiesBullets.setAll('alpha', 0.9);
        blueEnemiesBullets.setAll('anchor.x', 0.5);
        blueEnemiesBullets.setAll('anchor.y', 0.5);
        blueEnemiesBullets.setAll('outOfBoundsKill', true);
        blueEnemiesBullets.setAll('checkWorldBounds', true);
        blueEnemiesBullets.forEach(function(enemy) {
            enemy.body.setSize(20, 20);
        });


        bossEnemiesBullets = game.add.group();
        bossEnemiesBullets.enableBody = true;
        bossEnemiesBullets.physicsBodyType = Phaser.Physics.ARCADE;
        bossEnemiesBullets.createMultiple(30, 'blueEnemyBullet');
        bossEnemiesBullets.callAll('crop', null, {
            x: 90,
            y: 0,
            width: 90,
            height: 90
        });
        bossEnemiesBullets.setAll('alpha', 0.9);
        bossEnemiesBullets.setAll('anchor.x', 0.5);
        bossEnemiesBullets.setAll('anchor.y', 0.5);
        bossEnemiesBullets.scale.set(2, 2);
        bossEnemiesBullets.setAll('outOfBoundsKill', true);
        bossEnemiesBullets.setAll('checkWorldBounds', true);
        bossEnemiesBullets.forEach(function(enemy) {
            enemy.body.setSize(20, 20);
        });

        explosions = game.add.group();
        explosions.enableBody = true;
        explosions.physicsBodyType = Phaser.Physics.ARCADE;
        explosions.createMultiple(30, 'explosionAnim');
        explosions.setAll('anchor.x', 0.5);
        explosions.setAll('anchor.y', 0.5);
        explosions.forEach(function(explosion) {
            explosion.animations.add('explosionAnim');
        });
        /*
                            game.time.events.add(game.rnd.integerInRange(12000, 15000), this.launchBlueEnemy, this);
                            game.time.events.add(game.rnd.integerInRange(12000, 15000), this.launchBlueEnemy, this);
                            game.time.events.add(game.rnd.integerInRange(12000, 15000), this.launchBlueEnemy, this);
                            game.time.events.add(game.rnd.integerInRange(12000, 15000), this.launchBlueEnemy, this);
                            game.time.events.add(game.rnd.integerInRange(12000, 15000), this.launchBlueEnemy, this);
                            game.time.events.add(game.rnd.integerInRange(12000, 15000), this.launchBlueEnemy, this);*/



        this.cursors = game.input.keyboard.createCursorKeys();
        this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)


        game.time.events.add(10000, this.launchedBoss, this);
     game.time.events.add(game.rnd.integerInRange(15000, 20000), this.launchBlueEnemy, this);

    },


    update: function() {

        if (boss.move) {

            boss.exists = true;
            if (boss.body.y > 40) {
                boss.body.y = 40;

                game.add.tween(boss).to({
                    angle: 170
                }, 700, Phaser.Easing.Linear.None, true);
                game.time.events.add(game.rnd.integerInRange(5000, 7500), this.launchBossEnemy, this);
            } else {
                boss.body.y++;
            }
        }

        this.backgroundImg.tilePosition.y += 2;
        player.body.acceleration.x = 0;
        if (this.cursors.left.isDown) {
            player.body.acceleration.x -= 600;

        } else if (this.cursors.right.isDown) {
            player.body.acceleration.x += 600;

        }
        game.physics.arcade.overlap(player, greenEnemies, this.shipCollideGreen, null, this);
        game.physics.arcade.overlap(greenEnemies, bullets, this.bulletCollideGreen, null, this);

        game.physics.arcade.overlap(player, blueEnemies, this.shipCollideBlue, null, this);
        game.physics.arcade.overlap(blueEnemies, bullets, this.bulletCollideBlue, null, this);
        game.physics.arcade.overlap(blueEnemiesBullets, player, this.blueEnemyHitsPlayer, null, this)

        game.physics.arcade.overlap(boss, bullets, this.bulletCollideBoss, null, this);
        game.physics.arcade.overlap(bossEnemiesBullets, player, this.bossEnemyHitsPlayer, null, this)


        if (player.alive && this.fireButton.isDown) {
            //Grab first bullet from the pool

            if (game.time.now > bulletTimer) {
                var bullet = bullets.getFirstExists(false);
                if (bullet) {
                    bullet.reset(player.x, player.y + 8);
                    //Getting it up
                    bullet.body.velocity.y = -400;
                    bulletTimer = game.time.now + 250;
                }

            }
        }

        if (player.health <= 0) {
            player.kill();
        }
        if (!(player.alive)) {
            //GAMEOVER
            setTimeout(function() {
                game.state.start('Game_Over')
            }, 1000)

        }
        if (boss.dead == 150) {
            console.log("DEAD")
            boss.kill()
        }



    },
    launchGreenEnemy: function() {

        enemy = greenEnemies.getFirstExists(false);
        if (enemy) {
            enemy.reset(game.rnd.integerInRange(0, game.width), -20);
            enemy.body.velocity.x = game.rnd.integerInRange(-300, 300);
            enemy.body.velocity.y = 300;
            enemy.body.drag.x = 100;
            if (this.y > game.height) {
                this.kill()
            }

        }


        game.time.events.add(game.rnd.integerInRange(100, 3000), this.launchGreenEnemy, this);

    },

    shipCollideBlue: function(player, enemy) {

        var explosion = explosions.getFirstExists(false);
        explosion.reset(enemy.body.x + enemy.body.halfWidth, enemy.body.y + enemy.body.halfHeight);
        explosion.body.velocity.y = enemy.body.velocity.y;
        explosion.alpha = 0.7;
        explosion.play('explosionAnim', 30, false, true);
        enemy.kill();
        player.health = player.health - 40;
        shields.render();

    },
    shipCollideGreen: function(player, enemy) {

        var explosion = explosions.getFirstExists(false);
        if (explosion) {
            explosion.reset(enemy.body.x + enemy.body.halfWidth, enemy.body.y + enemy.body.halfHeight);
            explosion.body.velocity.y = enemy.body.velocity.y;
            explosion.alpha = 0.7;
            explosion.play('explosionAnim', 30, false, true);
            enemy.kill();

        }

        if (!bossLaunched && score > 0) {
            //  dramatic pause before boss
            boss.move = true;
            game.time.events.add(2000, this.launchedBoss, this);
        }
        player.health = player.health - 20;
        shields.render();

    },

    launchedBoss: function() {
        bossLaunched = true;
        boss.move = true;


    },
    bulletCollideGreen: function(bullet, enemy) {


        var explosion = explosions.getFirstExists(false);
        if (explosion) {
            explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
            explosion.body.velocity.y = enemy.body.velocity.y;
            explosion.alpha = 0.7;
            explosion.play('explosionAnim', 30, false, true);
            enemy.kill();
            bullet.kill();
        }
        score += 20 * 10;
        scoreText.render()
    },
    bulletCollideBlue: function(bullet, enemy) {

        var explosion = explosions.getFirstExists(false);
        if (explosion) {
            explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
            explosion.body.velocity.y = enemy.body.velocity.y;
            explosion.alpha = 0.7;
            explosion.play('explosionAnim', 30, false, true);
            enemy.kill();
            bullet.kill();
        }
        score += 40 * 10;
        scoreText.render()
    },

    bulletCollideBoss: function(bullet, enemy) {
        if (boss.dead != 150 && boss.body.y != -217.1) {

            enemy = boss;
            var explosion = explosions.getFirstExists(false);
            if (explosion) {
                explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
                explosion.body.velocity.y = enemy.body.velocity.y;
                explosion.alpha = 0.7;
                explosion.play('explosionAnim', 30, false, true);
            }

            // bullet.kill();
            bossRealHealth -= 1;
            console.log(bossRealHealth);
            bossHealth -= 50;
            score += 10
            if (bossHealth <= 200) {
                boss.dead = 150
            }
            scoreText.render()
        }
    },



    launchBossEnemy: function() {

        var bulletSpeed = 400;
        var firingDelay = 2000;

        var bank;

        enemy = boss
        if (enemy) {


            enemy.reset(160, 140);


            var bulletSpeed = 400;
            var firingDelay = 2000;

            enemy.bullets = 1;
            enemy.lastShot = 0;
            enemy.update = function() {

                enemyBullet = bossEnemiesBullets.getFirstExists(false);
                for (var i = 0; i <= 8; i++) {
                    if (enemyBullet &&
                        this.alive &&
                        this.bullets &&
                        this.y > game.width / 8 &&
                        game.time.now > firingDelay + this.lastShot) {
                        this.lastShot = game.time.now;
                        this.bullets--;
                        enemyBullet.reset(this.x, this.y + this.height / 2);
                        var angle = game.physics.arcade.moveToObject(enemyBullet, player, bulletSpeed);
                        enemyBullet.damageAmount = this.damageAmount;
                        enemyBullet.angle = game.math.radToDeg(angle);
                    }

                    //  Kill enemies once they go off screen
                    if (this.y > game.height + 200) {
                        this.kill();
                        this.y = -20;
                    }
                }
            }


        }




    },
    launchBlueEnemy: function() {


        var bulletSpeed = 400;
        var firingDelay = 2000;

        var bank;

        var enemy = blueEnemies.getFirstExists(false);
        if (enemy) {


            enemy.reset(game.rnd.integerInRange(0, game.width), -20);
            enemy.body.velocity.x = 200
            enemy.body.velocity.y = 200;
            enemy.body.drag.x = 100;

            var bulletSpeed = 400;
            var firingDelay = 2000;

            enemy.bullets = 1;
            enemy.lastShot = 0;
            enemy.shouldDie = Math.floor(Math.random() * 2);
            enemy.update = function() {

                enemyBullet = blueEnemiesBullets.getFirstExists(false);
                for (i = 0; i <= 1; i++) {
                    if (enemyBullet &&
                        this.alive &&
                        this.bullets &&
                        this.y > game.width / 8 &&
                        game.time.now > firingDelay + this.lastShot) {
                        this.lastShot = game.time.now;
                        this.bullets--;
                        enemyBullet.reset(this.x, this.y + this.height / 2);
                        var angle = game.physics.arcade.moveToObject(enemyBullet, player, bulletSpeed);
                        enemyBullet.damageAmount = this.damageAmount;
                        enemyBullet.angle = game.math.radToDeg(angle);
                    }

                    //  Kill enemies once they go off screen
                    if (this.y > game.height + 200) {
                        this.kill();
                        this.y = -20;
                    }
                }
            }
            game.time.events.add(game.rnd.integerInRange(8000, 8500), this.launchBlueEnemy, this);

        }




    },

    blueEnemyHitsPlayer: function(player, bullet) {


        var explosion = explosions.getFirstExists(false);
        if (explosion) {
            explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
            explosion.body.velocity.y = enemy.body.velocity.y;
            explosion.alpha = 0.7;
            explosion.play('explosionAnim', 30, false, true);
            player.health -= 40
            shields.render()


            bullet.kill();
        }
    },

    bossEnemyHitsPlayer: function(player, bullet) {
        var explosion = explosions.getFirstExists(false);
        if (explosion) {
            explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
            explosion.body.velocity.y = enemy.body.velocity.y;
            explosion.alpha = 0.7;
            explosion.play('explosionAnim', 30, false, true);

            player.health -= 80
            shields.render()


            bullet.kill();
        }

    },


    // Restart the game
    platformsCreate: function() {

    }
};
var play;
var Menu = {
    preload: function() {
        game.load.image('background', 'http://s1.postimg.org/nqynk9tkv/starfield.png')
        game.load.image('play-back', 'http://icon-park.com/imagefiles/movie_play_black.png');

    },
    create: function() {
        this.backgroundImg = this.game.add.tileSprite(0, 0, 500, 550, 'background')

        this.gameText = game.add.text(game.world.centerX - 190, game.world.centerY - 150, "Space Invaders", {
            font: "60px Times New Roman",
            fill: "#ccccb3",
            fontWeight: "bold",
            stroke: "white",
            strokeThickness: 2.5
        });

        /*       // this.gameText.anchor.setTo(0.5)
        this.gameText.angle =
*/
        play = game.add.sprite(120, 280, 'play-back')
        play.scale.setTo(0.5);
        /* game.physics.arcade.enable(play);*/
        play.inputEnabled = true;
        play.input.useHandCursor = true; //
        play.events.onInputDown.add(this.start, this);

    },
    update: function() {
        this.backgroundImg.tilePosition.y += 5;


    },
    render: function() {

    },
    start: function() {

        game.state.start('mainState')
    }

};

var Game_Over = {

    preload: function() {
        game.load.image('background', 'http://s1.postimg.org/nqynk9tkv/starfield.png')
        game.load.image('play-back', 'http://icon-park.com/imagefiles/movie_play_black.png');



    },
    create: function() {



        this.backgroundImg = this.game.add.tileSprite(0, 0, 500, 550, 'background')
        this.gameText = game.add.text(game.world.centerX, game.world.centerY - 100, "Game Over", {
            font: "60px Times New Roman",
            fill: "#ccccb3",
            fontWeight: "bold",
            stroke: "white",
            strokeThickness: 2.5
        });
        this.gameText.anchor.setTo(0.5)

        this.scoreGameOver = game.add.text(game.world.centerX, game.world.centerY, "Score : " + score, {
            font: "30px Times New Roman",
            fill: "#ccccb3",
            fontWeight: "bold",
            stroke: "white",
            strokeThickness: 2.5
        });
        this.scoreGameOver.anchor.setTo(0.5)

        play = game.add.sprite(175, 340, 'play-back')
        play.scale.setTo(0.3);
        /* game.physics.arcade.enable(play);*/
        play.inputEnabled = true;
        play.input.useHandCursor = true; //
        play.events.onInputDown.add(this.start, this);


    },
    update: function() {

        this.backgroundImg.tilePosition.y += 0.5;
    },
    render: function() {

    },

    start: function() {
        score = 0;
        game.state.start('mainState')
    }

}

var bootStage = {
        preload: function() {
            /* game.load.image('background', 'http://s1.postimg.org/nqynk9tkv/starfield.png')
             game.load.image('player', 'http://s28.postimg.org/9qdf4xrfx/145103252914234.gif')
             game.load.image('bullet', 'http://s9.postimg.org/z2bptetxn/bullet.png');
             game.load.image('green', 'http://s28.postimg.org/kpmq4byt5/enemy_green.png')
             game.load.spritesheet('explosionAnim', 'https://raw.githubusercontent.com/jschomay/phaser-demo-game/master/assets/explode.png', 128, 128)
             game.load.bitmapFont('spacefont', 'https://raw.githubusercontent.com/jschomay/phaser-demo-game/master/assets/spacefont/spacefont.png', 'https://rawgit.com/jschomay/phaser-demo-game/master/assets/spacefont/spacefont.xml');
             game.load.image('blue', 'https://raw.githubusercontent.com/jschomay/phaser-demo-game/master/assets/enemy-blue.png')
             game.load.image('blueEnemyBullet', 'https://raw.githubusercontent.com/jschomay/phaser-demo-game/master/assets/enemy-blue-bullet.png');
             game.load.image('boss', 'https://raw.githubusercontent.com/jschomay/phaser-demo-game/master/assets/boss.png');
             game.load.image('deathRay', 'https://raw.githubusercontent.com/jschomay/phaser-demo-game/master/assets/death-ray.png');
             game.load.image('loading-bar' ,'http://s7.postimg.org/viwy391bv/145127847067547.gif')*/
            game.load.image('loading-bar', 'http://s7.postimg.org/viwy391bv/145127847067547.gif')


        },
        create: function() {

            this.gameText = game.add.text(game.world.centerX, game.world.centerY - 100, "Loading", {
                font: "60px Times New Roman",
                fill: "#ccccb3",
                fontWeight: "bold",
                stroke: "white",
                strokeThickness: 2.5
            });
            this.gameText.anchor.setTo(0.5)

            this.load = game.add.sprite(game.world.centerX, game.world.centerY, 'loading-bar');
            this.load.anchor.setTo(0.5);

            setTimeout(function() {

                game.state.start('Menu');

            }, 3000)


        },
        update: function() {

        },
        render: function() {

        },

    }
    // Add and start the 'main' state to start the game
game.state.add('booting', bootStage)
game.state.add('CountDown', CountDown)
game.state.add('mainState', mainState);
game.state.add('Menu', Menu);
game.state.add('Game_Over', Game_Over);
game.state.start('booting');
