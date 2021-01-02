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
            .addField("owner", "TFWMasterJett#1623")
            .addField("information", "Administrator bot made for moderating an server")
            .addField("owner's server", "https://discord.gg/eqyenKJgeQ");
        message.channel.send(botembed);
    },

    description: "Gives the owner basic informations"
};