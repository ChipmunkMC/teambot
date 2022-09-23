const formatting = [
  'black',
  'dark_blue',
  'dark_green',
  'dark_aqua',
  'dark_red',
  'dark_purple',
  'gold',
  'gray',
  'dark_gray',
  'blue',
  'green',
  'aqua',
  'red',
  'light_purple',
  'yellow',
  'white',
  'obfuscated',
  'bold',
  'strikethrough',
  'underlined',
  'italic',
  'reset'
]

// TODO: Put this in a seperate module
function parseJSONSafely (message) {
  try {
    return JSON.parse(message)
  } catch {
    return { text: '** Invalid JSON Component **', color: 'red' }
  }
}

class Team {
  constructor (teamData = {}) {
    this.update(teamData)
    this.players = teamData.players
  }

  update (teamData) {
    this.name = teamData.team
    this.displayName = parseJSONSafely(teamData.name)
    this.friendlyFire = Boolean(teamData.friendlyFire & 1)
    this.seeFriendlyInvisibles = Boolean(teamData.friendlyFire & 2)
    this.nameTagVisibility = teamData.nameTagVisibility
    this.collisionRule = teamData.collisionRule
    this.color = formatting[teamData.formatting]
    this.prefix = parseJSONSafely(teamData.prefix)
    this.suffix = parseJSONSafely(teamData.suffix)
  }

  getFormatting () {
    const _formatting = {}
    if (formatting.indexOf(this.color) < 16) _formatting.color = this.color
    else if (this.color !== 'reset') _formatting[this.color] = true

    return _formatting
  }
}

function inject (bot) {
  bot.on('login', () => {
    bot.teams = []
  })

  const _handlers = {
    0 (teamData) { // Add team
      const team = new Team(teamData)
      bot.teams.push(team)

      bot.emit('team_added', team)
    },

    1 (teamData) { // Remove team
      const team = bot.teams.find(team => team.name === teamData.team)
      if (team === undefined) return

      bot.teams = bot.teams.filter(team => team.name !== teamData.team)

      bot.emit('team_removed', team)
    },

    2 (teamData) { // Update team
      const team = bot.teams.find(team => team.name === teamData.team)
      if (team === undefined) return

      team.update(teamData)

      bot.emit('team_updated', team)
    },

    3 (teamData) { // Add players
      const team = bot.teams.find(team => team.name === teamData.team)
      if (team === undefined) return

      team.players = [...team.players, ...teamData.players]

      bot.emit('team_players_added', team, teamData.players)
    },

    4 (teamData) { // Remove players
      const team = bot.teams.find(team => team.name === teamData.team)
      if (team === undefined) return

      team.players = team.players.filter(identifier => !teamData.players.includes(identifier))

      bot.emit('team_players_removed', team, teamData.players)
    }
  }

  bot._intermediary.on('teams', teamData => _handlers[teamData.mode](teamData))
}

module.exports = inject
