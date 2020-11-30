const { GiveawaysManager } = require('discord-giveaways')

const PostgresGiveawaysManager = class extends GiveawaysManager {
  // This function is called when the manager needs to get all the giveaway stored in the database.
  async getAllGiveaways () {
    // Get all the giveaway in the database
    return await this.client.settings.giveaways.find() || []
  }

  // This function is called when a giveaway needs to be saved in the database (when a giveaway is created or when a giveaway is edited).
  async saveGiveaway (messageID, giveawayData) {
    /* // Get existing giveaways to append to.
    const data = this.client.settings.giveaways.get(messageID) || []

    // Add the new one
    data.push(giveawayData) */

    await this.client.settings.giveaways.update(messageID, {
      messageID: giveawayData.messageID,
      channelID: giveawayData.channelID,
      guildID: giveawayData.guildID,
      startAt: giveawayData.startAt,
      endAt: giveawayData.endAt,
      ended: giveawayData.ended,
      winnerCount: giveawayData.winnerCount,
      prize: giveawayData.prize,
      messages: giveawayData.messages,
      hostedBy: giveawayData.hostedBy
    })

    // Don't forget to return something!
    return true
  }

  async editGiveaway (messageID, giveawayData) {
    /* // Gets all the current giveaways
    const giveaways = this.client.settings.giveaways.get(messageID) || []
    // Remove the old giveaway from the current giveaways ID
    const newGiveawaysArray = giveaways.filter((giveaway) => giveaway.messageID !== messageID)
    // Push the new giveaway to the array
    newGiveawaysArray.push(giveawayData)
    // Save the updated array */
    await this.client.settings.giveaways.update(messageID, {
      messageID: giveawayData.messageID,
      channelID: giveawayData.channelID,
      guildID: giveawayData.guildID,
      startAt: giveawayData.startAt,
      endAt: giveawayData.endAt,
      ended: giveawayData.ended,
      winnerCount: giveawayData.winnerCount,
      prize: giveawayData.prize,
      messages: giveawayData.messages,
      hostedBy: giveawayData.hostedBy
    })
    // Don't forget to return something!
    return true
  }

  // This function is called when a giveaway needs to be deleted from the database.
  async deleteGiveaway (messageID) {
    /* const db = await this.client.settings.giveaways.get(messageID) || []
    // Remove the giveaway from the array
    const newGiveawaysArray = db.filter((giveaway) => giveaway.messageID !== messageID)
    // Save the updated array */
    await this.client.settings.giveaways.delete(messageID)
    // Don't forget to return something!
    return true
  }
}

module.exports = PostgresGiveawaysManager
