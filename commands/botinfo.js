const Discord = require('discord.js');

module.exports = {
    execute: (client, message, args) => {
        // a!botinfo
        let bicon = client.user.displayAvatarURL();
        let botembed = new Discord.MessageEmbed()
            .setTitle("Bot Information")
            .setColor(client.mainColor)
            .setThumbnail(bicon)
            .addField("Bot Name", client.user.username)
            .addField("Created On", client.user.createdAt)
            .addField("server", message.guild.name)
        message.channel.send(botembed);
    },

    description: "Gives the client basic informations"
};