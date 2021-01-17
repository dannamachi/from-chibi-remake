import Phaser from '../lib/phaser_export.js'

export default class Game extends Phaser.Scene
{
    constructor()
    {
        super('game')
    }
    
    preload()
    {
        // bg
        this.load.image('background', 'assets/bg_layer1.png')
        // platform
        this.load.image('platform', 'assets/ground_grass.png')
        // rabbit
        this.load.image('bunny-stand', 'assets/bunny1_stand.png')
    }
    
    create()
    {
        // bg
        this.add.image(240, 320, 'background')
        // platforms
        const pfs = this.physics.add.staticGroup()
        
        for (let i=0; i<5; ++i)
        {
            const x = Phaser.Math.Between(80, 400)
            const y = 150 * i
            
            const pf = pfs.create(x, y, 'platform')
            pf.scale = 0.5
            
            const body = pf.body
            body.updateFromGameObject()
        }
        // rabbit
        this.physics.add.sprite(240, 320, 'bunny-stand').setScale(0.5)
    }
}