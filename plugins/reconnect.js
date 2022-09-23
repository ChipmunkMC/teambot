const mc = require('minecraft-protocol')
const randomUsername = require('../username_generator.js')

function inject (bot, options) {
  const reconnect = options.reconnect ?? true
  const reconnectDelay = options.reconnectDelay ?? 0

  function resetClient () {
    if (options.useRandomUsername) options.username = randomUsername()
    bot._intermediary.setClient(mc.createClient(options))
  }

  bot.on('end', () => {
    if (!reconnect) return
    setTimeout(resetClient, reconnectDelay)
  })
}

module.exports = inject
