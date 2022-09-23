const mc = require('minecraft-protocol')
const randomUsername = require('../username_generator.js')

const _fard = [ // ignore this part please (or even better, this whole plugin)
  'function onConnect () {\n' +
    '    if (client.wait_connect) {\n' +
    "      client.on('connect_allowed', next)\n" +
    '    } else {\n' +
    '      next()\n' +
    '    }\n' +
    '\n' +
    '    function next () {\n' +
    '      let taggedHost = options.host\n' +
    '      if (client.tagHost) taggedHost += client.tagHost\n' +
    '      if (client.fakeHost) taggedHost = options.fakeHost\n' +
    '\n' +
    "      client.write('set_protocol', {\n" +
    '        protocolVersion: options.protocolVersion,\n' +
    '        serverHost: taggedHost,\n' +
    '        serverPort: options.port,\n' +
    '        nextState: 2\n' +
    '      })\n' +
    '      client.state = states.LOGIN\n' +
    "      client.write('login_start', {\n" +
    '        username: client.username,\n' +
    '        signature: client.profileKeys\n' +
    '          ? {\n' +
    '              timestamp: BigInt(client.profileKeys.expiresOn.getTime()), // should probably be called "expireTime"\n' +
    '              publicKey: client.profileKeys.publicDER,\n' +
    '              signature: client.profileKeys.signature\n' +
    '            }\n' +
    '          : null\n' +
    '      })\n' +
    '    }\n' +
    '  }',
  'function onKeepAlive (packet) {\n' +
    '    if (timeout) { clearTimeout(timeout) }\n' +
    '    timeout = setTimeout(() => {\n' +
    "      client.emit('error', new Error(`client timed out after ${checkTimeoutInterval} milliseconds`))\n" + // eslint-disable-line no-template-curly-in-string
    "      client.end('keepAliveError')\n" +
    '    }, checkTimeoutInterval)\n' +
    "    client.write('keep_alive', {\n" +
    '      keepAliveId: packet.keepAliveId\n' +
    '    })\n' +
    '  }',
  '() => clearTimeout(timeout)',
  'function () { [native code] }',
  'function () { [native code] }',
  'function () { [native code] }',
  'function onCompressionRequest (packet) {\n' +
    '    client.compressionThreshold = packet.threshold\n' +
    '  }',
  'function onCustomPayload (packet) {\n' +
    '    const channel = channels.find(function (channel) {\n' +
    '      return channel === packet.channel\n' +
    '    })\n' +
    '    if (channel) {\n' +
    '      if (proto.types[channel]) { packet.data = proto.parsePacketBuffer(channel, packet.data).data }\n' +
    "      debug('read custom payload ' + channel + ' ' + packet.data)\n" +
    '      client.emit(channel, packet.data)\n' +
    '    }\n' +
    '  }',
  'function onLoginPluginRequest (packet) {\n' +
    "    client.write('login_plugin_response', { // write that login plugin request is not understood, just like the Notchian client\n" +
    '      messageId: packet.messageId\n' +
    '    })\n' +
    '  }',
  'message => {\n' +
    '    if (!message.reason) { return }\n' +
    '    const parsed = JSON.parse(message.reason)\n' +
    '    let text = parsed.text ? parsed.text : parsed\n' +
    '    let versionRequired\n' +
    '\n' +
    "    if (text.translate && text.translate.startsWith('multiplayer.disconnect.outdated_')) { versionRequired = text.with[0] } else {\n" +
    '      if (text.extra) text = text.extra[0].text\n' +
    "      versionRequired = /(?:Outdated client! Please use|Outdated server! I'm still on) (.+)/.exec(text)\n" +
    '      versionRequired = versionRequired ? versionRequired[1] : null\n' +
    '    }\n' +
    '\n' +
    '    if (!versionRequired) { return }\n' +
    "    client.emit('error', new Error('This server is version ' + versionRequired +\n" +
    "    ', you are using version ' + client.version + ', please specify the correct version in the options.'))\n" +
    "    client.end('differentVersionError')\n" +
    '  }',
  '() => {}'
]

function inject (bot, options) {
  const reconnect = options.reconnect ?? true
  const reconnectDelay = options.reconnectDelay ?? 0

  function resetClient () { // TODO: Find a better way to handle this
    if (options.useRandomUsername) options.username = randomUsername()

    const client = bot._client
    const newClient = mc.createClient(options)

    const fard = (event, listener) => { if (!_fard.includes(listener.toString())) newClient.on(event, listener) }

    for (const event in client._events) {
      const listener = client._events[event]
      if (Array.isArray(listener)) listener.forEach(listener => fard(event, listener))
      else fard(event, listener)
    }

    bot._client = newClient
  }

  bot.on('end', () => {
    if (!reconnect) return
    setTimeout(resetClient, reconnectDelay)
  })
}

module.exports = inject
