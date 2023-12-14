/// <reference path="./types/index.d.ts" />

class GameScene extends Phaser.Scene
{
    constructor(title)
    {
        super(title);
    }

    init()
    {   
        this.revolverarm = 0;
        this.pistolarm = 0;
        this.smgarm = 0;
        this.assaultarm = 0;
        this.target = 0;
        this.ROTATION_SPEED = 1 * Math.PI;

        this.ammo = 0;
        this.speed = 300;

        this.randomY = Phaser.Math.Between(100, 300);
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

        this.load.image('player', 'assets/player.png');
        this.load.image('revolver', 'assets/guns/revolverarm.png');
        this.load.image('pistol', 'assets/guns/pistolarm.png');

        this.load.image('shot', 'assets/shot.png');
        this.load.image('sbullet', 'assets/sbullet.png');
        this.load.image('mbullet', 'assets/mbullet.png');
        this.load.image('lbullet', 'assets/lbullet.png');

        this.load.spritesheet('golem', 'assets/enemies/golem.png', 
        {
            frameWidth: 93,
            frameHeight: 74,
            margin: 0,
            spacing: 1
        });

        this.load.json('levelData', 'assets/level.json');
    }

    create()
    {
        this.randomY = Phaser.Math.Between(140, 300);

        this.shots = this.add.group();
        this.enemies = this.add.group();
        this.hitboxes = this.add.group();

        this.bg = this.add.sprite(0, 0, 'background');
        this.bg.setOrigin(0, 0);

        this.levelData = this.cache.json.get('levelData');

        this.setuplevel();

        //this.revolver = this.physics.add.sprite(614.5, 150.5, 'revolver');
        //this.revolver.setOrigin(1, 1);

        this.pistol = this.physics.add.sprite(614.5, 150.5, 'pistol');
        this.pistol.setOrigin(1, 1);

        this.anims.create
        ({
            key: 'golemwalk',
            frames: this.anims.generateFrameNames('golem', { frames: [ 0, 1 ] }),
            yoyo: true,
            frameRate: 3,
            repeat: -1
        });

        this.anims.create
        ({
            key: 'golemattack',
            frames: this.anims.generateFrameNames('golem', { frames: [ 2, 3, 4, 5 ] }),
            yoyo: false,
            frameRate: 5,
            repeat: -1
        });

        this.anims.create
        ({
            key:'golemdie',
            frames: this.anims.generateFrameNames('golem', { frames: [ 0, 6, 7 ]}),
            yoyo: false,
            frameRate: 5,
            repeat: 0
        });

        this.input.on('pointermove', (pointer) =>
        {
            //this.target = Phaser.Math.Angle.BetweenPoints(this.revolver, pointer);
            this.target = Phaser.Math.Angle.BetweenPoints(this.pistol, pointer);
        });

        this.time.addEvent
        ({
            delay: 3000,
            repeat: -1,
            callback: () =>
            {
                const golem = this.add.sprite(0, this.randomY, 'golem');
                this.physics.add.existing(golem);
                golem.body.setVelocityX(30);
                this.enemies.add(golem);
            }
        });

        this.shooting();

        this.input.on('pointerdown', function(pointer) 
        {
            console.log(pointer.x + ', ' + pointer.y);
        });
    }

    update()
    {
        //this.revolver.rotation = this.target+Math.PI;
        this.pistol.rotation = this.target+Math.PI;
        this.randomY = Phaser.Math.Between(140, 300);

        this.shots.getChildren().forEach(bullet => 
            {
                if(this.shot.x > 640)
                {
                    this.shot.destroy();
                }
            });

        const wallRect = this.wall.getBounds();
            Phaser.Actions.Call(this.enemies.getChildren(), (golem) =>
            {
                if (golem.x > 475)
                {
                    golem.x = 475;
                    golem.body.setVelocityX(0);
                }

                if (golem.x+50 > this.wall.x)
                {
                    if (!golem.animStop) 
                    {
                        golem.anims.stop();
                        golem.animStop = true;
                    }

                    if (!golem.anims.isPlaying)
                    {
                        golem.anims.play('golemattack');
                    }
                }
                else
                {
                    if (!golem.anims.isPlaying)
                    {
                        golem.anims.play('golemwalk');
                    }
                }

                Phaser.Actions.Call(this.shots.getChildren(), (bullet) =>
                {
                    const golemRect = golem.getBounds();
                    const bulletRect = bullet.getBounds();
    
                    if (Phaser.Geom.Intersects.RectangleToRectangle(golemRect, bulletRect) && golem.x > bullet.x)
                    {
                        bullet.destroy();
                        golem.anims.stop();
                        golem.setFrame(0);
                        golem.anims.play('golemdie');
                        this.time.delayedCall(400, () => 
                            {
                                golem.destroy();
                            }, 
                            null, 
                            this
                        );
                    }
                });
            });
    }

    shooting()
    {
        this.input.on('pointerdown', (pointer) => 
        {
            this.shot = this.physics.add.sprite(614.5, 150.5, 'shot')
            this.vector = new Phaser.Math.Vector2(pointer.x - this.pistol.x, pointer.y - this.pistol.y);
            this.vector.setLength(this.speed);
            this.shots.add(this.shot);
            this.shot.rotation = this.target+Math.PI;
            this.shot.body.setVelocity(this.vector.x, this.vector.y);
        });
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

        const { player } = this.levelData;
        this.player = this.physics.add.sprite(player.x, player.y, 'player');

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
