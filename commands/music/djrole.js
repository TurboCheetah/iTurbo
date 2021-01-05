const Command = require('../../structures/Command.js')

class DJRole extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Enables or disables the DJ role used for restricting access to music commands.',
      aliases: ['setdj'],
      userPermissions: ['MANAGE_GUILD'],
      usage: 'djrole <enable <role> | disable | current:default>',
      guildOnly: true,
      cooldown: 3
    })
  }

  async run(ctx, [action = 'current', ...args]) {
    if (!['enable', 'disable', 'current'].includes(action)) {
      return ctx.reply(`Usage: \`${ctx.guild.settings.prefix}${this.usage}\`\n\`\`\`${this.extendedHelp}\n\`\`\``)
    }

    return this[action](ctx, args)
  }

  async enable(ctx, args) {
    const rolename = args.join(' ').toLowerCase()
    console.log(rolename)
    if (!rolename) return ctx.reply(`${this.client.constants.error} Usage: \`${ctx.guild.prefix}djrole enable <role>\``)

    const role = ctx.guild.roles.cache.find(r => r.id === rolename || r.name.toLowerCase() === rolename)
    if (!role) return ctx.reply(`${this.client.constants.error} That role does not exist!`)

    ctx.guild.update({ djRole: role.id })
    ctx.reply(`${this.client.constants.success} Successfully set ${role} as the DJ role!`)
  }

  async disable(ctx, args) {
    ctx.guild.update({ djRole: null })

    return ctx.reply(`${this.client.constants.success} Successfully disabled DJ role.`)
  }

  async current(ctx, args) {
    const role = ctx.guild.settings.djRole ? ctx.guild.roles.cache.find(r => r.id === ctx.guild.settings.djRole) : '`Disabled`'
    return ctx.reply(`The current DJ role in ${ctx.guild.name} is ${role}`)
  }
}

module.exports = DJRole
