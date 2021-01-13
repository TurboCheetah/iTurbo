const { Client, version } = require('discord.js')
const CommandStore = require('./CommandStore.js')
const EventStore = require('./EventStore.js')
const MemorySweeper = require('../utils/cleanup.js')
const Points = require('../monitors/points.js') // Implement better way when we have more monitors.
const { Pool } = require('pg')
const DBL = require('dblapi.js')
const DBLMock = require('../utils/DBLMock.js')
const loadSchema = require('../utils/schema.js')
const Settings = require('./Settings.js')
const presences = require('../assets/json/presences.json')
const imgapi = require('img-api')
const PostgresGiveawaysManager = require('./PostgresGiveawaysManager.js')
const BotAPI = require('./web')
const { Manager } = require('erela.js')
const Spotify = require('erela.js-spotify')
const { KSoftClient } = require('@ksoft/api') // KSoft

class MiyakoClient extends Client {
  constructor(dev) {
    super({
      fetchAllMembers: false,
      disableMentions: 'everyone',
      messageCacheMaxSize: 100,
      messageCacheLifetime: 240,
      messageSweepInterval: 300
    })

    this.dev = dev || false
    this.config = require('../config.json')
    this.console = console // TODO: Implement a console logger.
    this.constants = require('../utils/constants.js')
    this.commands = new CommandStore(this)
    this.utils = require('../utils/Utils.js') // Easier to access everywhere.
    this.events = new EventStore(this)
    this.sweeper = new MemorySweeper(this)
    this.responses = require('../utils/responses.js')
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
        })
      ]
    })
    this.ksoft = new KSoftClient(this.config.ksoft)
    this.version = '1.1.5'

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
      this.sentry.setTag('discord.js', version)
      this.sentry.setTag('version', this.version)
      console.log('Connected to Sentry')
    }

    // Lavalink stuff
    // Emitted whenever a node connects
    this.manager
      .on('nodeConnect', node => console.log(`Connected to Lavalink node ${node.options.identifier}.`))
      // Emitted whenever a node encountered an error
      .on('nodeError', (node, error) => console.log(`Lavalink node ${node.options.identifier} encountered an error: ${error.message}.`))
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
  }

  onReady() {
    this.ready = true
    this.console.log(`Logged in as ${this.user.tag}`)
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

  rollPresence() {
    const { message, type } = this.utils.random(presences)
    return this.user.setActivity(message.replace(/{{guilds}}/g, this.guilds.cache.size), { type }).catch(() => null)
  }

  /**
   * Check if a given user is a premium user.
   * @returns {Promise<Boolean>}
   */
  async verifyPremium(user) {
    // First grab the support guild.
    const guild = this.guilds.cache.get(this.constants.mainGuildID)

    try {
      // Grab the member.
      const member = await guild.members.fetch(user)
      // See if they have the role.
      return member.roles.cache.has(this.constants.premiumRole)
    } catch (err) {
      // If an error happens, e.g member is not in the support guild then just return false.
      return false
    }
  }

  async init() {
    // Load pieces.
    const [commands, events] = await Promise.all([this.commands.loadFiles(), this.events.loadFiles()])
    this.console.log(`Loaded ${commands} commands.`)
    this.console.log(`Loaded ${events} events.`)

    // Connect database.
    this.dbconn = await this.db.connect()
    this.console.log('Connected to PostgreSQL')

    // Initialize schema.
    await loadSchema(this.db)

    // Initialize settings.
    for (const [name, settings] of Object.entries(this.settings)) {
      await settings.init()
      this.console.log(`Loaded ${settings.cache.size} ${name}`)
    }

    this.BotAPI.run()
  }
}

module.exports = MiyakoClient
