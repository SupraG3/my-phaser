import { EventBus } from '../EventBus';
import { Scene } from 'phaser';




export class Room extends Scene
{
    constructor ()
    {
        super('Room');
    }

     preload() {
        this.load.image('background', './public/assets/room.png');
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

    create() {
        // Ajouter le fond
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.displayWidth = 352;
        background.displayHeight = 284;
        
        this.physics.world.setBounds(0, 0, background.displayWidth, background.displayHeight);
    
    
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
        this.player = this.physics.add.sprite(310, 80, 'sacha-right', 1);
    
        this.player.setCollideWorldBounds(true);
    
        // Créer un groupe statique pour les this.obstacles (zones de collision)
        this.obstacles = this.physics.add.staticGroup();
    
        // Ajouter des zones de collision en fonction des éléments du décor
        this.obstacles.create(175, 20, null).setSize(350, 50).setVisible(false);
        this.obstacles.create(230, 15, null).setSize(20, 180).setVisible(false);
        this.obstacles.create(255, 100, null).setSize(70, 10).setVisible(false);
        this.obstacles.create(175, 145, null).setSize(30, 50).setVisible(false);
        this.obstacles.create(49, 185, null).setSize(47, 60).setVisible(false);
    
        // Activer les collisions entre le joueur et les this.obstacles
        this.physics.add.collider(this.player, this.obstacles);
    
        // Créer une zone pour les escaliers
        this.transitionZone = new Phaser.Geom.Rectangle(291, 66, 10, 34);
    
            

    
        // Configurer les touches de direction
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        let moving = false;
    
        // Remettre la vitesse à 0 au début de chaque update
        this.player.setVelocity(0);
    
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-100);
            this.player.anims.play('walk-left', true);
            moving = true;
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(100);
            this.player.anims.play('walk-right', true);
            moving = true;
        } else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-100);
            this.player.anims.play('walk-up', true);
            moving = true;
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(100);
            this.player.anims.play('walk-down', true);
            moving = true;
        }
    
        if (!moving) {
            if (this.player.anims.isPlaying) {
                this.player.anims.stop();
            }
    
            if (this.player.anims.currentAnim) {
                switch (this.player.anims.currentAnim.key) {
                    case 'walk-left':
                        this.player.setTexture('sacha-left', 1);
                        break;
                    case 'walk-right':
                        this.player.setTexture('sacha-right', 1);
                        break;
                    case 'walk-up':
                        this.player.setTexture('sacha-top', 1);
                        break;
                    case 'walk-down':
                        this.player.setTexture('sacha-bottom', 1);
                        break;
                }
            }
        }
        if (Phaser.Geom.Rectangle.ContainsPoint(this.transitionZone, this.player.getCenter())) {
            this.changeScene();
        }
    }

    changeScene ()
    {
        this.scene.start('Salon');
    }

}