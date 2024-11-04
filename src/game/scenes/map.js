import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { GameState } from '../state/GameState';

export class MapMain extends Scene {
    constructor () {
        super('MapMain');
    }

    preload() {
        this.load.image('Mapbackground', './public/assets/labo.png');
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
        this.load.spritesheet('professor', './public/assets/chen.png', {
            frameWidth: 18,
            frameHeight: 20
        });
    }

    create() {
        const background = this.add.image(0, 0, 'Mapbackground').setOrigin(0, 0);
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

        this.professor = this.physics.add.sprite(207, 100, 'professor');
        this.professor.setImmovable(true); 
        this.player = this.physics.add.sprite(207, 400, 'character-up');
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
        this.physics.add.collider(this.player, this.professor);

        // Définir une zone d'interaction devant le professeur
        this.interactionZone = new Phaser.Geom.Rectangle(199, 110, 18, 18); // Zone devant le PNJ

        // Ajouter le texte d'invite pour parler (invisible au départ)
        this.interactText = this.add.text(150, 80, 'Appuyez sur E pour parler', { font: '16px Arial', fill: '#ffffff' }).setVisible(false);

        // Ajouter le texte pour le dialogue (invisible au départ)
        this.dialogueText = this.add.text(60, 60, '', { font: '16px Arial', fill: '#ffffff', wordWrap: { width: 400 } }).setVisible(false);

        // Variables pour suivre l'état du dialogue
        this.dialogueActive = false;
        this.dialogueIndex = 0;
        this.dialogues = [
            "Bonjour, je suis le Pédago Hugo !",
            "Bienvenue chez Epitech!",
            "J'ai un gros souci, j'ai perdu quelques élèves en cours de route...",
            "Une soutenance va bientôt avoir lieu mais je ne les retrouve plus.",
            "Pourrais-tu m'aider à les retrouver ?",
            "Tu m'as l'air d'être quelqu'un de confiance", 
            "mon avenir repose sur toi.",
            "Je ne veux pas être viré, aide-moi s'il te plaît !"
        ];

        // Compteur d'élèves capturés
        this.captureCounterText = this.add.text(10, 10, `Élèves capturés: ${GameState.elevesCaptures}/${GameState.totalEleves}`, { font: '16px Arial', fill: '#ffffff' }).setScrollFactor(0);

        // Gestionnaire des touches de commande
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown-E', this.triggerDialogue, this); // Touche E pour interagir

        this.transitionZone = new Phaser.Geom.Rectangle(183, 410, 50, 10);
       

        this.positionText = this.add.text(10, 10, 'Position: x: 0, y: 0', { font: '16px Arial', fill: '#ffffff' });
        EventBus.emit('current-scene-ready', this);
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

        // Vérifier si le joueur est dans la zone d'interaction
        if (Phaser.Geom.Rectangle.ContainsPoint(this.interactionZone, this.player) && !this.dialogueActive) {
            this.interactText.setVisible(true); // Afficher le texte d'invite
        } else {
            this.interactText.setVisible(false); // Cacher le texte d'invite quand hors de la zone
        }

        // Stopper le mouvement et afficher le dialogue
        if (this.dialogueActive) {
            this.player.setVelocity(0); // Stopper le joueur pendant le dialogue
        }

        // Transition de scène
        if (Phaser.Geom.Rectangle.ContainsPoint(this.transitionZone, this.player)) {
            this.scene.switch('Pallet');  // Passe à la scène Pallet
        }

        // Mettre à jour le compteur d'élèves capturés
        this.captureCounterText.setText(`Élèves capturés: ${GameState.elevesCaptures}/${GameState.totalEleves}`);
    }

    displayDialogue() {
        if (this.dialogueIndex < this.dialogues.length) {
            this.dialogueText.setText(this.dialogues[this.dialogueIndex]);
            this.dialogueText.setVisible(true);
            this.dialogueIndex++;
        } else {
            this.dialogueText.setVisible(false);
            this.dialogueActive = false; // Fin du dialogue
            this.dialogueIndex = 0; // Réinitialiser le dialogue
            GameState.hugoAide = true; // Hugo demande de l'aide
        }
    }

    triggerDialogue() {
        if (Phaser.Geom.Rectangle.ContainsPoint(this.interactionZone, this.player)) {
            if (!this.dialogueActive) {
                this.dialogueActive = true;
                this.displayDialogue();
            } else {
                this.displayDialogue(); // Passer au dialogue suivant
            }
        }
    }

    changeScene() {
        this.scene.start('Pallet');
    }
}
