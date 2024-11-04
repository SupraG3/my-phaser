class NewMapScene extends Phaser.Scene {
    constructor() {
        super('NewMapScene');
    }

    preload() {
        this.load.image('newBackground', './public/assets/pallet.png');
        this.load.spritesheet('character', './public/assets/pol.png', {
            frameWidth: 18,
            frameHeight: 23
        });
    }

    create() {
        const background = this.add.image(0, 0, 'newBackground').setOrigin(0, 0);
        background.displayWidth = this.sys.game.config.width;
        background.displayHeight = this.sys.game.config.height;

        this.player = this.physics.add.sprite(100, 100, 'character');
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();
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
    }
}

const newMapConfig = {
    type: Phaser.AUTO,
    width: 640,  // Taille différente pour la nouvelle map
    height: 480,
    parent: 'phaser-game',
    scene: [NewMapScene],  // Charge uniquement la nouvelle map
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    }
};

const newMapGame = new Phaser.Game(newMapConfig);

export default NewMapScene;
