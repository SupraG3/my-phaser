export function createPlayerAnimations(scene) {
    scene.anims.create({
        key: 'walk-down',
        frames: scene.anims.generateFrameNumbers('sacha-bottom', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });

    scene.anims.create({
        key: 'walk-up',
        frames: scene.anims.generateFrameNumbers('sacha-top', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });

    scene.anims.create({
        key: 'walk-left',
        frames: scene.anims.generateFrameNumbers('sacha-left', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });

    scene.anims.create({
        key: 'walk-right',
        frames: scene.anims.generateFrameNumbers('sacha-right', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });
}

export function handlePlayerMovement(scene, player, cursors) {
    let moving = false;
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