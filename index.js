const RoschatBot = require('./src/index')
const events = require('./src/events')

module.exports = {
  RoschatBot,
  ...events
}
