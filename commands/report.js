const { admin } = require('../utils.js');
const Discord = require('discord.js');
module.exports = {
    execute: (client, message, args) => {
        //!report <@user> <reason>

        if (args.length == 0) return message.channel.send('You need to mention a server member.');

        let memberId = args[0].replace(/<@(&|!)?(\d+)>/, '$2');

        let rUser = message.guild.members.cache.get(memberId);
        if (!rUser) return message.channel.send("Couldn't find this member on this server !");


        let reason = (args.length > 1) ? args.splice(1).join(" ") : 'No reason';

        let reportEmbed = new Discord.MessageEmbed()
            .setTitle("❗ Report")
            .setColor("#a83232")
            .addFields(
                { name: "Reported User",    value: `${rUser} with ID: \`${rUser.id}\`` },
                { name: "Reported By",      value: `${message.author} with ID: \`${message.author.id}\`` },
                { name: "Reason",           value: reason },
                { name: "Channel",          value: message.channel },
                { name: "Time",             value: message.createdAt },
                { name: "message",          value: message.url}
            );

        let reportschannel = message.guild.channels.cache.find(channel => channel.name == 'reports');
        if (!reportschannel) return message.channel.send("Couldn't find reports channel !");

        reportschannel.send(reportEmbed);
        message.channel.send('User reported.\nPro tip: if you spam this command you will be warned.');
    },

    description: "Report a server member or bot"
};