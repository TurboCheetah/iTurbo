const Command = require('../../structures/Command.js')

class DJRole extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Enables or disables the DJ role used for restricting access to music commands.',
      aliases: ['setdj'],
      userPermissions: ['MANAGE_GUILD'],
      usage: 'djrole <enable <role> | disable | current:default>',
      arguments: {
        enable: 'Enables the DJ role on the server',
        disable: 'Disabled the DJ role on the server',
        current: 'Returns the current DJ role',
        role: 'The role that will be set as the DJ role'
      },
      examples: {
        'enable DJ': 'Enables DJ roles on the server and sets "DJ" as the DJ role'
      },
      guildOnly: true,
      cooldown: 3
    })
  }

  async run(ctx, [action = 'current', ...args]) {
    if (!['enable', 'disable', 'current'].includes(action)) {
      return ctx.msgEmbed(`Usage: \`${ctx.guild.settings.prefix}${this.usage}\`\n\`\`\`${this.extendedHelp}\n\`\`\``, this.client.constants.emojis.errorImg)
    }

    return this[action](ctx, args)
  }

  async enable(ctx, args) {
    const rolename = args.join(' ').toLowerCase()
    console.log(rolename)
    if (!rolename) return ctx.msgEmbed(`Usage: \`${ctx.guild.prefix}djrole enable <role>\``, this.client.constants.emojis.errorImg)

    const role = ctx.guild.roles.cache.find(r => r.id === rolename || r.name.toLowerCase() === rolename)
    if (!role) return ctx.msgEmbed('That role does not exist!', this.client.constants.emojis.errorImg)

    ctx.guild.update({ djRole: role.id })
    ctx.msgEmbed(`Successfully set ${role} as the DJ role!`, this.client.constants.emojis.successImg)
  }

  async disable(ctx, args) {
    ctx.guild.update({ djRole: null })

    return ctx.msgEmbed('Successfully disabled DJ role.', this.client.constants.emojis.successImg)
  }

  async current(ctx, args) {
    const role = ctx.guild.settings.djRole ? ctx.guild.roles.cache.find(r => r.id === ctx.guild.settings.djRole) : '`Disabled`'
    return ctx.msgEmbed(`The current DJ role in ${ctx.guild.name} is ${role}`)
  }
}

module.exports = DJRole
