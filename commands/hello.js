const Discord = require ('discord.js');

module.exports = {
    execute(client, message, args) {

        const embed = new Discord.MessageEmbed()
        let botembed = new Discord.MessageEmbed()
        //title of embed
        .setTitle("Greetings")
        //color of embed
        .setColor("#a83232")
        //description of embed
        .setDescription("Hello sir, hope your day is going well!")
        //send embed
        message.channel.send(botembed);

    },
    //description of command
    description: "Says hello"
};