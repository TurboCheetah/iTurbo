const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const c = require('@aero/centra')

class NPM extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Search the NPM Registry for package information',
      usage: 'npm <package>',
      aliases: ['npmpackage', 'npmpkg', 'nodepackagemanager'],
      cooldown: 5,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, [pkg]) {
    if (!pkg) return ctx.reply('What package am I supposed to show you?')

    const body = await c(`https://registry.npmjs.com/${pkg}`).json()

    if (body.error) throw 'No results found.'

    const version = body.versions[body['dist-tags'].latest]

    let deps = version.dependencies ? Object.keys(version.dependencies) : null
    let maintainers = body.maintainers.map(user => user.name)

    if (maintainers.length > 10) {
      const len = maintainers.length - 10
      maintainers = maintainers.slice(0, 10)
      maintainers.push(`...${len} more.`)
    }

    if (deps && deps.length > 10) {
      const len = deps.length - 10
      deps = deps.slice(0, 10)
      deps.push(`...${len} more.`)
    }

    const embed = new MessageEmbed()
      .setColor(0xff0000)
      .setTitle(`NPM - ${pkg}`)
      .setURL(`https://npmjs.com/package/${pkg}`)
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64 }))
      .setDescription([body.description || 'No Description.', `**Version:** ${body['dist-tags'].latest}`, `**License:** ${body.license}`, `**Author:** ${body.author ? body.author.name : 'Unknown'}`, `**Modified:** ${new Date(body.time.modified).toDateString()}`, `**Dependencies:** ${deps && deps.length ? deps.join(', ') : 'None'}`].join('\n'))

    return ctx.reply({ embed })
  }
}

module.exports = NPM
