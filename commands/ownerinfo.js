const Discord = require('discord.js');

module.exports = {
    execute(client, message, args) {
        // a!botinfo
        let bicon = client.user.displayAvatarURL();
        let botembed = new Discord.MessageEmbed()
            .setTitle("owner Information")
            .setColor("#a83232")
            .setThumbnail(bicon)
            .addField("Bot Name", client.user.username)
            .addField("owner", "master jett #1623")
            .addField("information", "if you need help with the client or you have some idea's pleas contact me by joining my server!")
            .addField("owner's server", "https://discord.gg/6AfhV9R");
        message.channel.send(botembed);
    },

    description: "Gives the owner basic informations"
};