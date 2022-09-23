function inject (bot) {
  bot.position = { x: null, y: null, z: null }

  bot._client.on('position', ({ x, y, z, flags, teleportId }) => {
    // TODO: Don't ignore yaw, pitch

    bot.position.x = flags & 1 ? (bot.position.x + x) : x
    bot.position.y = flags & 2 ? (bot.position.y + y) : y
    bot.position.z = flags & 4 ? (bot.position.z + z) : z

    bot._client.write('teleport_confirm', { teleportId })

    bot.emit('move')
  })
}

module.exports = inject
