const { Structures } = require('discord.js')
const languages = require('#languages')

module.exports = Structures.extend(
  'User',
  User =>
    class MiyakoUser extends User {
      get settings() {
        return (
          this.client.settings.users.get(this.id) || {
            id: this.id,
            reputation: 0,
            repscooldown: 0,
            title: null,
            prefix: null,
            language: 'english'
          }
        )
      }

      get language() {
        return languages[this.settings.language || 'english'] || languages.english
      }

      update(obj) {
        return this.client.settings.users.update(this.id, obj)
      }

      syncSettings() {
        return this.client.settings.users.sync(this.id)
      }

      /**
       * Sync only if the entry is not cached.
       */
      syncSettingsCache() {
        if (!this.client.settings.users.cache.has(this.id)) return this.syncSettings()
      }
    }
)
