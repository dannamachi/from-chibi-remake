import Phaser from '../lib/phaser_export.js'

export default class Game extends Phaser.Scene
{
    // vars
    player
    platforms
    cursors
    
    constructor()
    {
        super('game')
    }
    
    preload()
    {
        // assets s
        // bg
        this.load.image('background', 'assets/bg_layer1.png')
        // platform
        this.load.image('platform', 'assets/ground_grass.png')
        // rabbit
        this.load.image('bunny-stand', 'assets/bunny1_stand.png')
        //e
        // input
        this.cursors = this.input.keyboard.createCursorKeys()
    }
    
    create()
    {
        // bg
        this.add.image(240, 320, 'background').setScrollFactor(1, 0)
        
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
        
        // camera s
        this.cameras.main.startFollow(this.player)
        this.cameras.main.setDeadzone(this.scale.width * 1.5)
        // e
        // collision s
        this.physics.add.collider(this.platforms, this.player)
        this.player.body.checkCollision.up = false
        this.player.body.checkCollision.left = false
        this.player.body.checkCollision.right = false
        // e
    }
    
    update()
    {
        // touchdown s
        const isDown = this.player.body.touching.down
        if (isDown)
            {
                this.player.setVelocityY(-300)
            }
        // e
        // infi platforms s
        this.platforms.children.iterate(child => {
            const pf = child
            
            const scrollY = this.cameras.main.scrollY
            if (pf.y >= scrollY + 700)
                {
                    pf.y = scrollY - Phaser.Math.Between(50, 100)
                    pf.body.updateFromGameObject()
                }
        })
        // e
        // input s
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
        // e
        // wrap
        this.horizontalWrap(this.player)
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
}