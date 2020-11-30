const { GiveawaysManager } = require('discord-giveaways')

const PostgresGiveawaysManager = class extends GiveawaysManager {
  // This function is called when the manager needs to get all the giveaway stored in the database.
  async getAllGiveaways () {
    // Get all the giveaway in the database
    return await this.client.settings.bot.get('0').giveaways || []
  }

  // This function is called when a giveaway needs to be saved in the database (when a giveaway is created or when a giveaway is edited).
  async saveGiveaway (messageID, giveawayData) {
    // Get existing giveaways to append to.
    console.log(giveawayData);
    const data = this.client.settings.bot.get('0').giveaways || []

    // Add the new one
    data.push(giveawayData)

    await this.client.settings.bot.update('0', { giveaways: data })

    // Don't forget to return something!
    return true
  }

  async editGiveaway (messageID, giveawayData) {
    // Gets all the current giveaways
    const giveaways = this.client.settings.bot.get('0').giveaways || []
    // Remove the old giveaway from the current giveaways ID
    const newGiveawaysArray = giveaways.filter((giveaway) => giveaway.messageID !== messageID)
    // Push the new giveaway to the array
    newGiveawaysArray.push(giveawayData)
    // Save the updated array
    await this.client.settings.bot.update('0', { giveaways: newGiveawaysArray })
    // Don't forget to return something!
    return true
  }

  // This function is called when a giveaway needs to be deleted from the database.
  async deleteGiveaway (messageID) {
    const db = await this.client.settings.bot.get('giveaways') || []
    // Remove the giveaway from the array
    const newGiveawaysArray = db.filter((giveaway) => giveaway.messageID !== messageID)
    // Save the updated array
    await this.client.settings.bot.update('0', { giveaways: newGiveawaysArray })
    // Don't forget to return something!
    return true
  }
}

module.exports = PostgresGiveawaysManager
