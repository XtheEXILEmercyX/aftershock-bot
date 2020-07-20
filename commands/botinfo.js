const bot = require('./index.js').bot;
const Discord = require('discord.js');

module.exports = {
    execute: (message, args) => {
        // a!botinfo
        let bicon = bot.user.displayAvatarURL();
        let botembed = new Discord.MessageEmbed()
            .setTitle("Bot Information")
            .setColor("#a83232")
            .setThumbnail(bicon)
            .addField("Bot Name", bot.user.username)
            .addField("Created On", bot.user.createdAt)
            .addField("server", message.guild.name)
        message.channel.send(botembed);
    },

    description: "Gives the bot basic informations"
};