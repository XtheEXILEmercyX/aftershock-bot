const admin = require('../utils.js');
const Discord = require('discord.js');

module.exports = {
    execute: (message, args) => {
        if (!admin(message.member)) return message.channel.send('You can\'t use this command.');

        if (args.length == 0) return message.channel.send('You have to mention a server member.');
        //a!kick <@user> <reason>
        let memberId = args[0].replace(/<@(&|!)?(\d+)>/, '$2');

        let kUser = message.guild.members.cache.get(memberId);

        if (!kUser) message.channel.send("Can't find member !");

        let kReason = (args.length > 1) ? args.splice(1).join(" ") : 'No reason';

        if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("YOUR NOT AN ADMIN DON'T TRY TO USE COMMANDS THAT ARE NOT MADE FOR YOUR ROLE GO READ SERVER RULES AGAIN !!!");
        if (kUser.hasPermission("KICK_MEMBERS")) return message.channel.send("that member can't be kicked !");

        let kickEmbed = new Discord.MessageEmbed()
            .setTitle("👉🚪 Kick")
            .setColor("#fca503")
            .addFields(
                { name: "Kicked User", value: `${kUser} with ID: \`${kUser.id}\`` },
                { name: "Kicked By", value: `${message.author} with ID: \`${message.author.id}\`` },
                { name: "Reason", value: kReason },
                { name: "Channel", value: message.channel },
                { name: "Time", value: message.createdAt }
            );

        let kickChannel = message.guild.channels.cache.find(channel => channel.name == "incidents");
        if (!kickChannel) return message.channel.send("Can't find incidents channel!");

        kUser.kick(kReason).then(() => {
            message.channel.send('Member kicked.');
            kickChannel.send(kickEmbed);
        }).catch(error => {
            console.log("Cannot kick " + kUser.user.username + '#' + kUser.user.discriminator, error);
            message.channel.send('An error occured.');
        });
    },

    description: "Kick a server member (admins only)"
};