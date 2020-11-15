const Event = require('../structures/Event.js')

class voiceStateUpdate extends Event {
  async run (oldState, newState) {
    if (newState.member.id === '282255550312349697' && newState.selfDeaf === false) {
      newState.member.id.setSelfDeaf(true)
    }
  }
}

module.exports = voiceStateUpdate
