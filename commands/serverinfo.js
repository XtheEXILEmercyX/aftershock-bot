const Discord = require('discord.js');

module.exports = {
    execute: (message, args) => {
        // a!botinfo
        let sicon = message.guild.iconURL();
        let serverembed = new Discord.MessageEmbed()
            .setTitle("Server Information")
            .setColor("#a83232")
            .setThumbnail(sicon)
            .addField("Server Name", message.guild.name)
            .addField("Created On", message.guild.createdAt)
            .addField("You Joined", message.member.joinedAt)
            .addField("Total Members", message.guild.memberCount);

        message.channel.send(serverembed);
    },

    description: "Gives the server basic informations"
};