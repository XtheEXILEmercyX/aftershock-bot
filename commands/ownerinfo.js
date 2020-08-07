const bot = require('../index.js').bot;
const Discord = require('discord.js');

module.exports = {
    execute: (message, args) => {
        // a!botinfo
        let bicon = bot.user.displayAvatarURL();
        let botembed = new Discord.MessageEmbed()
            .setTitle("owner Information")
            .setColor("#a83232")
            .setThumbnail(bicon)
            .addField("Bot Name", bot.user.username)
            .addField("owner", "master jett #1623")
            .addField("information", "if you need help with the bot or you have some idea's pleas contact me by joining my server!")
            .addField("owner's server", "https://discord.gg/6AfhV9R");
        message.channel.send(botembed);
    },

    description: "Gives the owner basic informations"
};