/**
 * Entry file.
 * Try to keep this file minimum and abstract most of the functionality in seperate files.
 *
 * @author Raven
 * @license MIT
 */

// Setup Module Alias.
require('module-alias/register')

// Load discord.js extensions.
require('#extensions/GuildMember')
require('#extensions/TextChannel')
require('#extensions/DMChannel')
require('#extensions/Message')
require('#extensions/Guild')
require('#extensions/User')
require('#extensions/Player')

// Import the Client.
const MiyakoClient = require('#structures/MiyakoClient')

// Login. (And start in development mode if --dev is passed)
new MiyakoClient(process.argv.includes('--dev') || process.env.NODE_ENV === 'dev').login()
