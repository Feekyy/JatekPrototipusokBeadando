/// <reference path="../types/index.d.ts" />

class HomeScene extends Phaser.Scene
{
    constructor(title)
    {
        super(title);
    }

    init()
    {
        this.randomY = Phaser.Math.Between(100, 300);

        this.lang = 1;

        this.lastClicked = {x: 0, y: 0};
    }

    create()
    {
        this.enemies = this.add.group();
        this.alphagroup = this.add.group();

        const bg = this.add.sprite(0, 0, 'background');
        bg.setOrigin(0, 0);

        this.hun = this.add.sprite(0, 320, 'hun');
        this.hun.setOrigin(0, 0);
        this.hun.setDepth(2);
        this.hun.setScale(0.1, 0.1);
        this.hun.setAlpha(0.75);
        this.alphagroup.add(this.hun);

        this.eng = this.add.sprite(this.hun.x+60, 325, 'eng')
        this.eng.setOrigin(0, 0);
        this.eng.setDepth(2);
        this.eng.setScale(0.049, 0.049);
        this.eng.setAlpha(0.75);
        this.alphagroup.add(this.eng);

        this.text = this.add.text(320, 140, 'START GAME', 
        {
            font: '48px Arial'
        });
        this.text.setOrigin(0.5, 0.5);
        this.text.setDepth(2);

        this.textBg = this.add.rectangle(0, 0, this.text.width + 90, this.text.height + 20, 0x00000, 0.75)
        Phaser.Display.Align.In.Center(this.textBg, this.text);
        this.textBg.setDepth(1);
        this.alphagroup.add(this.textBg);

        this.text2 = this.add.text(320, 280, 'How to play?',
        {
            font: '32px Arial'
        });
        this.text2.setOrigin(0.5, 0.5);
        this.text2.setDepth(2);

        this.textBg2 = this.add.rectangle(0, 0, this.text2.width + 20, this.text2.height + 20, 0x00000, 0.75)
        Phaser.Display.Align.In.Center(this.textBg2, this.text2);
        this.textBg2.setDepth(1);
        this.alphagroup.add(this.textBg2);

        this.anims.create
        ({
            key: 'golemwalk',
            frames: this.anims.generateFrameNames('golem', { frames: [ 0, 1 ] }),
            yoyo: true,
            frameRate: 3,
            repeat: -1
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

        this.input.on('pointerdown', (pointer) => 
        {
            this.lastClicked = {x: pointer.x, y: pointer.y};

            if (this.eng.getBounds().contains(this.lastClicked.x, this.lastClicked.y)) 
            {
                this.lang = 1;
            }

            if (this.hun.getBounds().contains(this.lastClicked.x, this.lastClicked.y)) 
            {
                this.lang = 2;
            }

            if (this.textBg2.getBounds().contains(this.lastClicked.x, this.lastClicked.y))
            {
                this.cameras.main.fadeOut(500);
                this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () =>
                {
                    this.scene.start('htp');
                });
            }

            if (this.textBg.getBounds().contains(this.lastClicked.x, this.lastClicked.y))
            {
                this.cameras.main.fadeOut(500);
                this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () =>
                {
                    this.scene.start('game');
                });
            }
        });
    }

    update()
    {
        this.randomY = Phaser.Math.Between(140, 300);

        Phaser.Actions.Call(this.enemies.getChildren(), (golem) =>
        {
            golem.setDepth(0);

            if (!golem.anims.isPlaying)
            {
                golem.anims.play('golemwalk');
            }
            
            if (golem.x-40 == 640)
            {
                golem.destroy();
            }
        });

        Phaser.Actions.Call(this.alphagroup.getChildren(), (item) =>
        {
            if (item.getBounds().contains(this.input.x, this.input.y))
            {
                item.setAlpha(1);
            }
            else
            {
                item.setAlpha(0.75);
            }
        });

        if (this.lang == 2)
        {
            this.text.setText('JÁTÉK KEZDÉSE');
            this.text2.setText('Játék leírás');
        }

        if (this.lang == 1)
        {
            this.text.setText('START GAME');
            this.text2.setText('How to play?');
        } 
    }
}