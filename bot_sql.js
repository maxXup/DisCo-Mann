/*
  A ping pong bot, whenever you send "ping", it replies "pong".
 */

// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = 'MzE1ODQyOTIzNzM4NjkzNjU1.DJMWMw.XqkaM7_-Km6inpn3jSUvvgLalYU';

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted

// SQLite3
var fs = require('fs');
var SQL = require('sql.js');
var filebuffer = fs.readFileSync('test_bdd_sql.sqlite');

// Load the db
var db = new SQL.Database(filebuffer);


client.on('ready', () => {
  console.log('Bot lancé');
}
);

// Create an event listener for messages
client.on('message', message => {
    if(message.author.username !== 'bottest'){
    let msg_sql = message.content;
    message.reply(msg_sql);
        try{
            msg_sql = msg_sql.substring(msg_sql.indexOf(',')+1,msg_sql.length)
            console.log("Message envoyé "+msg_sql+"\n");
            res = db.exec(msg_sql);
            //msg_sql est un array
            iterateur = res.entries();
            for (let lettre of iterateur) {
            console.log(lettre);
            }
            console.log("msg_sql = "+res);
            message.reply();
        }catch(e){
            message.reply("Erreur "+e);
        }
    }
});

// Log our bot in
client.login(token);

