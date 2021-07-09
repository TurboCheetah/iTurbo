const { Client, Intents, Constants, version } = require('discord.js')
const { version: pkgVersion } = require('../package.json')
const CommandStore = require('./CommandStore')
const EventStore = require('./EventStore')
const MemorySweeper = require('#utils/cleanup')
const Points = require('#monitors/points') // Implement better way when we have more monitors.
const { Pool } = require('pg')
const DBL = require('dblapi.js')
const DBLMock = require('#utils/DBLMock')
const loadSchema = require('#utils/schema')
const Settings = require('./Settings')
const Logger = require('./Logger')
const presences = require('#assets/json/presences.json')
const imgapi = require('img-api')
const PostgresGiveawaysManager = require('./PostgresGiveawaysManager')
const BotAPI = require('./web')
const { Manager } = require('erela.js')
const Spotify = require('erela.js-spotify')
const Deezer = require('erela.js-deezer')
const { KSoftClient } = require('@ksoft/api') // KSoft
const Anilist = require('anilist-node') // Anilist
const Osu = require('node-osu') // osu!
const languages = require('#utils/languages')

class MiyakoClient extends Client {
  constructor(dev) {
    super({
      fetchAllMembers: false,
      disableMentions: 'everyone',
      // messageCacheMaxSize: 100,
      // messageCacheLifetime: 240,
      // messageSweepInterval: 300,
      allowedMentions: {
        parse: [],
        users: [],
        roles: [],
        repliedUser: false
      },
      messageCacheMaxSize: 30,
      messageCacheLifetime: 150,
      messageSweepInterval: 60,
      restSweepInterval: 30,
      partials: [Constants.PartialTypes.GUILD_MEMBER, Constants.PartialTypes.REACTION, Constants.PartialTypes.MESSAGE, Constants.PartialTypes.CHANNEL, Constants.PartialTypes.USER],
      intents: Intents.FLAGS.GUILDS |
      // Intents.FLAGS.GUILD_MEMBERS |
      // Intents.FLAGS.GUILD_PRESENCES |
      Intents.FLAGS.GUILD_VOICE_STATES |
      Intents.FLAGS.GUILD_BANS |
      Intents.FLAGS.GUILD_INVITES |
      Intents.FLAGS.GUILD_MESSAGES |
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS |
      Intents.FLAGS.GUILD_WEBHOOKS |
      Intents.FLAGS.DIRECT_MESSAGES |
      Intents.FLAGS.GUILD_VOICE_STATES,
      presence: {
        status: 'idle',
        activities: [{ name: 'things load...', type: 'WATCHING' }]
      }
    })

    this.dev = dev || false
    this.config = require('../config.json')
    this.logger = new Logger()
    this.constants = require('#utils/constants')
    this.commands = new CommandStore(this)
    this.utils = require('#utils/Utils') // Easier to access everywhere.
    this.events = new EventStore(this)
    this.sweeper = new MemorySweeper(this)
    this.responses = require('#utils/responses')
    this.languages = require('#languages/language-meta.json')
    this.img = new imgapi.Client({ host: this.config.imgapi })
    this.BotAPI = new BotAPI(this)
    this.manager = new Manager({
      nodes: this.config.lavalink.nodes,
      send: (id, payload) => {
        const guild = this.guilds.cache.get(id)
        if (guild) guild.shard.send(payload)
      },
      plugins: [
        // Initiate the plugin and pass the two required options.
        new Spotify({
          clientID: this.config.spotify.id,
          clientSecret: this.config.spotify.secret,
          convertUnresolved: true
        }),
        new Deezer({ convertUnresolved: true })
      ]
    })
    this.ksoft = new KSoftClient(this.config.ksoft)
    this.anilist = new Anilist(this.config.anilist)
    this.osu = new Osu.Api(this.config.osu, { completeScores: true })
    this.version = pkgVersion

    // Settings.
    this.settings = {
      guilds: new Settings(this, 'guilds'),
      members: new Settings(this, 'members'),
      users: new Settings(this, 'users'),
      store: new Settings(this, 'store'),
      giveaways: new Settings(this, 'giveaways')
    }

    // Sentry
    if (!this.dev) {
      const Sentry = require('@sentry/node')
      const { hostname } = require('os')

      Sentry.init({
        dsn: 'https://4ee7632addbb4628bbe0aa7a85fcf015@o503858.ingest.sentry.io/5589552',
        release: `iturbo@${this.version}`,
        autoSessionTracking: true,
        tracesSampleRate: 1.0
      })
      this.sentry = Sentry
      this.sentry.setTag('host', hostname())
      this.sentry.setTag('shard', this.shard.ids[0])
      this.sentry.setTag('discord.js', version)
      this.sentry.setTag('version', this.version)
      if (this.shard.ids[0] === 0) this.logger.success('Connected to Sentry')
    }

    // Lavalink stuff
    // Emitted whenever a node connects
    this.manager
      .on('nodeConnect', node => {
        if (this.shard.ids[0] === 0) this.logger.success(`Connected to Lavalink node ${node.options.identifier}.`)
      })
      // Emitted whenever a node encountered an error
      .on('nodeError', (node, error) => {
        if (this.shard.ids[0] === 0) this.logger.success(`Lavalink node ${node.options.identifier} encountered an error: ${error.message}.`)
      })
      .on('trackStart', (player, track) => this.emit('playSong', player, track))
      // Emitted the player queue ends
      .on('queueEnd', player => {
        const channel = this.channels.cache.get(player.textChannel)
        channel.send('The queue has ended.').then(ctx => ctx.delete({ timeout: 10000 }))
        player.destroy()
      })

    this.dbl = this.config.dbl && !this.dev ? new DBL(this.config.dbl, this) : new DBLMock()
    this.points = new Points(this)
    this.on('ready', this.onReady.bind(this))

    const { host, user, password, database } = this.config.postgresql
    this.db = new Pool({ host, user, password, database })
    this.dbconn = null

    process.on('message', async message => {
      if (message.type !== 'shard') return

      if (message.data.lastShardReady === true) {
        this.logger.success('All shards ready')
        // Setup presence.
        await this.shard.broadcastEval('this.rollPresence()')
        // Sweep cache.
        await this.shard.broadcastEval('this.sweeper.run()')
      }
    })
  }

