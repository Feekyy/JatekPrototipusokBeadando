/// <reference path="../types/index.d.ts" />

class GameScene extends Phaser.Scene
{
    constructor(title)
    {
        super(title);
    }

    init()
    {  
        this.ROTATION_SPEED = 1 * Math.PI;
        this.lastCLickTime = 0;
        this.lastEventTime = 0;
        this.eventTimer = 1000;

        this.killed = 0;
        this.enemyNumber = Math.floor(5+(loadingScene.level/2)*5);
        this.speed = 300;

        this.randomY = Phaser.Math.Between(100, 300);

        this.ending = true;
    }

    create()
    {
        this.randomY = Phaser.Math.Between(140, 300);

        this.shots = this.add.group();
        this.enemies = this.add.group();

        this.bg = this.add.sprite(0, 0, 'background');
        this.bg.setOrigin(0, 0);

        this.levelData = this.cache.json.get('levelData');

        this.setuplevel();

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
            this.target = Phaser.Math.Angle.BetweenPoints(this.weapon, pointer);
        });

        this.time.addEvent
        ({
            delay: 3000 - 100* (loadingScene.level/2),
            repeat: this.enemyNumber,
            callback: () =>
            {
                const golem = this.add.sprite(0, this.randomY, 'golem');
                this.physics.add.existing(golem);
                golem.body.setVelocityX(30);
                this.enemies.add(golem);
            }
        });

        this.lives = this.add.group
        ({
            key: 'heart',
            repeat: loadingScene.lives,
            setXY:
            {
                x: 610,
                y: 35,
                stepX: -52,
                setScale: 0.1
            }
        });
        Phaser.Actions.ScaleXY(this.lives.getChildren(), -0.8, -0.8);
        
        switch(loadingScene.weaponType)
        {
            case 1: this.revolverShoot(); break;
            case 2: this.pistolShoot(); break;
            case 3: this.smgShoot(); break;
            case 4: this.assaultShoot(); break;
        }

        this.textLvl = this.add.text(10, 10, 'Level: ' + loadingScene.level, 
        {
            font: '16px Arial',
            color: 'aqua'
        });
        this.textMon = this.add.text(10, 30, 'Money: ' + loadingScene.money, 
        {
            font: '16px Arial',
            color: 'aqua'
        });
        this.textHel = this.add.text(10, 50, 'Health: ' + loadingScene.wallHealth, 
        {
            font: '16px Arial',
            color: 'aqua'
        });
    }

    update()
    {
        const now = Date.now();

        this.weapon.rotation = this.target+Math.PI;
        this.randomY = Phaser.Math.Between(140, 300);

        this.shots.getChildren().forEach(bullet => 
        {
            if(this.shot.x > 640)
            {
                this.shot.destroy();
            }
        });

        Phaser.Actions.Call(this.enemies.getChildren(), (golem) =>
        {
            if (golem.anims.isPlaying)
            {
                if (now - this.lastEventTime >= this.eventTimer) 
                {
                    if (golem.anims.currentAnim.key === "golemattack")
                    {
                        loadingScene.wallHealth -= 10;
                    }
                    this.lastEventTime = now;
                }
            }

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
                    loadingScene.money += 10;
                    this.killed++;
                    golem.body.setVelocityX(0);
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

        this.textLvl.setText('Level: ' + loadingScene.level);
        this.textMon.setText('Money: ' + loadingScene.money);
        this.textHel.setText('Health: ' + loadingScene.wallHealth);

        if (loadingScene.wallHealth == 0 && loadingScene.lives == 0)
        {
            loadingScene.lives = 3;
            loadingScene.money = 0;
            loadingScene.level = 1;
            loadingScene.wallHealth = 100;
            if (this.ending)
            {
                this.ending = false;
                this.cameras.main.shake(500);
                this.cameras.main.on(Phaser.Cameras.Scene2D.Events.SHAKE_COMPLETE, () => 
                {
                    this.cameras.main.fadeOut(500);
                });
                this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () =>
                {
                    this.scene.start('home');
                });
            }
        }

        if (loadingScene.wallHealth == 0)
        {
            loadingScene.level--;
            loadingScene.lives--;
            loadingScene.succes = 2;
            if (this.ending)
            {
                this.ending = false;
                this.cameras.main.shake(500);
                this.cameras.main.on(Phaser.Cameras.Scene2D.Events.SHAKE_COMPLETE, () => 
                {
                    this.cameras.main.fadeOut(500);
                });
                this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () =>
                {
                    this.scene.start('shop');
                });
            }
        }

        if (this.killed == this.enemyNumber+1)
        {
            loadingScene.succes = 1;
            if (this.ending)
            {
                this.ending = false;
                this.cameras.main.fadeOut(500);
                this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () =>
                {
                    this.scene.start('shop');
                });
            }
        }
    }

    revolverShoot()
    {
        this.weapon = this.physics.add.sprite(614.5, 150.5, 'revolver');
        this.weapon.setOrigin(1, 1);
        this.ammos = this.add.group
        ({
            key: 'sbullet',
            repeat: 5,
            setXY:
            {
                x: 560,
                y: 340,
                stepX: 8,
            }
        });

        Phaser.Actions.ScaleXY(this.ammos.getChildren(), -0.6, -0.6);

        this.input.on('pointerdown', (pointer) => 
        {
            const currentTime = this.time.now;

            if (this.ammos.getChildren().length == 0)
            {
                this.lastCLickTime = currentTime;
                this.reloadIm = this.add.sprite(610, 110, 'load');
                this.reloadIm.setScale(0.05, 0.05);

                this.time.addEvent
                ({
                    delay: 10000,
                    callback: () =>
                    {
                        this.ammos = this.add.group
                        ({
                            key: 'sbullet',
                            repeat: 5,
                            setXY:
                            {
                                x: 560,
                                y: 340,
                                stepX: 8,
                            }
                        });
                        Phaser.Actions.ScaleXY(this.ammos.getChildren(), -0.6, -0.6);
                        this.reloadIm.destroy();
                    }
                });
            }

            if (currentTime - this.lastCLickTime >= 2000)
            {
                this.lastCLickTime = currentTime;

                this.shot = this.physics.add.sprite(610, 140, 'shot')
                this.vector = new Phaser.Math.Vector2(pointer.x - this.weapon.x, pointer.y - this.weapon.y);
                this.vector.setLength(this.speed);
                this.shots.add(this.shot);
                this.shot.rotation = this.target+Math.PI;
                this.shot.body.setVelocity(this.vector.x, this.vector.y);

                if (this.ammos.getChildren().length > 0) 
                {
                    const bullet = this.ammos.getFirstAlive();
                    bullet.destroy();
                }
            }
        });
    }

    pistolShoot()
    {
        this.weapon = this.physics.add.sprite(614.5, 150.5, 'pistol');
        this.weapon.setOrigin(1, 1);
        this.ammos = this.add.group
        ({
            key: 'sbullet',
            repeat: 7,
            setXY:
            {
                x: 580,
                y: 340,
                stepX: 8,
            }
        });

        Phaser.Actions.ScaleXY(this.ammos.getChildren(), -0.6, -0.6);

        this.input.on('pointerdown', (pointer) => 
        {
            const currentTime = this.time.now;

            if (this.ammos.getChildren().length == 0)
            {
                this.lastCLickTime = currentTime;
                this.reloadIm = this.add.sprite(610, 110, 'load');
                this.reloadIm.setScale(0.05, 0.05);

                this.time.addEvent
                ({
                    delay: 5000,
                    callback: () =>
                    {
                        this.ammos = this.add.group
                        ({
                            key: 'sbullet',
                            repeat: 7,
                            setXY:
                            {
                                x: 580,
                                y: 340,
                                stepX: 8,
                            }
                        });
                        Phaser.Actions.ScaleXY(this.ammos.getChildren(), -0.6, -0.6);
                        this.reloadIm.destroy();
                    }
                });
            }

            if (currentTime - this.lastCLickTime >= 1500)
            {
                this.lastCLickTime = currentTime;

                this.shot = this.physics.add.sprite(610, 140, 'shot')
                this.vector = new Phaser.Math.Vector2(pointer.x - this.weapon.x, pointer.y - this.weapon.y);
                this.vector.setLength(this.speed);
                this.shots.add(this.shot);
                this.shot.rotation = this.target+Math.PI;
                this.shot.body.setVelocity(this.vector.x, this.vector.y);

                if (this.ammos.getChildren().length > 0) 
                {
                    const bullet = this.ammos.getFirstAlive();
                    bullet.destroy();
                }
            }
        });
    }

    smgShoot()
    {
        this.weapon = this.physics.add.sprite(614.5, 150.5, 'smg');
        this.weapon.setOrigin(1, 1);
        this.ammos = this.add.group
        ({
            key: 'mbullet',
            repeat: 19,
            setXY:
            {
                x: 562,
                y: 340,
                stepX: 4,
            }
        });

        Phaser.Actions.ScaleXY(this.ammos.getChildren(), -0.7, -0.7);

        this.input.on('pointerdown', (pointer) => 
        {
            const currentTime = this.time.now;

            if (this.ammos.getChildren().length == 0)
            {
                this.lastCLickTime = currentTime;
                this.reloadIm = this.add.sprite(610, 110, 'load');
                this.reloadIm.setScale(0.05, 0.05);

                this.time.addEvent
                ({
                    delay: 3000,
                    callback: () =>
                    {
                        this.ammos = this.add.group
                        ({
                            key: 'mbullet',
                            repeat: 19,
                            setXY:
                            {
                                x: 562,
                                y: 340,
                                stepX: 4,
                            }
                        });
                        Phaser.Actions.ScaleXY(this.ammos.getChildren(), -0.7, -0.7);
                        this.reloadIm.destroy();
                    }
                });
            }

            if (currentTime - this.lastCLickTime >= 900)
            {
                this.lastCLickTime = currentTime;

                this.shot = this.physics.add.sprite(610, 140, 'shot')
                this.vector = new Phaser.Math.Vector2(pointer.x - this.weapon.x, pointer.y - this.weapon.y);
                this.vector.setLength(this.speed);
                this.shots.add(this.shot);
                this.shot.rotation = this.target+Math.PI;
                this.shot.body.setVelocity(this.vector.x, this.vector.y);

                if (this.ammos.getChildren().length > 0) 
                {
                    const bullet = this.ammos.getFirstAlive();
                    bullet.destroy();
                }
            }
        });
    }

    assaultShoot()
    {
        this.weapon = this.physics.add.sprite(614.5, 150.5, 'assault');
        this.weapon.setOrigin(1, 1);
        this.ammos = this.add.group
        ({
            key: 'lbullet',
            repeat: 29,
            setXY:
            {
                x: 525,
                y: 340,
                stepX: 4,
            }
        });

        Phaser.Actions.ScaleXY(this.ammos.getChildren(), -0.8, -0.8);

        this.input.on('pointerdown', (pointer) => 
        {
            const currentTime = this.time.now;

            if (this.ammos.getChildren().length == 0)
            {
                this.lastCLickTime = currentTime;
                this.reloadIm = this.add.sprite(610, 110, 'load');
                this.reloadIm.setScale(0.05, 0.05);

                this.time.addEvent
                ({
                    delay: 1500,
                    callback: () =>
                    {
                        this.ammos = this.add.group
                        ({
                            key: 'lbullet',
                            repeat: 29,
                            setXY:
                            {
                                x: 560,
                                y: 340,
                                stepX: 4,
                            }
                        });
                        Phaser.Actions.ScaleXY(this.ammos.getChildren(), -0.8, -0.8);
                        this.reloadIm.destroy();
                    }
                });
            }

            if (currentTime - this.lastCLickTime >= 450)
            {
                this.lastCLickTime = currentTime;
                                        this.reloadIm.destroy();

                this.shot = this.physics.add.sprite(610, 140, 'shot')
                this.vector = new Phaser.Math.Vector2(pointer.x - this.weapon.x, pointer.y - this.weapon.y);
                this.vector.setLength(this.speed);
                this.shots.add(this.shot);
                this.shot.rotation = this.target+Math.PI;
                this.shot.body.setVelocity(this.vector.x, this.vector.y);

                if (this.ammos.getChildren().length > 0) 
                {
                    const bullet = this.ammos.getFirstAlive();
                    bullet.destroy();
                }
            }
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
