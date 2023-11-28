/// <reference path="./types/index.d.ts" />

class GameScene extends Phaser.Scene
{
    constructor(title)
    {
        super(title);
    }

    init()
    {

    }

    preload()
    {

    }

    create()
    {

    }

    update()
    {

    }
}

const gameScene = new GameScene('game');

const game = new Phaser.Game
({
    width: 640,
    height: 360,
    type: Phaser.AUTO,
    scene: gameScene
});
