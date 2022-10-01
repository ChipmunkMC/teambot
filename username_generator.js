const { randomBytes } = require('crypto')

// characters 33-126 are currently allowed in (offline) usernames
const MIN = 33
const MAX = 126
const DIFF = MAX - MIN

function randomUsername (length = 14) {
  let username = ''

  const bytes = randomBytes(length)
  for (let i = 0; i < bytes.length; ++i) {
    username += String.fromCharCode((bytes[i] % DIFF) + MIN)
  }

  return username
}

module.exports = randomUsername
