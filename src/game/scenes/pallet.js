import { Scene } from 'phaser';
import { createPlayerAnimations, handlePlayerMovement } from '../utils';

export class Pallet extends Scene
{
    constructor () {
        super('Pallet');
    }

    preload() {
        // Charger l'image de fond pour la scène Pallet
        this.load.image('palletBackground', './public/assets/pallet.png');
        this.load.spritesheet('sacha-bottom', './public/assets/red-bottom.png', { frameWidth: 17, frameHeight: 33 });
        this.load.spritesheet('sacha-left', './public/assets/red-left.png', { frameWidth: 17, frameHeight: 33 });
        this.load.spritesheet('sacha-right', './public/assets/red-right.png', { frameWidth: 17, frameHeight: 33 });
        this.load.spritesheet('sacha-top', './public/assets/red-top.png', { frameWidth: 17, frameHeight: 33 });
    }

    create() {
        const background = this.add.image(0, 0, 'palletBackground').setOrigin(0, 0);
        background.displayWidth = this.sys.game.config.width;
        background.displayHeight = this.sys.game.config.height;

        // Créer les animations via la fonction utilitaire
        createPlayerAnimations(this);

        // Ajouter le joueur dans la scène Pallet
        this.player = this.physics.add.sprite(140, 180, 'sacha-bottom', 1);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(0.7);

        this.cursors = this.input.keyboard.createCursorKeys();

        // Créer les obstacles
        this.obstacles = this.physics.add.staticGroup();
        this.obstacles.create(105, 33, null).setSize(200, 63).setVisible(false);
        this.obstacles.create(330, 33, null).setSize(180, 63).setVisible(false);
        this.obstacles.create(45, 33, null).setSize(80, 780).setVisible(false);
        this.obstacles.create(375, 33, null).setSize(80, 780).setVisible(false);
        this.obstacles.create(310, 384, null).setSize(50, 80).setVisible(false);
        this.obstacles.create(110, 384, null).setSize(50, 80).setVisible(false);
        this.obstacles.create(210, 390, null).setSize(150, 65).setVisible(false);
        this.obstacles.create(172, 340, null).setSize(50, 65).setVisible(false);
        this.obstacles.create(153, 120, null).setSize(60, 55).setVisible(false);
        this.obstacles.create(263, 120, null).setSize(60, 55).setVisible(false);
        this.obstacles.create(263, 220, null).setSize(80, 55).setVisible(false);
        this.obstacles.create(153, 220, null).setSize(70, 25).setVisible(false);
        this.obstacles.create(260, 300, null).setSize(79, 25).setVisible(false);

        this.physics.add.collider(this.player, this.obstacles);

        // Créer une zone de transition
        this.transitionZoneToMapMain = new Phaser.Geom.Rectangle(261, 246, 10, 14);
       

        this.transitionZoneToSalon = new Phaser.Geom.Rectangle(138, 150, 10, 14);
        

        this.transitionZoneRoute1 = new Phaser.Geom.Rectangle(211, 3, 26, 14);


    }

    update() {
        // Gérer le mouvement via la fonction utilitaire
        handlePlayerMovement(this, this.player, this.cursors);

        // Vérifier si le joueur est dans la zone de transition pour retourner au Salon
        if (Phaser.Geom.Rectangle.ContainsPoint(this.transitionZoneToSalon, this.player.getCenter())) {
            this.changeSceneToSalon();
        }

        // Vérifier si le joueur est dans la zone de transition pour aller à MapMain
        if (Phaser.Geom.Rectangle.ContainsPoint(this.transitionZoneToMapMain, this.player.getCenter())) {
            this.changeSceneToMapMain();
        }
        if (Phaser.Geom.Rectangle.ContainsPoint(this.transitionZoneRoute1, this.player)) {
            this.scene.start('Route1'); 
        }
    }

    changeSceneToSalon() {
        this.scene.start('Salon');
    }

    changeSceneToMapMain() {
        this.scene.start('MapMain');
    }
}