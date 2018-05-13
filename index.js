/*
  A discord bot - bteam helper bot
*/
//https://discordapp.com/api/oauth2/authorize?client_id=xxxxxxxxxxx&permissions=268774464&scope=bot
const _ = require('lodash');
// Import the discord.js module
const Discord = require('discord.js');
// Create an instance of a Discord client
const client = new Discord.Client();

//Import Game module
const Game = require('./lib/projectDark');
//Create instance of game
const darkly = new Game();

const sql = require('sqlite');
sql.open('./skins.sqlite');
require('dotenv').config();

const roleCMD = require('./commands/role');
const rolesCMD = require('./commands/roles');

// The token of your bot - https://discordapp.com/developers/applications/me
const token = process.env.DISCORD_TOKEN;
//client id of the bot to put a maker against other roles.
const clientId = process.env.DISCORD_CLIENT_ID;

// Client has Joined a guild
client.on('guildCreate', guild => {
  darkly.intialize(guild);
});

// bot is ready - do it!
client.on('ready', () => {
  console.log(
    `Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${
      client.guilds.size
    } guilds. `
  );
  client.user.setActivity({game: {name: `on ${client.guilds.size} servers`, type: 0}});

  //initialize incase stuff got screwed up.
  client.guilds.forEach(guild => {
    darkly.intialize(guild);
  });
});

const prefix = '!';

//Ready Messages
client.on('message', msg => {
  const prefix = '!';
  // Exit and stop if prefix is not there  // Ignore bots.
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  if (msg.channel.type === 'dm') return; //Ignore all DM's

  //handle args into commands
  const args = msg.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);

  //set command
  const command = args.shift().toLowerCase();

  //Role command
  if (command === 'join') {
    // roleCMD(client, msg, args);
    sql
      .get(`SELECT * FROM users WHERE discordId = "${msg.author.id}"`)
      .then(row => {
        console.log(row, 'data?');
        const message = `you've already joined! Create your Org with !createorg organization_name`;
        msg.reply(message);
      })
      .catch(err => {
        console.log(err, 'asd');
        sql
          .run(
            'CREATE TABLE IF NOT EXISTS users (uid INTEGER PRIMARY KEY AUTOINCREMENT, discordId INTEGER)'
          )
          .then(() => {
            sql.run('INSERT INTO users (discordId) VALUES (?)', [msg.author.id]).then(() => {
              const message = `create your Org with !createorg organization_name`;
              msg.reply(message);
            });
          });
      });
  }

  if (command === 'createorg') {
    // roleCMD(client, msg, args);
    sql
      .get(
        `SELECT users.discordId, orgId, name FROM users LEFT JOIN organizations ON organizations.ownerId = users.discordId WHERE users.discordId = ${
          msg.author.id
        }`
      )
      .then(row => {
        console.log(row, 'data?');
        const message = `you've already created an org. Get your orgs details using !org`;
        msg.reply(message);
      })
      .catch(err => {
        console.log(err, 'asd');
        sql
          .run(
            'CREATE TABLE IF NOT EXISTS organizations (orgId INTEGER PRIMARY KEY AUTOINCREMENT, ownerId INTEGER, name text)'
          )
          .then(() => {
            let [organization_name] = args;
            if (!organization_name) return;

            sql.run('INSERT INTO organizations (ownerId, name) VALUES (?, ?)', [
              msg.author.id,
              organization_name,
            ]);
          });
      });
  }

  if (command === 'getsouls') {
    // roleCMD(client, msg, args);
    // `SELECT souls.name, souls.soulId FROM souls LEFT JOIN organizations ON organizations.orgId = souls.orgId AND organizations.ownerId = 107363590914211840`
    sql
      .all(
        `SELECT souls.soulId, souls.name , organizations.name AS orgName, souls.orgId, ownerId FROM 'organizations' LEFT JOIN 'souls' ON souls.orgId = organizations.id WHERE organizations.ownerId = ${
          msg.author.id
        };`
      )
      .then(row => {
        console.log(row, 'souls?');

        let souls = [];
        row.forEach(r => {
          console.log(r, 'making sure this is correct?');
          souls.push({
            name: `${r.name}`,
            value: `${r.orgName}`,
            inline: true,
          });
        });

        const embed = {
          embed: {
            color: 13369344,
            description: 'These are all of your souls',
            fields: souls,
            footer: {
              text: 'TBD TEXT',
            },
          },
        };

        msg.reply(embed);
      })
      .catch(err => {
        console.log(err, 'asd');
        sql
          .run(
            'CREATE TABLE IF NOT EXISTS souls (soulId INTEGER PRIMARY KEY AUTOINCREMENT, orgId INTEGER, name text)'
          )
          .then(() => {
            const message = `you have no souls, purchase a soul using !purchasesoul soulname`;
            msg.reply(message);
          });
      });
  }

  if (command === 'purchasesoul') {
    let [soul_name] = args;
    if (!soul_name) return;

    sql
      .get(
        `SELECT users.discordId, orgId, name FROM users LEFT JOIN organizations ON organizations.ownerId = users.discordId WHERE users.discordId = ${
          msg.author.id
        }`
      )
      .then(row => {
        sql.run('INSERT INTO souls (orgId, name) VALUES (?, ?)', [row.orgId, soul_name]);
      })
      .catch(err => {
        console.log(err, 'create sould error');
      });
  }

  if (command === 'start-quest') {
    console.log(msg, msg.author.id);

    //check if user is already questing
    //Check if available quest exists and has not started
    //check if quest has room

    //check any adition requirements (lvl, equipment, etc)

    //Start Quest Lobby - have a quest ID

    //If quest lobby already exists and has room, add permissions
    //Start empty lobby with permissions

    //Quest Lobby should be quest-name-#1

    const quests = [
      {
        name: 'The meeting',
        status: 'waiting',
        users: [
          {
            id: 1234,
            name: 'matt',
            stats: {},
          },
          {
            id: 12345,
            name: 'jim',
            stats: {},
          },
        ],
      },
      {
        name: 'The meeting',
        status: 'active',
        users: [
          {
            id: 134,
            name: 'pam',
            stats: {},
          },
          {
            id: 1235,
            name: 'carl',
            stats: {},
          },
        ],
      },
    ];

    msg.guild.createChannel(`The Meeting #${quests.length + 1}`, 'text').then(quest => {
      quest.setParent(msg.channel.parentID);
    });
  }

  if (command === 'leave-quest') {
    console.log(msg, msg.author.id);
    //check if any users are left active in the quest, if not, delete quest
    //set user not active
    //clean up quest data
    msg.channel.delete();
  }
});

// CREATE TABLE Users (
// 	uid integer PRIMARY KEY AUTOINCREMENT,
// 	discordId integer
// );

// CREATE TABLE organizations (
// 	orgId integer PRIMARY KEY AUTOINCREMENT,
// 	ownerId integer,
// 	name text
// );

// CREATE TABLE souls (
// 	soulId integer PRIMARY KEY AUTOINCREMENT,
// 	orgId integer,
// 	name text
// );

//Login the bot
client.login(token);

//ERROR HANDLING
// client.on('error', e => console.error(e));
// client.on('warn', e => console.warn(e));
// client.on('debug', e => console.info(e));
