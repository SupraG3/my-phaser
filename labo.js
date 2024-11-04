import NewMapScene from './pallet.js'; 

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
        this.load.image('background', './public/assets/labo.png');
  
        this.load.spritesheet('character-down', './public/assets/testa.png', {
            frameWidth: 18,
            frameHeight: 20
        });
        this.load.spritesheet('character-left', './public/assets/droite.png', {
            frameWidth: 18,
            frameHeight: 20
        });
        this.load.spritesheet('character-right', './public/assets/right.png', {
            frameWidth: 18,
            frameHeight: 20
        });
        this.load.spritesheet('character-up', './public/assets/up.png', {
            frameWidth: 18,
            frameHeight: 20
        });
    }

    create() {
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.displayWidth = this.sys.game.config.width;
        background.displayHeight = this.sys.game.config.height;

        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('character-down', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('character-up', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('character-left', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('character-right', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.player = this.physics.add.sprite(100, 100, 'character-down');
        this.player.setCollideWorldBounds(true);

        this.obstacles = this.physics.add.staticGroup();
        this.obstacles.create(92, 40, null).setSize(200, 63).setVisible(false);
        this.obstacles.create(365, 60, null).setSize(150, 30).setVisible(false);
        this.obstacles.create(220, 44, null).setSize(150, 30).setVisible(false);
        this.obstacles.create(65, 150, null).setSize(70, 80).setVisible(false);
        this.obstacles.create(12, 125, null).setSize(30, 60).setVisible(false);
        this.obstacles.create(305, 155, null).setSize(95, 50).setVisible(false);
        this.obstacles.create(335, 270, null).setSize(155, 63).setVisible(false);
        this.obstacles.create(80, 270, null).setSize(155, 63).setVisible(false);
        this.obstacles.create(17, 383, null).setSize(23, 50).setVisible(false);
        this.obstacles.create(400, 383, null).setSize(23, 50).setVisible(false);

        this.physics.add.collider(this.player, this.obstacles);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.positionText = this.add.text(10, 10, 'Position: x: 0, y: 0', { font: '16px Arial', fill: '#ffffff' });
    }

    update() {
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-100);
            this.player.anims.play('walk-left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(100);
            this.player.anims.play('walk-right', true);
        } else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-100);
            this.player.anims.play('walk-up', true);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(100);
            this.player.anims.play('walk-down', true);
        } else {
            this.player.anims.stop();
            this.player.setFrame(0);
        }

        this.positionText.setText(`Position: x: ${this.player.x.toFixed(0)}, y: ${this.player.y.toFixed(0)}`);

        // Transition vers la nouvelle scène en appelant la méthode qui charge le fichier de la nouvelle scène
        if (this.player.x >= 183 && this.player.x <= 227 && this.player.y === 415) {
            changeToNewMap();
        }
    }
}

function changeToNewMap() {
    // Détruire le jeu actuel
    game.destroy(true);

    // Charger le fichier de la nouvelle scène
    const script = document.createElement('script');
    script.type = 'module';
    script.src = './pallet.js';  // Chemin vers le fichier de la nouvelle scène
    document.body.appendChild(script);
}

const config = {
    type: Phaser.AUTO,
    width: 420,
    height: 425,
    parent: 'phaser-game',
    scene: [MainScene],  // Ici, on n'ajoute que la scène MainScene pour commencer
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    }
};

const game = new Phaser.Game(config);
