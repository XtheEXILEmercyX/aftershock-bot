const Discord = require('discord.js');

module.exports = {

    execute(client, message, args) {
        
        let botembed = new Discord.MessageEmbed()
            .setTitle("Esport")
            .setColor("#a83232")
            .setDescription("<@&788511851545755648>")
            .addField("***top***", "<@292557663873794050>")
            .addField("***jungle***", "<@418422332210675714>")
            .addField("***mid***", "<@395980281695305729>")
            .addField("***adc***", "<@531799714589442068>")
            .addField("***support***", "<@202923029758607360>")
            message.channel.send(botembed);

    },
    description: "show members of tfw"
}