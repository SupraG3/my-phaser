import PNJ from '../pnj/pnj.js';

const config = {
    type: Phaser.AUTO,
    width: 824,
    height: 622,
    parent: 'game-container',
    scene: {
        key: 'TestScene',
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true 
        }
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let obstacles;

function preload() {
    this.load.image('background', './public/assets/Cinnabar-Island.png');

    // Assurez-vous que les chemins d'accès aux fichiers sont corrects et que les dimensions des frames sont exactes
    this.load.spritesheet('sacha-bottom', './public/assets/red-bottom.png', {
        frameWidth: 17,
        frameHeight: 33
    });
    this.load.spritesheet('sacha-left', './public/assets/red-left.png', {
        frameWidth: 17,
        frameHeight: 33
    });
    this.load.spritesheet('sacha-right', './public/assets/red-right.png', {
        frameWidth: 17,
        frameHeight: 33
    });
    this.load.spritesheet('sacha-top', './public/assets/red-top.png', {
        frameWidth: 17,
        frameHeight: 33
    });
}

function create() {
    // Ajouter le fond
    const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    background.displayWidth = this.sys.game.config.width;
    background.displayHeight = this.sys.game.config.height;

    // Créer les animations en utilisant les frames des nouveaux spritesheets
    this.anims.create({
        key: 'walk-down',
        frames: this.anims.generateFrameNumbers('sacha-bottom', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'walk-up',
        frames: this.anims.generateFrameNumbers('sacha-top', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'walk-left',
        frames: this.anims.generateFrameNumbers('sacha-left', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'walk-right',
        frames: this.anims.generateFrameNumbers('sacha-right', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });

    // Créer le sprite du joueur avec la première image (par exemple, la marche vers le bas)
    player = this.physics.add.sprite(500, 150, 'sacha-bottom', 1);
    this.player = player;

    // Créer un groupe statique pour les obstacles (zones de collision)
    obstacles = this.physics.add.staticGroup();

    // Ajouter des zones de collision en fonction des éléments du décor
    obstacles.create(280, 60, null).setSize(230, 110).setVisible(false);
    obstacles.create(280, 220, null).setSize(230, 90).setVisible(false);

    // Activer les collisions entre le joueur et les obstacles
    this.physics.add.collider(player, obstacles);

    // Créer le PNJ
    const pnj = new PNJ(this, 400, 300, 'sacha-bottom', 'Salut, ça va ? Le professeur a besoin de toi !');

    // Configurer les touches de direction
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    let moving = false;

    // Remettre la vitesse à 0 au début de chaque update
    player.setVelocity(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-100);
        player.anims.play('walk-left', true);
        moving = true;
    } else if (cursors.right.isDown) {
        player.setVelocityX(100);
        player.anims.play('walk-right', true);
        moving = true;
    } else if (cursors.up.isDown) {
        player.setVelocityY(-100);
        player.anims.play('walk-up', true);
        moving = true;
    } else if (cursors.down.isDown) {
        player.setVelocityY(100);
        player.anims.play('walk-down', true);
        moving = true;
    }

    if (!moving) {
        if (player.anims.isPlaying) {
            player.anims.stop();
        }

        if (player.anims.currentAnim) {
            switch (player.anims.currentAnim.key) {
                case 'walk-left':
                    player.setTexture('sacha-left', 1);
                    break;
                case 'walk-right':
                    player.setTexture('sacha-right', 1);
                    break;
                case 'walk-up':
                    player.setTexture('sacha-top', 1);
                    break;
                case 'walk-down':
                    player.setTexture('sacha-bottom', 1);
                    break;
            }
        }
    }
}
