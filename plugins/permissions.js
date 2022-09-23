const gamemodes = require('../gamemodes.json')

function inject (bot) {
  bot.on('login', packet => {
    bot.permissionLevel = 0
    bot.gamemode = gamemodes[packet.gameMode]
  })

  bot._client.on('entity_status', packet => {
    if (packet.entityId !== bot.entityId || packet.entityStatus < 24 || packet.entityStatus > 28) return
    bot.permissionLevel = packet.entityStatus - 24
  })

  bot._client.on('game_state_change', packet => {
    if (packet.reason === 3) bot.gamemode = gamemodes[packet.gameMode]
  })
}

module.exports = inject
