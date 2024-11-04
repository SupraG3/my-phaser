import { EventBus } from '../EventBus';
import { Scene } from 'phaser';


export class Salon extends Scene
{
    constructor ()
    {
        super('Salon');
        console.log('Salon constructor');
    }

    preload() {
        this.load.image('salonBackground', './public/assets/salon.png');
    
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

    create() {
        // Ajouter le fond
        const background = this.add.image(0, 0, 'salonBackground').setOrigin(0, 0);
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
        this.player = this.physics.add.sprite(270, 70, 'sacha-left', 1);
        this.player = this.player;
    
        this.player.setCollideWorldBounds(true);
    
        // Créer un groupe statique pour les this.obstacles (zones de collision)
        this.obstacles = this.physics.add.staticGroup();
    
       
        // Ajouter des zones de collision en fonction des éléments du décor
        this.obstacles.create(165, 30, null).setSize(350, 50).setVisible(false);
        this.obstacles.create(180, 150, null).setSize(130, 70).setVisible(false);
        this.obstacles.create(320, 75, null).setSize(40, 30).setVisible(false);
        this.obstacles.create(340, 225, null).setSize(30, 30).setVisible(false);
        this.obstacles.create(10, 225, null).setSize(30, 30).setVisible(false);
     
    
        // Activer les collisions entre le joueur et les this.obstacles
        this.physics.add.collider(this.player, this.obstacles);
    
        // Créer une zone pour les escaliers
        this.transitionZone = new Phaser.Geom.Rectangle(83, 265, 40, 14); // Zone ajustée pour le salon
     

        this.transitionZone2 = new Phaser.Geom.Rectangle(280, 60, 10, 30); // Zone ajustée pour le salon


       
    
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
        if (Phaser.Geom.Rectangle.ContainsPoint(this.transitionZone2, this.player.getCenter())) {
            this.scene.start('Room');
        }
    } 

    changeScene ()
    {
        this.scene.start('Pallet');
    }
}




