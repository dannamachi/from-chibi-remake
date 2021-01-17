import Phaser from '../lib/phaser_export.js'
import Carrot from '../game/Carrot.js'

export default class Game extends Phaser.Scene
{
    // vars start
    player
    platforms
    cursors
    carrots
    carrotNo = 0
    cText
    // end
    
    constructor()
    {
        super('game')
    }
    
    preload()
    {
        // assets start
        this.load.image('background', 'assets/bg_layer1.png')
        this.load.image('platform', 'assets/ground_grass.png')
        this.load.image('bunny-stand', 'assets/bunny1_stand.png')
        this.load.image('carrot', 'assets/carrot.png')
        //end
        // input
        this.cursors = this.input.keyboard.createCursorKeys()
    }
    
    create()
    {
        // bg
        this.add.image(240, 320, 'background').setScrollFactor(1, 0)
        
        // start
        // platforms
        this.platforms = this.physics.add.staticGroup()
        for (let i=0; i<5; ++i)
            {
                const x = Phaser.Math.Between(80, 400)
                const y = 150 * i

                const pf = this.platforms.create(x, y, 'platform')
                pf.scale = 0.5

                const body = pf.body
                body.updateFromGameObject()
            }
        
        // rabbit
        this.player = this.physics.add.sprite(240, 320, 'bunny-stand').setScale(0.5)
        
        // carrots
        this.carrots = this.physics.add.group({
            classType: Carrot
        })
        //end
        
        const style = {
            color: '#000',
            fontSize: 24
        }
        this.cText = this.add.text(240, 10, 'Carrots: 0', style)
            .setScrollFactor(0)
            .setOrigin(0.5, 0)
        
        // camera start
        this.cameras.main.startFollow(this.player)
        this.cameras.main.setDeadzone(this.scale.width * 1.5)
        // end
        // collision start
        this.physics.add.collider(this.platforms, this.player)
        this.physics.add.collider(this.platforms, this.carrots)
        this.player.body.checkCollision.up = false
        this.player.body.checkCollision.left = false
        this.player.body.checkCollision.right = false
        // end
        // overlap for c collection start
        this.physics.add.overlap(
            this.player,
            this.carrots,
            this.handleCollectCarrot,
            undefined,
            this
        )
        // end
    }
    
    update()
    {
        // touchdown start
        const isDown = this.player.body.touching.down
        if (isDown)
            {
                this.player.setVelocityY(-300)
            }
        // end
        // infi platforms start
        this.platforms.children.iterate(child => {
            const pf = child
            
            const scrollY = this.cameras.main.scrollY
            if (pf.y >= scrollY + 700)
                {
                    pf.y = scrollY - Phaser.Math.Between(50, 100)
                    pf.body.updateFromGameObject()
                    
                    this.addCarrotAbove(pf)
                }
        })
        // end
        // input start
        if (this.cursors.left.isDown && !isDown)
            {
                this.player.setVelocityX(-200)
            }
        else if (this.cursors.right.isDown && !isDown)
            {
                this.player.setVelocityX(200)
            }
        else
            {
                this.player.setVelocityX(0)
            }
        // end
        // wrap
        this.horizontalWrap(this.player)
        // reuse carrot start
        const gameH = this.scale.height
        this.carrots.children.iterate(child => {
            const c = child
            if (c.y > gameH * 2)
                {
                    this.carrots.killAndHide(c)
                    this.physics.world.disableBody(c.body)
                }
        })
        // end
    }
    
    // add func
    horizontalWrap(sprite)
    {
        const halfW = sprite.displayWidth * 0.5
        const gameW = this.scale.width
        if (sprite.x < -halfW)
            {
                sprite.x = gameW + halfW
            }
        else if (sprite.x > gameW + halfW)
            {
                sprite.x = -halfW
            }
    }
    addCarrotAbove(sprite)
    {
        const y = sprite.y - sprite.displayHeight
        const c = this.carrots.get(sprite.x, y, 'carrot')
        
        // reuse
        c.setActive(true)
        c.setVisible(true)
        
        this.add.existing(c)
        c.body.setSize(c.width, c.height)
        
        // reuse2
        this.physics.world.enable(c)
        
        return c
    }
    handleCollectCarrot(player,carrot)
    {
        this.carrots.killAndHide(carrot)
        this.physics.world.disableBody(carrot.body)
        
        this.carrotNo++
        
        this.cText.text = `Carrots: ${this.carrotNo}`
    }
}