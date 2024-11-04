class PNJ {
    constructor(scene, x, y, texture, dialogue) {
        // Créer le sprite du PNJ
        this.pnjSprite = scene.physics.add.sprite(x, y, texture);

        // Le dialogue que le PNJ va dire
        this.dialogue = dialogue;

        // Texte de dialogue (invisible au début)
        this.dialogueText = scene.add.text(x - 50, y - 50, '', {
            font: '16px Arial',
            fill: '#ffffff',
            backgroundColor: '#000000'
        }).setVisible(false);

        // Activer les collisions entre le joueur et le PNJ
        scene.physics.add.overlap(scene.player, this.pnjSprite, this.talk, null, this);
    }

    talk() {
        // Afficher le texte de dialogue
        this.dialogueText.setText(this.dialogue);
        this.dialogueText.setVisible(true);

        // Après 3 secondes, masquer le texte de dialogue
        this.pnjSprite.scene.time.addEvent({
            delay: 3000,
            callback: () => {
                this.dialogueText.setVisible(false);
            },
            callbackScope: this
        });
    }
}

export default PNJ;
