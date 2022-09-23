function inject (bot) {
  bot._intermediary.on('login', packet => bot.emit('login', packet))

  bot.on('login', data => {
    bot.username = bot._intermediary._client.username
    bot.uuid = bot._intermediary._client.uuid
    bot.entityId = data.entityId
  })

  bot.on('end', () => {
    bot.username = null
    bot.uuid = null
    bot.entityId = null
  })
}

module.exports = inject
