<div align="center">
  <br />
  <p>
    <a href="https://iturbo.cc"> <img src="https://i.imgur.com/PmZlnHw.png" width="20%" alt="iTurbo" /> </a>
  </p>
  <p>
    <a href="https://iturbo.cc/invite"> <img src="https://discordapp.com/api/guilds/183336666323353600/embed.png" alt="Discord server" /> </a>
  </p>
  <p>
    <a href="https://github.com/TurboCheetah/iTurbo/actions"> <img src="https://github.com/TurboCheetah/iTurbo/actions/workflows/main.yml/badge.svg" alt="Test status" /> </a>
    <a href="https://www.codefactor.io/repository/github/TurboCheetah/iTurbo"><img src="https://www.codefactor.io/repository/github/TurboCheetah/iTurbo/badge" alt="CodeFactor" /></a>
    <a href="https://david-dm.org/"><img src="https://img.shields.io/david/TurboCheetah/iTurbo.svg?maxAge=3600" alt="Dependencies" /></a>
  </p>
</div>

# **iTurbo**

>__**Complete, Stable, Fast, Universal**__  
> The best all-in-one discord bot. Vibe to music, moderate your server, customize everything to your liking, and much, much more!

## Contributions

Feel free to contribute to this project by opening PRs or Issues. Contributions are always welcome.
To know more about contributions, discuss the development of iTurbo or get help, you can join our discord server [here](https://iturbo.cc/invite). [CONTRIBUTING.md](CONTRIBUTING.md) has some useful information as well.

## Running it yourself
**Requirements:**
- Node.js v14+ (Version requirement may change at any time)
- PostgreSQL 9.5+
- [IMG API](https://github.com/pollen5/img-api) (optional, however image commands depend on it)
- [LavaLink](https://github.com/freyacodes/Lavalink)

**Keys to collect** (not required but the respective command won't work)
- [top.gg](https://top.gg) (json: `dbl`) If your bot is on top.gg this is used for vote checks and stats posting. Running the bot with `--dev` will disable dbl and provide a mocked api. If your bot is not in DBL leave the field empty and the same case as `--dev` applies.
- Giphy (json: `giphy`) for the gif command.
- Genius. (json: `genius`) for retrieving lyrics.
- TMDB (json: `tmdb`) for movie/tvshow commands.
- Wolfram Alpha (json: `wolfram`) for Wolfram queries.
- Nomics (json: `nomics`) for cryptocurrency statistics
- Spotify (json: `spotify`) for Spotify song support
- KSoft (json: `ksofi`) for all KSoft commands
- Anilist (json: `anilist`) for Anilist data
- osu! (json: `osu`) for osu! player data 

The bot will run with some of the keys missing but the respective commands are not guarded and will throw errors.

Clone the repository or fetch it however you want:
```sh
$ git clone https://github.com/TurboCheetah/iTurbo.git
$ cd iTurbo
```
Install dependencies
```sh
$ yarn install
```
Copy `config.json.example` to `config.json` and fill in the fields.

Finally run the bot using `node index.js` (use pm2/nodemon whatever you want)

For the first time the bot will automatically create the database schemas, it isn't future proof though so if you decide to update the bot be careful of schema changes that you will have to manually update. If you notice a schema change use the builtin `sql` command to run things like `ALTER TABLE xxx ADD COLUMN types...` accordingly as the changes **BEFORE** pulling and running the updated code. This might be annoying but it's your reminder that this bot wasn't specifically made for others to host themselves.

Self-hosting is more aimed towards contributing rather than running your own instance, there will be lot of changes you have to do to make it truly yours which is not recommended and you will not recieve support. That being said I don't mind too much if you run an instance but please don't claim it as your own.

Be sure to join our [support server](https://iturbo.cc/support) for feedback and discussions when contributing or just to hang out. We like to meet new people so come and say Hi!

## License
iTurbo's code can be used for any purposes under the [MIT License](LICENSE)

## Credits
Special thanks to [Ravener](https://github.com/ravener) for the inital base to the bot