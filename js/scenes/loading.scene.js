/// <reference path="../types/index.d.ts" />

class LoadingScene extends Phaser.Scene
{
    constructor(title)
    {
        super(title);
    }

    init()
    {
        this.weaponType = 1;
        this.lives = 0;
        this.money = 0;
        this.level = 1;
        this.wallHealth = 100;
        this.succes = 0
        this.maxHealth = 100;
    }

    preload()
    {
        this.load.image('background', 'assets/background3.png');
        this.load.image('shopbg', 'assets/background4.png');
        this.load.image('lamp', 'assets/lamp.png');
        this.load.image('bench', 'assets/bench.png');
        this.load.image('bush', 'assets/bush.png');
        this.load.image('house1', 'assets/house1.png');
        this.load.image('house2', 'assets/house2.png');
        this.load.image('house3', 'assets/house3.png');
        this.load.image('ladder', 'assets/ladder.png');
        this.load.image('wall', 'assets/wall.png');
        this.load.image('load', 'assets/reload.png');
        this.load.image('hun', 'assets/hunflag.png');
        this.load.image('eng', 'assets/engflag.png');
        this.load.image('back', 'assets/backbutton.png');
        this.load.image('heart', 'assets/heart.png');
        this.load.image('imgHel', 'assets/medic.png');
        this.load.image('imgUp', 'assets/upgrade.png');

        this.load.image('player', 'assets/player.png');
        this.load.image('revolver', 'assets/guns/revolverarm.png');
        this.load.image('pistol', 'assets/guns/pistolarm.png');
        this.load.image('smg', 'assets/guns/smgarm.png');
        this.load.image('assault', 'assets/guns/assaultarm.png');
        this.load.image('pshop', 'assets/guns/pistol.png');
        this.load.image('sshop', 'assets/guns/smg.png');
        this.load.image('ashop', 'assets/guns/assault.png');

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

        this.selectedItem = null;

        const bg = this.add.rectangle
        (
            0, 0, 
            this.sys.game.config.width, 
            this.sys.game.config.height,
            0xffffff
        );
        bg.setOrigin(0, 0);

        const bgBar = this.add.rectangle
        (
            0, 0,
            200, 40, 
            0x000000,
            0.1
        );
        Phaser.Display.Align.In.Center(bgBar, bg);

        const progressBar = this.add.rectangle
        (
            0, 0, 0.4*200, 40, 0x115522
        );
        Phaser.Display.Align.In.TopLeft(progressBar, bgBar);

        this.load.on('progress', (percentage) =>
        {
            progressBar.setSize(percentage * 200, progressBar.height);
            Phaser.Display.Align.In.TopLeft(progressBar, bgBar);
        });
    }

    create()
    {
        this.scene.start('home');
    }
}