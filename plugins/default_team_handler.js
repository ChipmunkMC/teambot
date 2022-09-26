function inject (bot, options) {
  const inclusiveTeam = options.inclusiveTeam ?? '000a'
  const inclusiveTeamColor = options.inclusiveTeamColor ?? `gray`
  const exclusiveTeam = options.exclusiveTeam ?? '0000'
  const exclusivePrefixColor = options.exclusivePrefixColor ?? `gold`
  const exclusiveTeamPrefix = options.exclusiveTeamPrefix ?? ``
  const exclusiveTeamColor = options.exclusiveTeamColor ?? `red`
  const exclusiveTeamSuffix = options.exclusiveTeamSuffix ?? `\u00a78[\u00a75\u00a7oLVFT\u00a78]`

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
        if (options.exclusiveTeamPrefix){bot.core.run(`team modify ${exclusiveTeam} prefix {"text":"${exclusiveTeamPrefix} ","color":"${exclusivePrefixColor}"}`)};
        bot.core.run(`team modify ${exclusiveTeam} color ${exclusiveTeamColor}`);
        if (options.exclusiveTeamSuffix){bot.core.run(`team modify ${exclusiveTeam} suffix {"text":" ${exclusiveTeamSuffix}"}`)}
    }

    bot.core.run(`team join ${inclusiveTeam} @a[team=]`)
  })
}

module.exports = inject
