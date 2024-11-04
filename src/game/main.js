import { Boot } from './scenes/Boot.js';
import { Game } from './scenes/Game.js';
import { GameOver } from './scenes/GameOver.js';
import { MainMenu } from './scenes/MainMenu.js';
import { MapMain } from './scenes/map.js';
import { Pallet } from './scenes/pallet.js';
import { Preloader } from './scenes/Preloader.js';
import { Route1 } from './scenes/Route1.js';
import { Room } from './scenes/room.js';
import{Salon } from './scenes/salon.js';
import Phaser from 'phaser';


const config = {
    type: Phaser.AUTO,
    width: 420,
    height: 425,
    parent: 'game-container',
    scene: [
        Room,
        Salon,
        Pallet,
        MapMain,
        Route1,
        Boot,
        Preloader,
        MainMenu,
        Game,
        GameOver
    ],
    physics: {
        default: 'arcade',
        // arcade: {
        //     debug: true
        // }
    }
};

const StartGame = (parent) => {
    return new Phaser.Game({ ...config, parent });
}

export default StartGame;
