const config = {
    type: Phaser.AUTO,
    width: 800,  
    height: 600, 
    parent: 'phaser-game', 
    scene: {
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
    this.load.image('background', './public/assets/viridian.gif');
    this.load.spritesheet('character', './public/assets/pol.png', {
        frameWidth: 18,
        frameHeight: 23
    });
    this.load.spritesheet('character-down', './public/assets/testa.png', {
        frameWidth: 18, // Assurez-vous que ces dimensions correspondent à votre nouvelle spritesheet
        frameHeight: 20
    });
    this.load.spritesheet('character-left', './public/assets/droite.png', {
        frameWidth: 18, // Assurez-vous que ces dimensions correspondent à votre nouvelle spritesheet
        frameHeight: 20
    });
    this.load.spritesheet('character-right', './public/assets/right.png', {
        frameWidth: 18, // Assurez-vous que ces dimensions correspondent à votre nouvelle spritesheet
        frameHeight: 20
    });
    this.load.spritesheet('character-up', './public/assets/up.png', {
        frameWidth: 18, // Assurez-vous que ces dimensions correspondent à votre nouvelle spritesheet
        frameHeight: 20
    });
}


function create() {
    // Ajouter le fond
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

    // Créer le sprite du joueur
    player = this.physics.add.sprite(400, 300, 'character');

    // Créer un groupe statique pour les obstacles (zones de collision)
    obstacles = this.physics.add.staticGroup();

    // Ajouter des zones de collision en fonction des éléments du décor
    obstacles.create(435, 370, null).setSize(80, 63).setVisible(false); // Exemple de zone de collision pour un rocher
    obstacles.create(300, 400, null).setSize(80, 30).setVisible(false); // Exemple de zone de collision pour un arbre

    // Activer les collisions entre le joueur et les obstacles
    this.physics.add.collider(player, obstacles);

    // Configurer les touches de direction
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    player.setVelocity(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-100);
        player.anims.play('walk-left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(100);
        player.anims.play('walk-right', true);
    } else if (cursors.up.isDown) {
        player.setVelocityY(-100);
        player.anims.play('walk-up', true);
    } else if (cursors.down.isDown) {
        player.setVelocityY(100);
        player.anims.play('walk-down', true);
    } else {
        player.anims.stop();
        player.setFrame(0);
    }
}
