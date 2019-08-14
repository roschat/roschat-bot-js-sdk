const RoschatBot = require('./lib/index')
const events = require('./lib/events')

module.exports = {
  RoschatBot,
  ...events
}
