const { admin } = require('../utils.js');
const Discord = require('discord.js');

module.exports = {
    execute: async (client, message, args) => {
        if(!admin(message.member) && !client.isDev(message.author.id)) {
            return message.channel.send("You don't are an administrator !");
        }


        const user = message.mentions.users.first();

        if(!user || !message.guild.members.cache.get(user.id)) {
            return message.channel.send("You need to mention a member on this server");
        }


        await client.warns.ensure(message.guild.id, 0, user.id);
        

        // just warn him
        if(args.length === 1) {
            await client.warns.inc(message.guild.id, user.id);

            const embed = new Discord.MessageEmbed()
                .setTitle("Warn !")
                .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                .setDescription(`You warn ${user} ! He has now ${client.warns.get(message.guild.id, user.id)} warns !`)
                .setThumbnail(user.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                .setColor(0xe74c3c);

            message.channel.send(embed);
        }

        // 2 args
        else if(args.length === 2) {
            // remove all warns of a member
            if(['clear', 'clean'].includes(args[1])) {
                await client.warns.set(message.guild.id, 0, user.id);

                const embed = new Discord.MessageEmbed()
                    .setTitle("Warns cleaned !")
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                    .setDescription(`You cleaned the warns of ${user} !`)
                    .setThumbnail(user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                    .setColor(0xe74c3c);

                message.channel.send(embed);
            }

            // get warn's number of a member
            else if(['info', 'infos'].includes(args[1])) {
                const embed = new Discord.MessageEmbed()
                    .setTitle("Warn informations")
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                    .setDescription(`${user} he has ${client.warns.get(message.guild.id, user.id)} warns.`)
                    .setThumbnail(user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                    .setColor(0xe74c3c);
                
                message.channel.send(embed);
            }
        }

        // > 2 arguments passed
        else {
            message.channel.send("Wrong number of argument passed");
        }
    },

    description: "Warn a server's member"
};