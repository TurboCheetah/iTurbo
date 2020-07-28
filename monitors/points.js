
class Points {
  constructor(client) {
    this.client = client;
    this.timeouts = new Set();
  }

  async run(msg) {
    if(!msg.guild || !msg.guild.settings.social) return;
    if(this.timeouts.has(msg.author.id)) return;

    if(!msg.member) await msg.guild.members.fetch(msg.author);
    await msg.member.syncSettingsCache();

    // Random point between 1-5
    const points = Math.floor(Math.random() * 5) + 1;
    await msg.member.givePoints(points);

    const curLevel = Math.floor(0.1 * Math.sqrt(parseInt(msg.member.settings.points)));

    if(msg.member.settings.level < curLevel) {
      if(msg.guild.settings.levelup) {
        await msg.channel.send(this.client.utils.random(this.client.responses.levelUpMessages)
          .replace(/{{user}}/g, msg.member.displayName)
          .replace(/{{level}}/g, curLevel))
          .catch(() => null);
      }
      await msg.member.setLevel(curLevel);
    }

    this.timeouts.add(msg.author.id);
    setTimeout(() => this.timeouts.delete(msg.author.id), 5000);
  }
}

module.exports = Points;
