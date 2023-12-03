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
        this.load.image('background', 'assets/background3.png');
        this.load.image('lamp', 'assets/lamp.png');
        this.load.image('bench', 'assets/bench.png');
        this.load.image('bush', 'assets/bush.png');
        this.load.image('house1', 'assets/house1.png');
        this.load.image('house2', 'assets/house2.png');
        this.load.image('house3', 'assets/house3.png');
        this.load.image('ladder', 'assets/ladder.png');
        this.load.image('wall', 'assets/wall.png');

        this.load.json('levelData', 'assets/level.json');
    }

    create()
    {
        this.bg = this.add.sprite(0, 0, 'background');
        this.bg.setOrigin(0, 0);

        this.levelData = this.cache.json.get('levelData');

        this.setuplevel();

        this.input.on('pointerdown', function(pointer) 
        {
            console.log(pointer.x + ', ' + pointer.y);
        });
    }

    update()
    {
    }

    setuplevel()
    {
        const { houses } = this.levelData;
        for (const house of houses)
        {
            const houseSprite = this.add.sprite(house.x, house.y, 'house' + house.type);
            houseSprite.setOrigin(0, 0);
        }

        const { wall } = this.levelData;
        this.wall = this.physics.add.sprite(wall.x, wall.y, 'wall');

        const { ladder } = this.levelData;
        this.ladder = this.physics.add.sprite(ladder.x, ladder.y, 'ladder');

        const { benches } = this.levelData;
        for (const bench of benches)
        {
            const benchSprite = this.add.sprite(bench.x, bench.y, 'bench');
            benchSprite.setOrigin(0, 0);
        }

        const { lamps } = this.levelData;
        for (const lamp of lamps)
        {
            const lampSprite = this.add.sprite(lamp.x, lamp.y, 'lamp');
            lampSprite.setOrigin(0, 0);
            lampSprite.setScale(0.6, 0.6);
        }

        const { bushes } = this.levelData;
        for (const bush of bushes)
        {
            const bushSprite = this.add.sprite(bush.x, bush.y, 'bush');
            bushSprite.setOrigin(0, 0);
            bushSprite.setScale(bush.scaleX, bush.scaleY);
        }
    }
}

const gameScene = new GameScene('game');

const game = new Phaser.Game
({
    width: 640,
    height: 360,
    type: Phaser.AUTO,
    scene: gameScene,
    physics: 
    {
        default: 'arcade',
        arcade: 
        {
            debug: true,
            gravity: 
            {
                y: 0
            }
        }
    }
});
