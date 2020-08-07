// module requires
const Discord = require("discord.js");

// new client instance
const bot = new Discord.Client({ disableEveryone: true });

// local requires
const config = require("./_config/config.js");


// fs
const fs = require('fs');

//
let objExp = module.exports = {};
objExp.bot = bot;







///////////////////////////////////////////////////////

const commands = {};

const loadAllCommands = () => {
    const folder = './commands';

    fs.readdir(folder, (err, files) => {
        files.forEach(file => {
            if(file.endsWith('.js')) {

                const cmdName = file.replace('.js', '');

                const cmd = require(`${folder}/${file}`);
                
                commands[cmdName] = cmd;
            }
        });
    });
};

loadAllCommands();

///////////////////////////////////////////////////////









// when bot beeing connected
bot.on('ready', () => {
    bot.user.setActivity('a!help||a!commands', { type: 'LISTENING' });
    console.log(`logged in as ${config.name} bot`);
});







// when someone send message in a channel the bot has access to 
bot.on("message", message => {
    // does not accept bot messages, in private messages, and messages that does not starts with prefix
    if (message.author.bot || message.channel.type === "dm") return;

    // dev
    if(message.content.startsWith('dev!') && config.developers.includes(message.author.id)) {
        try {
            bot.emit(message.content.slice(4), message.member);
        } catch(error) {
            console.log(error);
        }
    }

    // user command
    else if(message.content.startsWith(config.prefix)) {
        let content = message.content.substr(config.prefix.length).split(' ');
        
        let command = content[0];
        let args = content.slice(1);

        if(command in commands) commands[command].execute(message, args);
        else message.channel.send(':x: Unknown command');
    }
});










// when someone joins a server
bot.on("guildMemberAdd", member => {
    console.log(`${member.displayName} joined the server ${member.guild.name}`);

    let welcomechannel = member.guild.channels.cache.find(channel => channel.name == "home");
    welcomechannel.send(`LOOK OUT EVERYONE! ${member.displayName} has joined the party`);

    let role = member.guild.roles.cache.find(role => role.name == 'member');

    if(role && !member.roles.cache.has(role.id)) {
        member.roles.add(role);
    }
});





// when someone quits a server
bot.on("guildMemberRemove", member => {
    console.log(`${member.displayName} left the server ${member.guild.name}`);

    let welcomechannel = member.guild.channels.cache.find(channel => channel.name == "home");
    welcomechannel.send(`GOOD RIDDANCE! ${member.displayName} has bailed on the server!`);
});














// login
bot.login(config.token);