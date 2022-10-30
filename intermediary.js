const EventEmitter = require('node:events')

class Intermediary extends EventEmitter {
  setClient (client) {
    this._client = client

    client.on('connect', () => this.emit('connect'))
    client.on('end', reason => this.emit('end', reason))
    client.on('error', error => this.emit('error', error))

    client.on('packet', (data, metadata, buffer, fullBuffer) => {
      this.emit('packet', data, metadata, buffer, fullBuffer)
      this.emit(metadata.name, data, metadata)
    })

    client.on('raw', (buffer, metadata) => {
      this.emit('raw.' + metadata.name, buffer, metadata)
      this.emit('raw', buffer, metadata)
    })

    client.on('state', (newState, oldState) => this.emit('state', newState, oldState))

    return this
  }

  write (name, packet) { return this._client.write(name, packet) }

  writeRaw (buffer) { return this._client.writeRaw(buffer) }
}

module.exports = Intermediary
