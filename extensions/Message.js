const { Structures } = require('discord.js')

module.exports = Structures.extend(
  'Message',
  Message =>
    class MiyakoMessage extends Message {
      get member() {
        if (this.guild) return super.member
        return { user: this.author, displayName: this.author.username }
      }

      get language() {
        return this.guild ? this.guild.language : this.author.language
      }

      async awaitReply(question, filter, limit = 60000, embed, delMsg = false) {
        const q = await this.channel.send(question, embed)

        return this.channel
          .awaitMessages(filter, { max: 1, time: limit, errors: ['time'] })
          .then(collected => {
            if (delMsg) {
              q.delete({ timeout: 2500 })
              collected.first().delete({ timeout: 2500 })
            }
            return collected.first().content
          })
          .catch(() => false)
      }
    }
)
