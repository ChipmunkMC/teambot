function inject (bot, options) {
  setInterval(() => bot.emit('self_care_tick'), options.selfCareInterval ?? 70)

  bot.on('self_care_tick', () => {
    if (!bot.uuid) return

    // TODO: Make it m o d u l a r
    if (bot.permissionLevel < 1) bot._intermediary.write('chat', { message: '/op @s[type=player]' })
    else if (bot.gamemode !== 'creative') bot._intermediary.write('chat', { message: '/gamemode creative' })
  })

  // Patch the end credits exploit
  bot._intermediary.on('game_state_change', packet => {
    if (packet.reason === 4) bot._intermediary.write('client_command', { payload: 0 })
  })
}

module.exports = inject
