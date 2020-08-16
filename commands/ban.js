const admin = require('../utils.js');
const Discord = require('discord.js');

module.exports = {
    execute(client, message, args) {
        // a!ban <@user> <reason>
        if (!admin(message.member)) return message.channel.send('You can\'t use this command.');

        if (args.length == 0) return message.channel.send('You have to mention a server member.');

        let memberId = args[0].replace(/<@(&|!)?(\d+)>/, '$2');

        let bUser = message.guild.members.cache.get(memberId);

        if (!bUser) message.channel.send("Can't find member !");

        let bReason = (args.length > 1) ? args.splice(1).join(" ") : 'No reason';

        if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("YOUR NOT AN ADMIN DON'T TRY TO USE COMMANDS THAT ARE NOT MADE FOR YOUR ROLE GO READ SERVER RULES AGAIN !!!");
        if (bUser.hasPermission("BAN_MEMBERS")) return message.channel.send("that member can't be banned !");

        let banEmbed = new Discord.MessageEmbed()
            .setTitle("👉🚪 BAN (7 days)")
            .setColor(client.mainColor)
            .addFields(
                { name: "banned User", value: `${bUser} with ID: \`${bUser.id}\`` },
                { name: "banned By", value: `${message.author} with ID: \`${message.author.id}\`` },
                { name: "Reason", value: bReason },
                { name: "Channel", value: message.channel },
                { name: "Time", value: message.createdAt }
            );

        let banChannel = message.guild.channels.cache.find(channel => channel.name == "incidents");
        if (!banChannel) return message.channel.send("Can't find incidents channel!");

        bUser.ban({ days: 7, reason: bReason }).then(() => {
            message.channel.send('Member banned.');
            banChannel.send(banEmbed);
        }).catch(error => {
            console.log("Cannot ban " + bUser.user.tag, error);
            message.channel.send('An error occured.');
        });
    },

    description: "Ban a server member (admins only)"
};