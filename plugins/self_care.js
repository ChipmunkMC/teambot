function inject (bot, options) {
  setInterval(() => bot.emit('self_care_tick'), options.selfCareInterval ?? 70)

  bot.on('self_care_tick', () => {
    if (!bot.uuid) return

    // TODO: Make it m o d u l a r
    if (bot.permissionLevel < 1) bot._client.write('chat', { message: '/op @s[type=player]' })
    else if (bot.gamemode !== 'creative') bot._client.write('chat', { message: '/gamemode creative' })
  })
}

module.exports = inject
