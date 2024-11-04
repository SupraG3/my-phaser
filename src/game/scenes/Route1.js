import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { GameState } from '../state/GameState';

export class Route1 extends Scene {
    constructor () {
        super('Route1');
    }

    preload() {
        this.load.image('backgroundRoute1', './public/assets/route1.png'); // Charge l'image de fond
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
        this.load.spritesheet('eleve1', './public/assets/eleve1.png', {
            frameWidth: 30,
            frameHeight: 24
        });
        this.load.spritesheet('eleve2', './public/assets/eleve2.png', {
            frameWidth: 30,
            frameHeight: 24
        });
        this.load.spritesheet('eleve3', './public/assets/eleve3.png', {  // Ajout pour élève 3
            frameWidth: 30,
            frameHeight: 24
        });
        this.load.spritesheet('gaz', './public/assets/gaz.png', {
            frameWidth: 32, // Largeur d'une frame
            frameHeight: 32 // Hauteur d'une frame
        });
    }

    create() {
        // Taille de la carte
        const mapWidth = 1200; // Largeur de la carte (exemple)
        const mapHeight = 800; // Hauteur de la carte (exemple)

        // Ajouter le fond
        const background = this.add.image(0, 0, 'backgroundRoute1').setOrigin(0, 0);
        background.displayWidth = mapWidth; // Ajuste la largeur de l'image de fond
        background.displayHeight = mapHeight; // Ajuste la hauteur de l'image de fond

        // Définir les limites du monde selon la taille de la carte
        this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

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
        this.anims.create({
            key: 'gaz-idle',
            frames: this.anims.generateFrameNumbers('gaz', { start: 0, end: 7 }), // Utilise les 8 frames
            frameRate: 8, // 8 images par seconde
            repeat: -1 // Boucle infinie
        });

        // Créer le sprite du joueur avec la première image (par exemple, la marche vers le bas)
        this.player = this.physics.add.sprite(635, 770, 'sacha-top', 1);
        this.player.setCollideWorldBounds(true); // Empêche le joueur de sortir des limites du monde
        this.player.setDisplaySize(30, 46);

        // Ajouter l'élève
        this.eleve1 = this.physics.add.sprite(257, 300, 'eleve1');
        this.eleve1.setDisplaySize(30, 24);
        this.eleve1.setImmovable(true);

        this.eleve2 = this.physics.add.sprite(777, 60, 'eleve2');
        this.eleve2.setDisplaySize(30, 24);
        this.eleve2.setImmovable(true);

        // Zone d'interaction devant l'élève
        this.eleve1InteractionZone = new Phaser.Geom.Rectangle(277, 290, 40, 30);
   

        // Ajouter le texte d'invite pour parler (invisible au départ)
        this.interactText = this.add.text(210, 280, 'Appuyez sur E pour parler', { font: '16px Arial', fill: '#ffffff' }).setVisible(false);

        // Ajouter le texte pour le dialogue (invisible au départ)
        this.dialogueText = this.add.text(150, 350, '', { font: '16px Arial', fill: '#ffffff', wordWrap: { width: 400 } }).setVisible(false);

        // Variables pour suivre l'état du dialogue
        this.dialogueActive = false;
        this.dialogueIndex = 0;
        this.eleveDialogues = [
            "Salut, je suis l'élève n°1 !",
            "J'adore me cacher ici, personne ne me trouve jamais.",
            "Mais il semble que tu m'as trouvé...",
            "Je vais retourner avec Hugo !"
        ];

        // Compteur d'élèves capturés (fixe par rapport à la caméra)
        this.captureCounterText = this.add.text(10, 10, `Élèves capturés: ${GameState.elevesCaptures}/${GameState.totalEleves}`, { font: '16px Arial', fill: '#ffffff' }).setScrollFactor(0);

        // Configurer la caméra pour suivre le joueur
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight); // Limite la caméra aux dimensions du monde

        // Créer un groupe statique pour les obstacles (zones de collision)
        this.obstacles = this.physics.add.staticGroup();

