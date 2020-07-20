// module requires
const Discord = require("discord.js");

// new client instance
const bot = new Discord.Client({disableEveryone: true});

let objExp = module.exports = {};
objExp.bot = bot;

// /!\ need to be before

bot.guilds.cache.each(guild => console.log(guild.name, guild.id));

// local requires
const config = require("./_config/config.js"); 
const commands = require("./commands.js");

// when bot beeing connected
bot.on('ready', () => {
    bot.user.setActivity('a!help||a!commands', {type: 'LISTENING'});
    console.log(`logged in as ${config.name} bot.`);
});

// when someone send message in a channel the bot has access to 
bot.on("message", message => {
    // does not accept bot messages, in private messages, and messages that does not starts with prefix
    if(message.author.bot || message.channel.type === "dm") return;
    
    else if(message.content.startsWith('dev!') && config.developers.includes(message.author.id)) {
        try {bot.emit(message.content.slice(4), message.member);} catch(error) {console.log(error);}
    }

    if(!message.content.startsWith(config.prefix)) return;

    // split message content
    let messageArray = message.content.substring(config.prefix.length).split(" ");
    let cmd = messageArray[0]; // get command
    let args = messageArray.slice(1); // get arguments

    if(cmd in commands) {
        commands[cmd].execute(message, args);
    } else {
        message.channel.send('Unknown command'); 
    }
});

bot.on("guildMemberAdd", member => {
    console.log(`${member.displayName} joined the server ${member.guild.name}`);

    let welcomechannel = member.guild.channels.cache.find(channel => channel.name == "home");
    welcomechannel.send(`LOOK OUT EVERYONE! ${member.displayName} has joined the party`);

    let role = member.guild.roles.cache.find(role => role.name == 'member');

    if(role && !member.roles.cache.has(role.id)) {
        member.roles.add(role);
    }
});


bot.on("guildMemberRemove", member => {
    console.log(`${member.displayName} left the server ${member.guild.name}`);

    let welcomechannel = member.guild.channels.cache.find(channel => channel.name == "home");
    welcomechannel.send(`GOOD RIDDANCE! ${member.displayName} has bailed on the server!`);
});




// login
bot.login(config.token);