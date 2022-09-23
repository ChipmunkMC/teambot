function inject (bot) {
  bot.on('packet', (data, meta) => {
    if (meta.name !== 'login') return
    bot.emit('login', data)
  })

  bot.on('login', data => {
    bot.username = bot._client.username
    bot.uuid = bot._client.uuid
    bot.entityId = data.entityId
  })

  bot.on('end', () => {
    bot.username = null
    bot.uuid = null
    bot.entityId = null
  })
}

module.exports = inject
