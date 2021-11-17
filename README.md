<div align="center">
  <br />
  <p>
    <a href="https://iturbo.cc"> <img src="https://i.imgur.com/PmZlnHw.png" width="20%" alt="iTurbo" /> </a>
  </p>
  <p>
    <a href="https://iturbo.cc/invite"> <img src="https://discordapp.com/api/guilds/183336666323353600/embed.png" alt="Discord server" /> </a>
  </p>
  <p>
    <a href="https://github.com/TurboCheetah/iTurbo/actions/workflows/docker-image.yml"> <img src="https://github.com/TurboCheetah/iTurbo/actions/workflows/docker-publish.yml/badge.svg" alt="Docker status" /> </a>
    <a href="https://www.codefactor.io/repository/github/TurboCheetah/iTurbo"><img src="https://www.codefactor.io/repository/github/TurboCheetah/iTurbo/badge" alt="CodeFactor" /></a>
    <a href="https://depfu.com/github/TurboCheetah/iTurbo?project_id=32899"><img src="https://badges.depfu.com/badges/037fbc8ea1d04d4772b6ea0fe842c2f0/overview.svg" alt="Depfu" /></a>
    <a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="JavaScript Style Guide" /></a>
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
- Node.js v16+ (Version requirement may change at any time)
- Docker

**Keys to collect** (not required but the respective command won't work)
- [Anilist](https://anilist.gitbook.io/anilist-apiv2-docs/overview/oauth/getting-started) - for Anilist data
- [KSoft](https://api.ksoft.si/#get-started) - for all KSoft commands
- [osu!](https://osu.ppy.sh/wiki/en/osu%21api) - for osu! player data 
- [TMDB](https://www.themoviedb.org/documentation/api) - for movie and tv commands.
- [Weeb.sh](https://weeb.sh/) - for all Weeb.sh commands
- [Wolfram Alpha](https://products.wolframalpha.com/api/) - for Wolfram queries.

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
Copy `.env.example` to `.env` and fill in the fields.

Finally, run the bot using `yarn build` and `yarn start`.
Alternatively, run the bot through a Docker container using `docker-compose up -d`.

Self-hosting is more aimed towards contributing rather than running your own instance, there will be lot of changes you have to do to make it truly yours which is not recommended and you will not recieve support. That being said I don't mind too much if you run an instance but please don't claim it as your own.

Be sure to join our [support server](https://iturbo.cc/support) for feedback and discussions when contributing or just to hang out. We like to meet new people so come and say hi!

## License
iTurbo's code can be used for any purposes under the [MIT License](LICENSE)