/**
 * @author Dorian Thivolle and Jarne Valkneers
 * @package Aftershock Discord Bot
 */



// module requires
const Discord = require("discord.js");

// new client instance
const client = new Discord.Client({ disableEveryone: true });

// local requires
const config = require("./_config/config.js");


// fs
const fs = require('fs');


const Enmap = require('enmap');





///////////////////////////////////////////////////////

client.warns = new Enmap({name: "warn"});
client.profiles = new Enmap({name: "profiles"});
client.muted = new Enmap({name: "muted"});


client.mainColor = "#ff0000";
client.prefix = config.prefix;


client.isDev = authorId => config.developers.includes(authorId);

client.muteMember = async (message, member, duration=0, durationUnity='minutes') => {
    let mutedRole = message.guild.roles.cache.find(r => r.name === 'muted');

    // muted role does not exist : create it
    if(!mutedRole) {
        await message.guild.roles.create({
            data: {
                name: 'muted',
                color: '#607d8b',
                position: message.guild.roles.cache.size - 5
            }
        });

        mutedRole = message.guild.roles.cache.find(c => c.name === "muted");
    }

    // then add this role to the member, and remove his member role

    if(member.roles.cache.has(mutedRole.id)) {
        return message.channel.send("This member already has the muted role !");
    }

    const memberRole = message.guild.roles.cache.find(r => r.name === 'member');
      
    // add muted role & remove member role
    await member.roles.add(mutedRole.id);
    if(memberRole) await member.roles.remove(memberRole.id);
            
    const embed = new Discord.MessageEmbed()
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setColor(0xe74c3c)
        .setTitle("Someone has been muted")
        .setDescription(`**${member.user.tag}** is now muted ${(duration > 0)? `for ${duration} ${durationUnity + ((duration > 1)? 's' : '')}`:''} !`);
    
    message.channel.send(embed);

    // if explicit duration
    if(duration > 0) {
        if(durationUnity === 'hour')     duration *= 3600000;
        else if(durationUnity === 'day') duration *= 86400000;
        else /* minutes by default */    duration *= 60000;

        client.muted.set(member.user.id, Date.now() + duration);
    }
};



client.unmuteMember = async (member, guild, message=null) => {
    const mutedRole = guild.roles.cache.find(r => r.name === 'muted');

    if(mutedRole) {
        const memberRole = guild.roles.cache.find(r => r.name === 'member');

        await member.roles.remove(mutedRole.id);
        if(memberRole) await member.roles.add(memberRole.id);
    }
};

///////////////////////////////////////////////////////





















///////////////////////////////////////////////////////

client.commands = new Discord.Collection();

const loadAllCommands = () => {
    const folder = './commands';

    fs.readdir(folder, (err, files) => {
        files.forEach(file => {
            if(file.endsWith('.js')) {

                const cmdName = file.replace('.js', '');

                const cmd = require(`${folder}/${file}`);
                
				client.commands.set(cmdName, cmd);
				
				delete require.cache[require.resolve(`${folder}/${file}`)];
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

    const guild = client.guilds.cache.get(config.serverId);

    // check every 5 minutes if there need to unmute someone
    const checkMuted = () => {
        client.muted.map((endTime, memberId) => {
            // member can be unmuted
            if(Date.now() >= endTime) {
                client.unmuteMember(guild.members.cache.get(memberId), guild);
                client.muted.delete(memberId);
            }
        });
    };

    checkMuted();
    client.setInterval(checkMuted, 300000);
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

        if(client.commands.has(command) && typeof client.commands.get(command).execute === 'function') {
            client.commands.get(command).execute(client, message, args);
        }

        else message.channel.send(':x: Unknown command');
    }
});










// when someone joins a server
client.on("guildMemberAdd", member => {
    console.log(`${member.displayName} joined the server ${member.guild.name}`);

    let welcomechannel = member.guild.channels.cache.find(channel => channel.name == "home");

    const embed = new Discord.MessageEmbed()
        .setColor(client.mainColor)
        .setTitle("Someone has joined us !")
        .setDescription(`LAOD THE GUNS**${member.user.tag}** has invaded our server!`)
        .setTimestamp();

    if(welcomechannel) welcomechannel.send(embed);

    /* let role = member.guild.roles.cache.find(role => role.name == 'member');

    if(role && !member.roles.cache.has(role.id)) {
        member.roles.add(role);
    } */
});


// when someone joins a server
client.on("guildMemberAdd", member => {
    console.log(`${member.displayName} joined the server ${member.guild.name}`);

    let welcomechannel = member.guild.channels.cache.find(channel => channel.name == "home");

    const embed = new Discord.MessageEmbed()
        .setColor(client.mainColor)
        .setTitle("Someone has joined!")
        .setDescription(`LAOD THE GUNS**${member.user.tag}** has invaded our server!`)
        .setTimestamp();

    if(welcomechannel) welcomechannel.send(embed);
});


// when someone quits a server
client.on("guildMemberRemove", member => {
    console.log(`${member.displayName} left the server ${member.guild.name}`);

    let welcomechannel = member.guild.channels.cache.find(channel => channel.name == "home");

    const embed = new Discord.MessageEmbed()
        .setColor(client.mainColor)
        .setTitle("Someone has quit !")
        .setDescription(`GOOD BYE **${member.user.tag}** has bailed on the server!`)
        .setTimestamp();

    if(welcomechannel) welcomechannel.send(embed);
});














// login
client.login(config.token);