const Discord = require('discord.js');

module.exports = {
    execute(client, message, args) {
    

        let memberId;

        if(args.length == 0) {
            memberId = message.author.id;
        }

        else {
            memberId = args[0].replace(/<@(&|!)?(\d+)>/, '$2');
        }

        let rUser = message.guild.members.cache.get(memberId);

        if(!rUser) return message.channel.send("Couldn't find this member on this server!");


        let levelsEmbed = new Discord.MessageEmbed()
            .setTitle("❗ Level")
            .setColor(client.mainColor)
            .addFields(
                {name: "Called User",   value: `${rUser} with ID: \`${rUser.id}\``},
                {name: "Called By",     value: `${message.author} with ID: \`${message.author.id}\``},
                {name: "time",          value: message.createdAt},
                {name: "message",       value: message.url}
            );

        let levelschannel = message.guild.channels.cache.find(channel => /level/.test(channel.name));

        if(!levelschannel) {
            levelschannel = message.channel;
        }

        levelschannel.send(levelsEmbed).catch(e => {
            message.channel.send("I can't send message on this channel : " + levelschannel.name);
            console.error(e);
        });

        message.channel.send("Congrats, your reward will be added to your account soon, go check your rank for verification in the <#589836850030575634> Channel.")
        message.channel.send("Pro Tip! Don't spam this command!!!")
    },

   discription: "call when level up"
}