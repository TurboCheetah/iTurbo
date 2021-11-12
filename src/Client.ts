import 'reflect-metadata'
import path from 'path'
import { Intents, Interaction } from 'discord.js'
import { Client } from 'discordx'
import Manager from './Manager'
import Anilist from 'anilist-node'
import { KSoftClient } from '@ksoft/api'
import { API } from 'nhentai'
import { Logger } from './utils/Logger'
import { NotABot } from './guards/NotABot'
import { Constants } from './utils/constants'

export class Bot extends Client {
  public anilist: Anilist
  public ksoft: KSoftClient
  public nhentai: API
  public cluster?: Manager
  constants: typeof Constants

  constructor() {
    super({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
      classes: [path.join(__dirname, 'commands', '**/*.{ts,js}'), path.join(__dirname, 'events', '**/*.{ts,js}')],
      botGuilds: process.env.NODE_ENV === 'development' ? [String(process.env.DEV_GUILD) ?? ''] : undefined,
      silent: true,
      guards: [NotABot]
    })

    this.anilist = new Anilist(process.env.ANILIST_TOKEN)
    this.ksoft = new KSoftClient(process.env.KSOFT_TOKEN as string)
    this.nhentai = new API()
    this.constants = Constants
  }

  async init(): Promise<this> {
    super.once('ready', async () => {
      // init all applicaiton commands
      await super.initApplicationCommands()

      // init permissions; enabled log to see changes
      await super.initApplicationPermissions(true)

      this.user?.setActivity('anime', { type: 'WATCHING' })
      this.user?.setPresence({ status: 'idle' })

      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      Logger.success(`${this.user?.tag} serving ${((await this.shard?.fetchClientValues('guilds.cache.size')) as number[]).reduce((acc, guildCount) => acc + guildCount, 0)} guilds`)
    })

    super.on('interactionCreate', (interaction: Interaction) => {
      super.executeInteraction(interaction)
    })

    super.login(process.env.NODE_ENV === 'development' ? process.env.DEV_TOKEN ?? '' : process.env.TOKEN ?? '')

    return this
  }
}
