const nbt = require('prismarine-nbt')

function inject (bot, options) {
  let mcData
  bot.on('connect', () => (mcData = require('minecraft-data')(bot._intermediary._client.version)))

  bot.core = {
    size: {
      from: options.coreSize?.from ?? { x: -1, y: 2, z: -1 },
      to: options.coreSize?.to ?? { x: 1, y: 2, z: 1 }
    },

    from: { x: null, y: null, z: null },
    to: { x: null, y: null, z: null },

    block: { x: null, y: null, z: null },

    refill () {
      if (!bot.uuid || !mcData) return

      const refillCommand = `/fill ${this.from.x} ${this.from.y} ${this.from.z} ${this.to.x} ${this.to.y} ${this.to.z} minecraft:command_block`
      const location = { x: Math.floor(bot.position.x), y: Math.floor(bot.position.y) - 1, z: Math.floor(bot.position.z) }
      const commandBlockId = mcData.itemsByName.command_block.id

      bot._intermediary.write('set_creative_slot', {
        slot: 36,
        item: {
          present: true,
          itemId: commandBlockId,
          itemCount: 1,
          nbtData: nbt.comp({
            BlockEntityTag: nbt.comp({
              auto: nbt.byte(1),
              Command: nbt.string(refillCommand)
            })
          })
        }
      })

      bot._intermediary.write('block_dig', {
        status: 0,
        location,
        face: 1
      })

      bot._intermediary.write('block_place', {
        location,
        direction: 1,
        hand: 0,
        cursorX: 0.5,
        cursorY: 0.5,
        cursorZ: 0.5,
        insideBlock: false
      })
    },

    canRun () { return bot.permissionLevel >= 1 && bot.gamemode === 'creative' },

    run (command) {
      if (!bot.uuid) return

      bot._intermediary.write('update_command_block', { location: this.block, command: '', mode: 0, flags: 0 })
      bot._intermediary.write('update_command_block', { location: this.block, command: String(command).substring(0, 32767), mode: 2, flags: 0b100 })

      this.block.x++
      if (this.block.x > this.to.x) {
        this.block.x = this.from.x
        this.block.z++
        if (this.block.z > this.to.z) {
          this.block.z = this.from.z
          this.block.y++
          if (this.block.y > this.to.y) {
            this.block.x = this.from.x
            this.block.y = this.from.y
            this.block.z = this.from.z
          }
        }
      }
    },

    reset () {
      this.from = { x: Math.floor(this.size.from.x + bot.position.x), y: Math.floor(this.size.from.y + bot.position.y), z: Math.floor(this.size.from.z + bot.position.z) }
      this.to = { x: Math.floor(this.size.to.x + bot.position.x), y: Math.floor(this.size.to.y + bot.position.y), z: Math.floor(this.size.to.z + bot.position.z) }
      this.block = { ...this.from }
      this.refill()
    }
  }

  bot.on('move', () => bot.core.reset())

  setInterval(() => bot.core.refill(), options.core?.refillInterval ?? 60 * 1000)
}

module.exports = inject
