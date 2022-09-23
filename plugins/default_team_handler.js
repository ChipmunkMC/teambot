function inject (bot, options) {
  const inclusiveTeam = options.inclusiveTeam ?? '000a'
  const exclusiveTeam = options.exclusiveTeam ?? '0000'

  bot.on('tick', () => {
    if (!bot.uuid) return

    let hasInclusive = false
    let hasExclusive = false
    for (const team of bot.teams) {
      if (team.name === inclusiveTeam) hasInclusive = true
      if (team.name === exclusiveTeam) hasExclusive = true
    }

    if (!hasInclusive) bot.core.run(`team add ${inclusiveTeam}`)
    if (!hasExclusive) bot.core.run(`team add ${exclusiveTeam}`)

    bot.core.run(`team join ${inclusiveTeam} @a[team=]`)
  })
}

module.exports = inject
