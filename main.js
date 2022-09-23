const createBot = require('./bot.js')
const fs = require('node:fs/promises')
const path = require('node:path')

async function main () {
  const absolutePath = path.resolve('config')
  let optionsArray

  try {
    optionsArray = require(absolutePath)
  } catch {
    await fs.copyFile(path.join(__dirname, 'default.js'), 'config.js')
    console.info('No config file was found, so a default one was created.')

    optionsArray = require(absolutePath)
  }

  optionsArray.forEach((options, index) => {
    const bot = createBot(options)

    bot.on('connect', () => console.info(`Bot ${index} connected to ${options.host}`))
    bot.on('login', () => console.info(`Bot ${index} logged in`))
    bot.on('end', () => console.info(`Bot ${index} ended`))
  })
}

main()
