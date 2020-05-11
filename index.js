// module requires
const Discord = require("discord.js");

// new client instance
const bot = new Discord.Client({disableEveryone: true});

let objExp = module.exports = {};
objExp.bot = bot;

// /!\ need to be before

// local requires
const config = require("./config.js");
const commands = require("./commands.js");


// when bot beeing connected
bot.on('ready', () => {
    bot.user.setActivity('watching over the server', {type: 'STREAMING'});
    console.log(`logged in as ${config.name} bot.`);
})

// when someone send message in a channel the bot has access to
bot.on("message", message => {
    // does not accept bot messages, in private messages, and messages that does not starts with prefix
    if(message.author.bot || message.channel.type === "dm" || !message.content.startsWith(config.prefix)) return;
    
    // split message content
    let messageArray = message.content.substring(config.prefix.length).split(" ");
    let cmd = messageArray[0]; // get command
    let args = messageArray.slice(1); // get arguments

    // find command to execute
    switch(cmd) {
        case 'hello':       commands.hello(message, args); break;
        case 'report':      commands.report(message, args); break;
        case 'serverinfo':  commands.serverinfo(message, args); break;
        case 'botinfo':     commands.botinfo(message, args); break;
        case 'kick':        commands.kick(message, args); break;
        case 'ban':         commands.ban(message, args); break;
/*      case 'tempmute':    commands.tempmute(message, args); break;
        case 'removerole':  commands.removerole(message, args); break;
        case 'addrole':     commands.addrole(message, args); break;
        case 'warn':        commands.warn(message, args); break;
        case 'doggo':       commands.doggo(message, args); break;
        case 'cat':         commands.cat(message, args); break;
        case 'help':        commands.help(message,args); break;
        case 'empty':       commands.empty(message,args); break;
        case 'empty':       commands.empty(message,args); break;
        case 'empty':       commands.empty(message,args); break;
        case 'empty':       commands.empty(message,args); break;
        case 'empty':       commands.empty(message,args); break; */

        default: message.channel.send('Unknown command');
    }
});
/*
bot.on("guildMemberAdd", async member => {
	try {
		console.log(`${member.id} joined the server!`);
    
		let welcomechannel = message.guild.member(message.guild.channels.find(`name`, "home"));
		welcomechannel.send(`LOOK OUT EVERYONE! ${member.id} has joined the party`)
	}
	catch
    {" "}
});

bot.on("guildMemberRemove", async member => {
	try {
		console.log(`${member.id} left the serevr!`);

		let welcomechannel = message.guild.member(message.guild.channels.find(`name`, "home"));
		welcomechannel.send(`GOOD RIDDANCE! ${member.id} has bailed on the server!`);
	}
    catch 
    {" "}
});
*/
// login
bot.login(config.token);