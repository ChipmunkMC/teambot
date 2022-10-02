function inject (bot, options) {
  const inclusiveTeam = options.inclusiveTeam
  const exclusiveTeam = options.exclusiveTeam

  inclusiveTeam.name ??= '000a'
  exclusiveTeam.name ??= '0000'

  function updateTeamFromObject (object, otherObject) {
    bot.core.run(`team modify ${object.name} displayName ${JSON.stringify(object.displayName ?? object.name)}`)
    bot.core.run(`team modify ${object.name} friendlyFire ${Boolean(object.friendlyFire ?? true)}`)
    bot.core.run(`team modify ${object.name} seeFriendlyInvisibles ${Boolean(object.seeFriendlyInvisibles ?? true)}`)
    bot.core.run(`team modify ${object.name} collisionRule ${object.collisionRule ?? 'always'}`)
    bot.core.run(`team modify ${object.name} color ${object.color ?? 'reset'}`)
    bot.core.run(`team modify ${object.name} prefix ${JSON.stringify(object.prefix ?? { text: '' })}`)
    bot.core.run(`team modify ${object.name} suffix ${JSON.stringify(object.suffix ?? { text: '' })}`)
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

    if (!hasInclusive) {
      bot.core.run(`team add ${inclusiveTeam.name}`)

      updateTeamFromObject(inclusiveTeam)
    }

    if (!hasExclusive) {
      bot.core.run(`team add ${exclusiveTeam.name}`)

      updateTeamFromObject(exclusiveTeam)
    }

    bot.core.run(`team join ${inclusiveTeam.name} @a[team=!${inclusiveTeam.name},team=!${exclusiveTeam.name}]`)
  })
}

module.exports = inject