        this.obstacles.create(130, 400, null).setSize(200, mapHeight).setVisible(false);
        this.obstacles.create(1060, 400, null).setSize(200, mapHeight).setVisible(false);
        this.obstacles.create(724, 680, null).setSize(420, 8).setVisible(false);
        this.obstacles.create(280, 680, null).setSize(220, 8).setVisible(false);
        
        // Activer les collisions entre le joueur et les obstacles
        this.physics.add.collider(this.player, this.obstacles);

        // Activer les collisions entre le joueur et l'élève
        this.physics.add.collider(this.player, this.eleve1);
        this.physics.add.collider(this.player, this.eleve2);

        // Configurer les touches de direction
        this.cursors = this.input.keyboard.createCursorKeys();
        this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A); // Créer la touche "A" pour attaquer
        this.input.keyboard.on('keydown-E', this.triggerDialogue, this); // Touche E pour interagir

        // Définir la zone de transition
        this.transitionZone = new Phaser.Geom.Rectangle(605, 774, 60, 10);

        this.eleve2InteractionZone = new Phaser.Geom.Rectangle(760, 70, 40, 30);


        this.eleve2Dialogues = [
            "Haha, tu ne m'attraperas pas !",
            "Je ne veux pas aller à la soutenance.",
            "Il est grand temps de lâcher ma botte secrète...",
            "Le prout fuyant !"
        ];

        this.dialogueActiveEleve2 = false;
        this.dialogueIndexEleve2 = 0;

        // Activation de la touche E pour interagir avec l'élève 2
        this.input.keyboard.on('keydown-E', this.triggerDialogueEleve2, this);

        this.grassZone = new Phaser.Geom.Rectangle(530, 140, 420, 110); // Zone d'herbe
     

        this.inGrass = false; // Variable pour détecter si on est dans la zone d'herbe
        this.inCombat = false; // Pour gérer l'état du combat

        // Points de vie du joueur et de l'élève 3
        this.playerHP = 6;
        this.eleve3HP = 6;
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

        if (Phaser.Geom.Rectangle.ContainsPoint(this.transitionZone, this.player.getCenter())) {
            this.changeScene();
        }

        if (this.eleve1InteractionZone && Phaser.Geom.Rectangle.ContainsPoint(this.eleve1InteractionZone, this.player.getCenter()) && !this.dialogueActive) {
            this.interactText.setVisible(true); 
        } else {
            this.interactText.setVisible(false); 
        }

        if (this.dialogueActive) {
            this.player.setVelocity(0); 
        }

        if (this.eleve2InteractionZone && Phaser.Geom.Rectangle.ContainsPoint(this.eleve2InteractionZone, this.player.getCenter()) && !this.dialogueActiveEleve2) {
            this.interactText.setVisible(true); 
        } else {
            if (!this.dialogueActive) {
                this.interactText.setVisible(false);
            }
        }
    
        if (this.dialogueActiveEleve2) {
            this.player.setVelocity(0);
        }

        if (!this.inCombat) {
            if (Phaser.Geom.Rectangle.ContainsPoint(this.grassZone, this.player.getCenter())) {
                if (!this.inGrass) {
                    this.inGrass = true;
                    this.checkGrassEncounter(); 
                }
            } else {
                this.inGrass = false;
            }
        }
    
        if (this.inCombat) {
            this.manageCombat();
        }

        if (GameState.elevesCaptures >= GameState.totalEleves) {
            this.displayEndScreen();
        }

        if (this.isEndScreenActive) {
            this.player.setVelocity(0);
            return;
        }
    }

    checkGrassEncounter() {
        const chance = Math.random();
        if (chance < 0.2) {  
            this.startCombat();
        }
    }
    
    startCombat() {
        this.inCombat = true;
        this.dialogueText.setText("Un élève sauvage apparaît !");
        this.dialogueText.setVisible(true);
    
        this.eleve3 = this.add.sprite(this.player.x, this.player.y, 'eleve3');
        this.eleve3.setDisplaySize(30, 24);
    
        this.time.delayedCall(2000, () => {
            this.dialogueText.setPosition(this.player.x - 50, this.player.y - 60);
            this.dialogueText.setText("Appuyez sur A pour attaquer.");
        });
    }

    manageCombat() {
        if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
            this.attack();
        }
    }
    
    attack() {
        this.eleve3HP -= 2; 
        this.dialogueText.setText("Tu utilises Coup de PC ! 2 dégâts !");
        this.time.delayedCall(1000, () => {
            if (this.eleve3HP <= 0) {
                this.endCombat(true);
            } else {
                this.playerHP -= 1;
                this.dialogueText.setText("Élève utilise Coup de Sandwich ! 1 dégât !");
                this.time.delayedCall(1000, () => {
                    if (this.playerHP <= 0) {
                        this.endCombat(false);
                    } else {
                        this.dialogueText.setText("Appuyez sur A pour attaquer.");
                    }
                });
            }
        });
    }
    
    endCombat(won) {
        if (won) {
            this.dialogueText.setText("Tu as vaincu l'élève !");
            this.eleve3.destroy();
            this.eleve3Defeated = true;
            this.inCombat = false;
    
            // Augmenter le nombre d'élèves capturés
            GameState.elevesCaptures++; 
            this.captureCounterText.setText(`Élèves capturés: ${GameState.elevesCaptures}/${GameState.totalEleves}`);
        } else {
            this.dialogueText.setText("Tu as perdu...");
        }
    
        this.time.delayedCall(2000, () => {
            this.dialogueText.setVisible(false);
        });
    }
    
    displayDialogue() {
        if (this.dialogueIndex < this.eleveDialogues.length) {
            this.dialogueText.setText(this.eleveDialogues[this.dialogueIndex]);
            this.dialogueText.setVisible(true);
            this.dialogueIndex++;
        } else {
            this.dialogueText.setVisible(false);
            this.dialogueActive = false;
            this.dialogueIndex = 0;
            this.captureEleve();
        }
    }

    triggerDialogue() {
        if (this.eleve1InteractionZone && Phaser.Geom.Rectangle.ContainsPoint(this.eleve1InteractionZone, this.player.getCenter())) {
            if (!this.dialogueActive) {
                this.dialogueActive = true;
                this.displayDialogue();
            } else {
                this.displayDialogue();
            }
        }
    }

    captureEleve() {
        this.eleve1.destroy();
        this.eleve1InteractionZone = null;
        this.input.keyboard.off('keydown-E', this.triggerDialogue, this); 
        GameState.elevesCaptures++;
        this.captureCounterText.setText(`Élèves capturés: ${GameState.elevesCaptures}/${GameState.totalEleves}`);
    
        // Vérifier si tous les élèves ont été capturés
        if (GameState.elevesCaptures >= GameState.totalEleves) {
            this.displayEndScreen();
        }
    }
    
    triggerDialogueEleve2() {
        if (this.eleve2InteractionZone && Phaser.Geom.Rectangle.ContainsPoint(this.eleve2InteractionZone, this.player.getCenter())) {
            if (!this.dialogueActiveEleve2) {
                this.dialogueActiveEleve2 = true;
                this.displayDialogueEleve2();
            } else {
                this.displayDialogueEleve2();
            }
        }
    }
    
    displayDialogueEleve2() {
        if (this.dialogueTextEleve2 === undefined) {
            this.dialogueTextEleve2 = this.add.text(600, 100, '', { font: '16px Arial', fill: '#ffffff', wordWrap: { width: 400 } }).setVisible(false);
        
        }
        
        if (this.dialogueIndexEleve2 < this.eleve2Dialogues.length) {
            this.dialogueTextEleve2.setText(this.eleve2Dialogues[this.dialogueIndexEleve2]);
            this.dialogueTextEleve2.setVisible(true);
            this.dialogueIndexEleve2++;
        } else {
            this.dialogueTextEleve2.setVisible(false);
            this.dialogueActiveEleve2 = false;
            this.dialogueIndexEleve2 = 0;
            this.triggerGaz();
        }
    }
    
    triggerGaz() {
        this.gazSprite = this.add.sprite(this.eleve2.x, this.eleve2.y, 'gaz');
        this.gazSprite.setDisplaySize(50, 50);
        this.gazSprite.anims.play('gaz-idle');
    
        this.time.delayedCall(2000, () => {
            this.gazSprite.destroy();
    
            this.eleve2.setPosition(400, 400);
            this.eleve2.setVisible(true);
    
            this.eleve2TeleportInteractionZone = new Phaser.Geom.Rectangle(380, 410, 40, 30);
   
    
            this.input.keyboard.off('keydown-E', this.triggerDialogueEleve2, this);  
            this.input.keyboard.on('keydown-E', this.triggerDialogueAfterTeleport, this); 
        }, [], this);
    }
    
    triggerDialogueAfterTeleport() {
        if (this.eleve2TeleportInteractionZone && Phaser.Geom.Rectangle.ContainsPoint(this.eleve2TeleportInteractionZone, this.player.getCenter())) {
            if (!this.dialogueActiveEleve2AfterTeleport) {
                this.dialogueActiveEleve2AfterTeleport = true;
                this.dialogueIndexEleve2AfterTeleport = 0; 
                this.displayDialogueAfterTeleport();
            } else {
                this.displayDialogueAfterTeleport();
            }
        }
    }
    
    displayDialogueAfterTeleport() {
        if (this.dialogueTextEleve2AfterTeleport === undefined) {
            this.dialogueTextEleve2AfterTeleport = this.add.text(350, 300, '', { font: '16px Arial', fill: '#ffffff', wordWrap: { width: 400 } }).setVisible(false);
        }
    
        const eleve2TeleportDialogues = [
            "Incroyable, malgré mon prout fuyant, tu as réussi à me retrouver.",
            "Une première, cela mérite que je retourne auprès d'Hugo."
        ];
    
        if (this.dialogueIndexEleve2AfterTeleport < eleve2TeleportDialogues.length) {
            this.dialogueTextEleve2AfterTeleport.setText(eleve2TeleportDialogues[this.dialogueIndexEleve2AfterTeleport]);
            this.dialogueTextEleve2AfterTeleport.setVisible(true);
            this.dialogueIndexEleve2AfterTeleport++;
        } else {
            this.dialogueTextEleve2AfterTeleport.setVisible(false);
            this.dialogueActiveEleve2AfterTeleport = false;
            this.dialogueIndexEleve2AfterTeleport = 0;
    
            this.captureEleve2();
        }
    }
    
    captureEleve2() {
        this.eleve2.destroy();
        this.eleve2TeleportInteractionZone = null;
        this.input.keyboard.off('keydown-E', this.triggerDialogueAfterTeleport, this);
        GameState.elevesCaptures++;
        this.captureCounterText.setText(`Élèves capturés: ${GameState.elevesCaptures}/${GameState.totalEleves}`);
    
        // Vérifier si tous les élèves ont été capturés
        if (GameState.elevesCaptures >= GameState.totalEleves) {
            this.displayEndScreen();
        }
    }
    displayEndScreen() {
        // Empêcher le joueur de bouger
        this.player.setVelocity(0);
        this.player.anims.stop(); // Stopper l'animation du joueur
        
        this.isEndScreenActive = true;
    
        // Supprimer le fond noir pour le message de fin
        const message = "Félicitations !\nTu as retrouvé tous les élèves.\nHugo ne sera pas viré d'Epitech\net tout le monde a eu \n-41 pour s'être enfui,\nsauf toi qui as eu le grade A :)";
    
        const textStyle = { 
            font: "24px Arial", 
            fill: "#ffffff", 
            align: "center", 
            wordWrap: { width: 400 } 
        };
    
        const endText = this.add.text(
            this.player.x,  
            this.player.y - 100,  // Positionne le texte au-dessus de la tête du joueur
            message, 
            textStyle
        );
    
        endText.setOrigin(0.5, 0.5);
    
        // Bloquer le mouvement jusqu'à ce que le joueur appuie sur "E"
        this.input.keyboard.once('keydown-E', () => {
            endText.destroy();  // Enlever le texte après avoir appuyé sur "E"
            this.isEndScreenActive = false;  // Permettre au joueur de bouger à nouveau
        });
    }
    
    
    

    
    changeScene() {
        this.scene.start('Pallet');
    }
}
