const Command = require('#structures/Command')

class Reboot extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Shuts down/Reboots the bot.',
      ownerOnly: true,
      hidden: true,
      aliases: ['shutdown', 'restart']
    })
  }

  async run(ctx) {
    await ctx.reply('Shutting down...')
    await this.client.user.setPresence({ activities: [{ name: 'myself reboot...', type: 'WATCHING' }], status: 'idle' })
    await this.client.dbconn.release()
    await this.client.db.end()
    process.exit()
  }
}

module.exports = Reboot
