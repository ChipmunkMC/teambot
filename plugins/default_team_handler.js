function inject (bot, options) {
  const inclusiveTeam = options.inclusiveTeam ?? '000a'
  const inclusiveTeamColor = options.inclusiveTeamColor ?? `gray`
  const exclusiveTeam = options.exclusiveTeam ?? '0000'
  const exclusivePrefixColor = options.exclusivePrefixColor ?? `gold`
  const exclusiveTeamColor = options.exclusiveTeamColor ?? `red`

  bot.on('tick', () => {
    if (!bot.uuid) return

    let hasInclusive = false
    let hasExclusive = false
    for (const team of bot.teams) {
      if (team.name === inclusiveTeam) hasInclusive = true
      if (team.name === exclusiveTeam) hasExclusive = true
    }

    if (!hasInclusive) {
       bot.core.run(`team add ${inclusiveTeam}`);
       bot.core.run(`team modify ${inclusiveTeam} color ${inclusiveTeamColor}`)
    }
    if (!hasExclusive) {
        bot.core.run(`team add ${exclusiveTeam}`);
        bot.core.run(`team modify ${exclusiveTeam} prefix {"text":"luftwaffe ","color":"${exclusivePrefixColor}"}`);
        bot.core.run(`team modify ${exclusiveTeam} color ${exclusiveTeamColor}`)
    }

    bot.core.run(`team join ${inclusiveTeam} @a[team=]`)
  })
}

module.exports = inject
