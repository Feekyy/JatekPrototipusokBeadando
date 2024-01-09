/// <reference path="../types/index.d.ts" />

class HtpScene extends Phaser.Scene
{
    constructor(title)
    {
        super(title);
    }

    create()
    {
        this.back = this.add.sprite(5, 320, 'back');
        this.back.setOrigin(0, 0);
        this.back.setAlpha(0.75);
        this.back.setScale(0.1, 0.1);
        this.back.setDepth(2);

        const bg = this.add.sprite(0, 0, 'background');
        bg.setOrigin(0, 0);

        const textBg = this.add.rectangle(0, 0, 420, 250, 0x00000, 0.75)
        Phaser.Display.Align.In.Center(textBg, bg);

        if (homeScene.lang == 1)
        {
            const text = this.add.text(165, 60, 'The terrible golems are taking over the city!\n\n\nYou are the last stand between the humans and the monsters!\n\n\nShot them from behind your barricade, but be aware,\n your barricade is destroyable!\n\n\nBetween the levels, you will be able to resupply yourself\n and upgrade your weapons and barricade!\n\n\nGood luck and have fun!',
            {
                font: '13px Arial'
            });
        }
        else
        {
            const text = this.add.text(165, 60, 'A szörnyű gólemek lerobolják a várost!\n\n\nTe vagy az utolsó reménye az embereknek!\n\n\nA barikádod mögül le tudod lőni őket,\n de vigyáz a barikádodra!\n\n\nA szintek között majd fel tudsz szerelkezni,\n és fejleszteni tudod majd a fegyveredet, és a barikádot is!\n\n\nJó játékot, és sok sikert!',
            {
                font: '13px Arial'
            });
        }

        this.input.on('pointerdown', (pointer) => 
        {
            if (this.back.getBounds().contains(pointer.x, pointer.y))
            {
                this.cameras.main.fadeOut(500);
                this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () =>
                {
                    this.scene.start('home');
                });
            }
        });
    }

    update()
    {
        if (this.back.getBounds().contains(this.input.x, this.input.y))
            {
                this.back.setAlpha(1);
            }
            else
            {
                this.back.setAlpha(0.75);
            }
    }
}