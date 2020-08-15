// module requires
const Discord = require("discord.js");

// new client instance
const client = new Discord.Client({ disableEveryone: true });

// local requires
const config = require("./_config/local.config.js");


// fs
const fs = require('fs');


const Enmap = require('enmap');




client.warns = new Enmap({name: "warn"});
client.profiles = new Enmap({name: "profiles"});


client.mainColor = "#ff0000";


client.isDev = authorId => config.developers.includes(authorId);



///////////////////////////////////////////////////////

client.commands = {};

const loadAllCommands = () => {
    const folder = './commands';

    fs.readdir(folder, (err, files) => {
        files.forEach(file => {
            if(file.endsWith('.js')) {

                const cmdName = file.replace('.js', '');

                const cmd = require(`${folder}/${file}`);
                
                client.commands[cmdName] = cmd;
            }
        });
    });
};

loadAllCommands();

///////////////////////////////////////////////////////









// when bot beeing connected
client.on('ready', () => {
    client.user.setActivity(`${config.prefix}help | ${config.prefix}commands`, { type: 'LISTENING' });
    console.log(`logged in as ${config.name} bot`);
});







// when someone send message in a channel the bot has access to 
client.on("message", message => {
    // does not accept client messages, in private messages, and messages that does not starts with prefix
    if (message.author.bot || message.channel.type === "dm") return;

    // dev
    if(message.content.startsWith('dev!') && config.developers.includes(message.author.id)) {
        try {
            client.emit(message.content.slice(4), message.member);
        } catch(error) {
            console.log(error);
        }
    }

    // user command
    else if(message.content.startsWith(config.prefix)) {
        let content = message.content.substr(config.prefix.length).trim().split(' ');
        
        let command = content[0];
        let args = content.slice(1);

        if(command in client.commands) {
            client.commands[command].execute(client, message, args);
        }

        else message.channel.send(':x: Unknown command');
    }
});










// when someone joins a server
client.on("guildMemberAdd", member => {
    console.log(`${member.displayName} joined the server ${member.guild.name}`);

    const embed = Discord.MessageEmbed()
        .setColor(client.mainColor)
        .setTitle("Someone has joined us !")
        .setDescription(`LAOD THE GUNS**${member.user.username}#${member.user.tag}** Has invaded our server!`)
        .setTimestamp();
        
    welcomechannel.end(embed);

    let role = member.guild.roles.cache.find(role => role.name == 'member');

    if(role && !member.roles.cache.has(role.id)) {
        member.roles.add(role);
    }
});





// when someone quits a server
client.on("guildMemberRemove", member => {
    console.log(`${member.displayName} left the server ${member.guild.name}`);

    let welcomechannel = member.guild.channels.cache.find(channel => channel.name == "home");

    const embed = Discord.MessageEmbed()
        .setColor(client.mainColor)
        .setTitle("Someone has quit !")
        .setDescription(`GOOD BYE **${member.user.username}#${member.user.tag}** has bailed on the server!`)
        .setTimestamp();

    welcomechannel.send(embed);
});














// login
client.login(config.token);