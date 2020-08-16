const { admin } = require('../utils.js');
const Discord = require('discord.js');

module.exports = {
    async execute(client, message, args) {
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

            const warnEmbed = new Discord.MessageEmbed()
                .setTitle("❗ warn")
                .setColor(client.mainColor)
                .addFields(
                    { name: "warned User",    value: `${user} with ID: \`${user.id}\`` },
                    { name: "warned By",      value: `${message.author} with ID: \`${message.author.id}\`` },
                    { name: "Channel",        value: message.channel },
                    { name: "Time",           value: message.createdAt },
                    { name: "message",        value: message.url }
                );

            let reportschannel = message.guild.channels.cache.find(channel => channel.name == 'warns');
            if(reportschannel) reportschannel.send(warnEmbed);  


            this.applyPunishment(client, message, user, client.warns.get(message.guild.id, user.id));
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

    async applyPunishment(client, message, user, nWarn) {
        let msg;

        switch(nWarn) {
            case 1:
                // mute 30 mins
                msg = `${user} hello there, you just got muted for 30 minutes in this period of time you're not allowed to text or talk in the server. Thank you for the support.`;

                user.send(msg).catch(e => { // if it can't send a DM to the member, then send the message in the server
                    let channel = message.guild.channels.cache.find(c => /home/.test(c.name)); // if possible home channel
                    if(!channel) channel = message.channel; // if not exists, take the channel where the message has been sent

                    channel.send(msg);
                });

                client.muteMember(message, message.guild.members.cache.get(user.id), 30, 'minute');
                break;

            case 2:
                // mute 1 day
                msg = `${user} Hello there, you just got muted for a time of 24hours in this period of time your not allowed to text or talk in the server thank you for the support.`

                user.send(msg).catch(e => { // if it can't send a DM to the member, then send the message in the server
                    let channel = message.guild.channels.cache.find(c => /home/.test(c.name)); // if possible home channel
                    if(!channel) channel = message.channel; // if not exists, take the channel where the message has been sent

                    channel.send(msg);
                });

                client.muteMember(message, message.guild.members.cache.get(user.id), 1, 'day');
                break;

            case 3:
                msg = `${user} Hello, you just got warned for the third time be careful ! Your next warn will result into an ban. Go check the server rules and if you have any question feel free to dm ( master jett#1623) thank you for the support`;
                // DM
                user.send(msg).catch(e => { // if it can't send a DM to the member, then send the message in the server
                    let channel = message.guild.channels.cache.find(c => /home/.test(c.name)); // if possible home channel
                    if(!channel) channel = message.channel; // if not exists, take the channel where the message has been sent

                    channel.send(msg);
                });
                break;

            case 4:
                // ban
                if(!message.guild.members.cache.get(user.id).bannable) {
                    message.channel.send("I cannot ban this member.");
                }
                
                else {
                    msg = `${user} Hello there, you got banned from the server because you probably broke some rules so now you're stuck with a ban for 7 days. After this period of time you can always rejoin by using this link :\nhttps://discord.gg/bWJ4eYj\nbut be aware you still hold your 4 warns so if you get another one you will be banned permanently.`;
                    
                    await user.send(msg).catch(e => console.error("Cannot DM this user"));

                    message.guild.members.cache.get(user.id).ban({ban: 7}) // ban for 7 days
                        .then(() => {
                            message.channel.send(`I've banned ${user.tag} because he has been warned 4 times.`);
                        })
                        .catch(e => message.channel.send("I can't ban this member for an obscure reason..."));
                }
                break;

            case 5:
                msg = `${user} sorry your are permanently banned from the Aftershock Gaming server ! You kept misbehaving so there will be no way to rejoin us !!! (If you thik this was a mistake feel free to contact master jett"1623)`;
                
                if(!message.guild.members.cache.get(user.id).bannable) {
                    message.channel.send("I cannot ban this member.");
                }

                else {
                    await user.send(msg).catch(e => console.error("Cannot dm this user"))

                    message.guild.members.cache.get(user.id).ban()
                        .then(() => {
                        })
                        .catch(e => message.channel.send("I can't ban this member for an obscure reason..."));      
                }
                break;
        }
    },

    description: "Warn a server's member"
};