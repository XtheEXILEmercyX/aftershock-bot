const Discord = require("discord.js");

module.exports = {
    execute(client, message, args) {
        if(!client.isDev(message.author.id)) return;

        const guild = client.guilds.cache.get(client.serverId) || message.guild;

        const members = guild.members.cache;

        const inactives = members.filter(member => {
            const timePassed = Date.now() - member.joinedTimestamp;

            // time passed must be at least one week
            return timePassed >= 604800000 && member.roles.cache.size <= 1; // @everyone only
        });

        const embed = new Discord.MessageEmbed()
            .setTitle("Inactive members")
            .addField("Criteria", "Those who don't have role and are here since at least 1 week.")
            .setDescription((inactives.size === 0)? "There's not inactive members !" : inactives.map(member => `\`${member.user.tag}\``).join(', '))
            .setTimestamp();

        if(inactives.size > 0) {
            embed.addField("Instructions :", "Write `yes I want` and I'll kick all these members. If you don't answer under 20s or if you answer `no`, I'll not kick them.");
        }

        message.channel.send(embed);

        const collector = new Discord.MessageCollector(message.channel, msg => msg.author.id === message.author.id, {
            time: 20000
        });

        collector.on('collect', msgCollected => {
            const choice = msgCollected.content.trim().split()[0].toLowerCase();

            // kick them
            if(choice === 'yes i want') {
                collector.stop('kickThemAll');
            }

            // don't kick them
            else if(choice === 'no') {
                collector.stop('letThemAlive');
            }

            // must answer by yes or no
            else {
                message.channel.send("You have to tell me `yes` or `no` !");
            }
        });

        collector.on('end', (collected, reason) => {
            if(reason === 'kickThemAll') {
                message.channel.send("Kick them all !\nWait a second...").then(msg => {
                    let msg2 = "Member you requested me to kick for inactives :\n" + inactives.array().join(', ');

                    let unkickable = [];

                    inactives.map(async member => {
                        if(member.kickable) {
                            await member.user.send(`Hello ${member.user.username}, you have been kick because of your inactivity in the Aftershock Gaming server.\nYou can join back the server thanks this invitation link :\nhttps://discord.gg/bWJ4eYj`).catch(e => e);
                            member.kick(`Inactivity`);
                        }

                        else {
                            unkickable.push(member.user.tag);
                        }
                    });

                    if(unkickable.length > 0) {
                        msg2 += "\nI could not kick this / these member(s) :\n" + unkickable.map(m => `\`${m}\``).join(', ');
                    }

                    client.users.cache.get('395980281695305729').send(msg2).catch(e => console.log(msg));
                });
            }

            else if(reason) {
                message.channel.send("Okay, you decided to let them alive.");
            }
        });

    },

    hidden: true
};