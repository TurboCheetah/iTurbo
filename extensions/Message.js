const { Structures } = require('discord.js')

module.exports = Structures.extend(
  'Message',
  Message =>
    class MiyakoMessage extends Message {
      get member() {
        if (this.guild) return super.member
        return { user: this.author, displayName: this.author.username }
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

      translate(key, args) {
        const language = this.client.translations.get(this.guild ? this.guild.settings.language : this.author.settings.language)
        if (!language) throw 'Message: Invalid language set in data.'
        return language(key, args)
      }
    }
)
