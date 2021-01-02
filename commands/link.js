const Discord = require('discord.js');

module.exports = {
    execute(client, message, args) {

        let bicon = message.guild.iconURL();
        let botembed = new Discord.MessageEmbed()
            .setTitle("Invite link")
            .setColor("#a83232")
            .setThumbnail(bicon)
            .addField("link", "https://discord.gg/eqyenKJgeQ")
            .addField("***PRO TIP:***", "dont spam this command!")
            message.channel.send(botembed);

    },
    description: "send server invite link"
}