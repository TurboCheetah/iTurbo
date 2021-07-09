const { Structures } = require('discord.js')

module.exports = Structures.extend(
  'Guild',
  Guild =>
    class MiyakoGuild extends Guild {
      get settings() {
        return (
          this.client.settings.guilds.get(this.id) || {
            id: this.id,
            weebGreetings: false,
            modlog: false,
            prefix: '|',
            levelup: true,
            social: true,
            starboard: null,
            starboardLimit: 2,
            language: 'en-US'
          }
        )
      }

      get prefix() {
        return this.settings.prefix
      }

      syncSettings() {
        return this.client.settings.guilds.sync(this.id)
      }

      /**
       * Alias
       * this.client.settings.guilds.update(guild.id, { prefix: "..." })
       * to just
       * guild.update({ prefix: "..." })
       */
      update(obj) {
        return this.client.settings.guilds.update(this.id, obj)
      }

      translate(key, args) {
        const language = this.client.translations.get(this.settings.language)
        if (!language) throw 'Message: Invalid language set in data.'
        return language(key, args)
      }
    }
)
