module.exports = [
  {
    host: 'localhost',
    port: 25565,
    useRandomUsername: true,
    version: '1.18.2', // i am too lazy to use support the new command packet or whatever in my self care plugin so i will just use 1.18.2 for now

    // Default Team Handler
    inclusiveTeam: { name: '000a' },
    exclusiveTeam: { name: '0000' },

    // Reconnect
    reconnect: true,
    reconnectDelay: 0,

    // Core
    coreSize: {
      from: { x: -1, y: 2, z: -1 },
      to: { x: 1, y: 2, z: 1 }
    },

    // Self Care
    selfCareInterval: 70
  }
]
