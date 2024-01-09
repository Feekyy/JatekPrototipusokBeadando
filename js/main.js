/// <reference path="./types/index.d.ts" />

const loadingScene = new LoadingScene('loading');
const shopScene = new ShopScene('shop');
const homeScene = new HomeScene('home');
const htpScene = new HtpScene('htp');
const gameScene = new GameScene('game');

const game = new Phaser.Game
({
    width: 640,
    height: 360,
    type: Phaser.AUTO,
    scene: [loadingScene, homeScene, gameScene, htpScene, shopScene ],
    physics: 
    {
        default: 'arcade',
        arcade: 
        {
            debug: false,
            gravity: 
            {
                y: 0
            }
        }
    }
});
