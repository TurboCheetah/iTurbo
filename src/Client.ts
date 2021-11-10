import 'reflect-metadata'
import path from 'path'
import { Intents, Interaction } from 'discord.js'
import { Client } from 'discordx'
import Anilist from 'anilist-node'
import { KSoftClient } from '@ksoft/api'
import { API } from 'nhentai'
import { Logger } from './utils/Logger'

export class Bot extends Client {
  public anilist: Anilist
  public ksoft: KSoftClient
  public nhentai: API

  constructor() {
    super({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
      classes: [path.join(__dirname, 'commands', '**/*.{ts,js}'), path.join(__dirname, 'events', '**/*.{ts,js}')],
      botGuilds: process.env.NODE_ENV === 'development' ? [String(process.env.DEV_GUILD) ?? ''] : undefined,
      silent: true
    })

    this.anilist = new Anilist(process.env.ANILIST_TOKEN)
    this.ksoft = new KSoftClient(process.env.KSOFT_TOKEN as string)
    this.nhentai = new API()
  }

  async init(): Promise<void> {
    super.once('ready', async () => {
      // init all applicaiton commands
      await super.initApplicationCommands()

      // init permissions; enabled log to see changes
      await super.initApplicationPermissions(true)

      super.user?.setActivity('myself be rewritten', { type: 'WATCHING' })
      super.user?.setPresence({ status: 'idle' })

      Logger.success(`Bot started`)
    })

    super.on('interactionCreate', (interaction: Interaction) => {
      super.executeInteraction(interaction)
    })

    super.login(process.env.NODE_ENV === 'development' ? process.env.DEV_TOKEN ?? '' : process.env.TOKEN ?? '')
  }
}