  onReady() {
    this.ready = true
    if (this.shard.ids[0] === 0) this.logger.success(`Logged in as ${this.user.tag}`)
    // Initiates the manager and connects to all the nodes
    this.manager.init(this.user.id)
    this.emit('miyakoReady')
  }

  async login() {
    await this.init()
    const manager = new PostgresGiveawaysManager(this, {
      storage: false,
      updateCountdownEvery: 10000,
      default: {
        botsCanWin: false,
        exemptPermissions: [],
        embedColor: this.constants.color,
        reaction: '🎉'
      }
    })

    this.giveawaysManager = manager
    const { devtoken, token } = this.config
    return super.login(this.dev ? devtoken : token)
  }

  async rollPresence() {
    const { message, type } = this.utils.random(presences)
    return this.user.setPresence({
      activities: [
        {
          // eslint-disable-next-line prettier/prettier
          name: message.replace(/{{guilds}}/g, (await this.shard.fetchClientValues('guilds.cache.size')).reduce((acc, guildCount) => acc + guildCount, 0)),
          type: type
        }
      ],
      status: 'online'
    })
  }

  /**
   * Check if a given user is a premium user.
   * @returns {Promise<Boolean>}
   */
  async verifyPremium(user) {
    const premium = await this.shard.broadcastEval(`
    (async () => {
    // First grab the support guild.
    const guild = this.guilds.cache.get('${this.constants.mainGuildID}')
      if (guild) {
        try {
          // Grab the member.
          const member = await guild.members.fetch('${user}')
          // See if they have the role.
          return member.roles.cache.has('${this.constants.premiumRole}')
        } catch (err) {
          // If an error happens, e.g member is not in the support guild then just return false.
          return false
        }
      }
    })()
    `)
    return premium.filter(premium => premium)[0]
  }

  async init() {
    // Load translations
    this.translations = await languages()
    // Load pieces.
    const [commands, events] = await Promise.all([this.commands.loadFiles(), this.events.loadFiles()])
    if (this.shard.ids[0] === 0) {
      this.logger.success(`Loaded ${commands} commands.`)
      this.logger.success(`Loaded ${events} events.`)
    }
    // Connect database.
    this.dbconn = await this.db.connect()
    if (this.shard.ids[0] === 0) this.logger.success('Connected to PostgreSQL')

    // Initialize schema.
    await loadSchema(this.db)

    // Initialize settings.
    for (const [name, settings] of Object.entries(this.settings)) {
      await settings.init()
      if (this.shard.ids[0] === 0) this.logger.success(`Loaded ${settings.cache.size} ${name}`)
    }

    if (this.shard.ids[0] === 0) this.BotAPI.run()
  }
}

module.exports = MiyakoClient
