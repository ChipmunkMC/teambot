const mc = require('minecraft-protocol')
const { EventEmitter } = require('node:events')
const randomUsername = require('./username_generator.js')

const plugins = {
  login: require('./plugins/login.js'),
  reconnect: require('./plugins/reconnect.js'),
  position: require('./plugins/position.js'),
  permissions: require('./plugins/permissions.js'),
  core: require('./plugins/core.js'),
  team: require('./plugins/team.js'),
  selfCare: require('./plugins/self_care.js'),
  defaultTeamHandler: require('./plugins/default_team_handler.js')
}

function createBot (options = {}) {
  // Defaults
  options.host ??= 'localhost'
  options.port ??= 25565
  options.username ??= 'Player' + Math.floor(Math.random() * 1000)
  if (options.useRandomUsername) options.username = randomUsername()

  // EventEmitter
  const bot = new EventEmitter()

  // nmp
  bot._client = options.client ?? mc.createClient(options)
  bot._client.on('connect', () => bot.emit('connect'))
  bot._client.on('end', reason => bot.emit('end', reason))
  bot._client.on('error', error => bot.emit('error', error))
  bot._client.on('packet', (data, meta) => bot.emit('packet', data, meta))

  // Error handling
  bot.on('error', error => { if (!options.hideErrors) console.error(error) })

  setInterval(() => bot.emit('tick'), 50) // Tick

  bot.loadPlugin = plugin => { if (plugin) plugin(bot, options) }
  Object.values({ ...plugins, ...options.plugins }).forEach(bot.loadPlugin)

  return bot
}

module.exports = createBot
