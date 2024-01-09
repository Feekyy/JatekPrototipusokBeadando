/// <reference path="../types/index.d.ts" />

class ShopScene extends Phaser.Scene
{
    constructor(title)
    {
        super(title);
    }

    init()
    {
        this.weaponCost;
        this.helCost = (loadingScene.maxHealth-loadingScene.wallHealth)*2;
        this.click1 = false;
        this.click2 = false;
        this.click3 = false;
    }

    create()
    {
        this.alphagroup = this.add.group();

        if (loadingScene.wallHealth == 0)
        {
            loadingScene.wallHealth = loadingScene.maxHealth/2;
        }

        const bg = this.add.sprite(0, 0, 'shopbg');
        bg.setOrigin(0, 0);

        if (loadingScene.succes == 1)
        {
            const textSuc = this.add.text(0, 0, 'Succesfull defend!', 
            {
                font: '30px Arial',
                color: 'green'
            });
        }
        else
        {
            const textSuc = this.add.text(0, 0, 'You have failed!', 
            {
                font: '30px Arial',
                color: 'red'
            });
        }

        const textHel = this.add.text(80, 180, 'Reapair barricade', 
        {
            font: '13px Arial',
            color: 'aqua'
        }); 
        this.imageHel = this.add.sprite(0, 0, 'imgHel');
        this.imageHel.setScale(0.1, 0.1);
        Phaser.Display.Align.In.Center(this.imageHel, textHel);
        this.imageHel.y += 40;
        this.alphagroup.add(this.imageHel);
        this.textCurHel = this.add.text(0, 0, 'Current healthpoints: ' + loadingScene.wallHealth, 
        {
            font: '13px Arial',
            color: 'aqua'
        });
        Phaser.Display.Align.In.Center(this.textCurHel, textHel);
        this.textCurHel.y += 80;
        this.textCostHel = this.add.text(0, 0, 'Cost of the full repair: ' + this.helCost,
        {
            font: '13px Arial',
            color: 'aqua'
        });
        Phaser.Display.Align.In.Center(this.textCostHel, textHel);
        this.textCostHel.y += 100;

        const textUp = this.add.text(280, 170, 'Upgrade your barricade\n       (+50hp/lvl)', 
        {
            font: '13px Arial',
            color: 'aqua'
        }); 
        this.imageUp = this.add.sprite(0, 0, 'imgUp');
        this.imageUp.setScale(0.22, 0.22);
        Phaser.Display.Align.In.Center(this.imageUp, textUp);
        this.imageUp.y += 50;
        this.alphagroup.add(this.imageUp);
        this.textMaxHel = this.add.text(0, 0, 'Current maximal healthpoints: ' + loadingScene.maxHealth,
        {
            font: '13px Arial',
            color: 'aqua'
        });
        Phaser.Display.Align.In.Center(this.textMaxHel, textUp);
        this.textMaxHel.y += 90;
        const textUpCost = this.add.text(0, 0, 'Cost of the upgrade: 100',
        {
            font: '13px Arial',
            color: 'aqua'
        });
        Phaser.Display.Align.In.Center(textUpCost, textUp);
        textUpCost.y += 110;

        const textWea = this.add.text(480, 170, 'Upgrade your weapon\n        Next weapon:', 
        {
            font: '13px Arial',
            color: 'aqua'
        }); 
        switch (loadingScene.weaponType)
        {
            case 1:
                this.imagePis = this.add.sprite(0, 0, 'pshop');
                this.imagePis.setScale(0.65, 0.65);
                Phaser.Display.Align.In.Center(this.imagePis, textWea);
                this.imagePis.y += 50;
                this.alphagroup.add(this.imagePis);
                this.weaponCost = 100;
                this.textWeaCost = this.add.text(0, 0, 'Cost: ' + this.weaponCost, 
                {
                    font: '13px Arial',
                    color: 'aqua'
                });
                Phaser.Display.Align.In.Center(this.textWeaCost, textWea);
                this.textWeaCost.y += 90;
                this.click1 = false;
                this.click2 = true;
                this.click3 = true;
                break;
            case 2:
                this.imageSmg = this.add.sprite(0, 0, 'sshop');
                this.imageSmg.setScale(0.4, 0.4);
                Phaser.Display.Align.In.Center(this.imageSmg, textWea);
                this.imageSmg.y += 50;
                this.alphagroup.add(this.imageSmg);
                this.weaponCost = 300;
                this.textWeaCost = this.add.text(0, 0, 'Cost: ' + this.weaponCost, 
                {
                    font: '13px Arial',
                    color: 'aqua'
                });
                Phaser.Display.Align.In.Center(this.textWeaCost, textWea);
                this.textWeaCost.y += 90;
                this.click1 = true;
                this.click2 = false;
                this.click3 = true;
                break;
            case 3:
                this.imageAss = this.add.sprite(0, 0, 'ashop');
                this.imageAss.setScale(0.4, 0.4);
                Phaser.Display.Align.In.Center(this.imageAss, textWea);
                this.imageAss.y += 50;
                this.alphagroup.add(this.imageAss);
                this.weaponCost = 1000;
                this.textWeaCost = this.add.text(0, 0, 'Cost: ' + this.weaponCost, 
                {
                    font: '13px Arial',
                    color: 'aqua'
                });
                Phaser.Display.Align.In.Center(this.textWeaCost, textWea);
                this.textWeaCost.y += 90;
                this.click1 = true;
                this.click2 = true;
                this.click3 = false;
                break;
            case 4:
                this.textWeaCost = this.add.text(0, 0, 'You have the best weapon!', 
                {
                    font: '13px Arial',
                    color: 'aqua'
                });
                Phaser.Display.Align.In.Center(this.textWeaCost, textWea);
                this.textWeaCost.y += 50;
                this.click1 = true;
                this.click2 = true;
                this.click3 = true;
                break;
        }

        const textNext = this.add.text(490, 310, 'NEXT', 
        {
            font: '30px Arial',
            color: 'aqua'
        });
        textNext.setDepth(2);

        this.textBg = this.add.rectangle(0, 0, textNext.width + 90, textNext.height + 20, 0x00000, 0.75)
        Phaser.Display.Align.In.Center(this.textBg, textNext);
        this.alphagroup.add(this.textBg);
        textNext.setDepth(1);

        const textMenu = this.add.text(100, 310, 'MENU', 
        {
            font: '30px Arial',
            color: 'aqua'
        });
        textMenu.setDepth(2);

        this.textBg2 = this.add.rectangle(0, 0, textMenu.width + 90, textMenu.height + 20, 0x00000, 0.75)
        Phaser.Display.Align.In.Center(this.textBg2, textMenu);
        this.alphagroup.add(this.textBg2);
        textNext.setDepth(1);

        this.textMon = this.add.text(500, 0, 'Money: ' + loadingScene.money, 
        {
            font: '15px Arial',
            color: 'aqua'
        });

        this.input.on('pointerdown', (pointer) => 
        {
            if (this.textBg2.getBounds().contains(pointer.x, pointer.y))
            {
                loadingScene.level = 1;
                loadingScene.money = 0;
                loadingScene.lives = 3;
                loadingScene.wallHealth = 100;
                this.cameras.main.fadeOut(500);
                this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () =>
                {
                    this.scene.start('home');
                });
            }

            if (this.textBg.getBounds().contains(pointer.x, pointer.y))
            {
                loadingScene.level++;
                this.cameras.main.fadeOut(500);
                this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () =>
                {
                    this.scene.start('game');
                });
            }

            if (this.imageHel.getBounds().contains(pointer.x, pointer.y)) 
            {
                if (loadingScene.money >= this.helCost)
                {
                    loadingScene.wallHealth = loadingScene.maxHealth;
                    loadingScene.money -= this.helCost;
                }
            }

            if (this.imageUp.getBounds().contains(pointer.x, pointer.y)) 
            {
                if (loadingScene.money >= 100)
                {
                    loadingScene.wallHealth += 50;
                    loadingScene.maxHealth += 50;
                    loadingScene.money -= 100;
                }
            }

            if (!this.click1)
            {
                if (this.imagePis.getBounds().contains(pointer.x, pointer.y)) 
                {
                    if (loadingScene.money >= this.weaponCost)
                    {
                        this.click1 = true;
                        this.click2 = true;
                        this.click3 = true;
                        console.log('checkpoint 0');
                        this.imageSmg = this.add.sprite(0, 0, 'sshop');
                        this.imageSmg.setScale(0.4, 0.4);
                        Phaser.Display.Align.In.Center(this.imageSmg, textWea);
                        this.imageSmg.y += 50;
                        this.alphagroup.add(this.imageSmg);
                        loadingScene.money -= this.weaponCost;
                        this.weaponCost = 300;
                        this.textWeaCost.setText('Cost: ' + this.weaponCost);

                        loadingScene.weaponType = 2;

                        this.imagePis.destroy();
                        this.alphagroup.remove(this.imagePis)

                        this.time.delayedCall(3000, () => 
                            {
                                this.click1 = true;
                                this.click2 = false;
                                this.click3 = true;
                            }, 
                            null, 
                            this
                        );
                    }
                }
            }

            if (!this.click2)
            {
                if (this.imageSmg.getBounds().contains(pointer.x, pointer.y)) 
                {
                    if (loadingScene.money >= this.weaponCost)
                    {
                        this.click1 = true;
                        this.click2 = true;
                        this.click3 = true;
                        this.imageAss = this.add.sprite(0, 0, 'ashop');
                        this.imageAss.setScale(0.4, 0.4);
                        Phaser.Display.Align.In.Center(this.imageAss, textWea);
                        this.imageAss.y += 50;
                        this.alphagroup.add(this.imageAss);
                        loadingScene.money -= this.weaponCost;
                        this.weaponCost = 1000;
                        this.textWeaCost.setText('Cost: ' + this.weaponCost);

                        loadingScene.weaponType = 3;

                        this.imageSmg.destroy();
                        this.alphagroup.remove(this.imageSmg)

                        this.time.delayedCall(3000, () => 
                            {
                                this.click1 = true;
                                this.click2 = true;
                                this.click3 = false;
                            }, 
                            null, 
                            this
                        );
                    } 
                }
            }

            if (!this.click3)
            {
                if (this.imageAss.getBounds().contains(pointer.x, pointer.y)) 
                {   
                    if (loadingScene.money >= this.weaponCost)
                    {
                        this.click1 = true;
                        this.click2 = true;
                        this.click3 = true;
                        this.textWeaCost.setText('You have the best weapon!');
                        Phaser.Display.Align.In.Center(this.textWeaCost, textWea);
                        this.textWeaCost.y += 50;

                        loadingScene.weaponType = 4;
                        loadingScene.money -= this.weaponCost;

                        this.imageAss.destroy();
                        this.alphagroup.remove(this.imageAss);
                    } 
                }
            }
        });
    }

    update()
    {
        this.helCost = (loadingScene.maxHealth-loadingScene.wallHealth)*2;

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

        this.textMon.setText('Money: ' + loadingScene.money);
        this.textCurHel.setText('Current healthpoints: ' + loadingScene.wallHealth);
        this.textCostHel.setText('Cost of the full repair: ' + this.helCost);
        this.textMaxHel.setText('Current maximal healthpoints: ' + loadingScene.maxHealth);
    }
}