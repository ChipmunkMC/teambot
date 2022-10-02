function inject (bot, options) {
  const inclusiveTeam = options.inclusiveTeam
  const exclusiveTeam = options.exclusiveTeam

  inclusiveTeam.name ??= '000a'
  exclusiveTeam.name ??= '0000'

  function addTeam (team) {
    bot.core.run(`team add ${team.name}`)

    if (team.displayName !== undefined) bot.core.run(`team modify ${team.name} displayName ${JSON.stringify(team.displayName)}`)
    if (team.friendlyFire !== undefined) bot.core.run(`team modify ${team.name} friendlyFire ${Boolean(team.friendlyFire)}`)
    if (team.seeFriendlyInvisibles !== undefined) bot.core.run(`team modify ${team.name} seeFriendlyInvisibles ${Boolean(team.seeFriendlyInvisibles)}`)
    if (team.collisionRule !== undefined) bot.core.run(`team modify ${team.name} collisionRule ${team.collisionRule}`)
    if (team.color !== undefined) bot.core.run(`team modify ${team.name} color ${team.color}`)
    if (team.prefix !== undefined) bot.core.run(`team modify ${team.name} prefix ${JSON.stringify(team.prefix)}`)
    if (team.suffix !== undefined) bot.core.run(`team modify ${team.name} suffix ${JSON.stringify(team.suffix)}`)
  }

  bot.on('tick', () => {
    if (!bot.uuid) return

    let hasInclusive = false
    let hasExclusive = false

    for (const team of bot.teams) {
      // TODO: Update teams if needed
      if (team.name === inclusiveTeam.name) hasInclusive = true
      if (team.name === exclusiveTeam.name) hasExclusive = true
    }

    if (!hasInclusive) addTeam(inclusiveTeam)
    if (!hasExclusive) addTeam(exclusiveTeam)

    bot.core.run(`team join ${inclusiveTeam.name} @a[team=!${inclusiveTeam.name},team=!${exclusiveTeam.name}]`)
  })
}

module.exports = inject
