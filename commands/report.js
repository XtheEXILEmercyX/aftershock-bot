const { admin } = require('../utils.js');
const Discord = require('discord.js');
module.exports = {
    async execute(client, message, args) {
        //a!report <@user> <reason>

        const user = message.author;
         //sends message to the person that uses the command
            let msg = `Hello ${user}, you recently tried to report a member, your report has been sent to an **admin**, we will try to handel the situation from here, ***thank you for reporting!***`;
        
            //sends message if dm to user fails
            await user.send(msg).catch(e => console.error("Cannot DM this user"));


    
        const userBeingReported = message.mentions.users.first();
        
        let msgToReported = `Hello ${userBeingReported}, you recently got reported an **admin** will look at this situation and will try to handle it as smoothly as possible! `;
        
        //sends message if dm to user fails
        await userBeingReported.send(msgToReported).catch(e => console.error("Cannot DM this user"));
       
        
        //sends message if no user been mentioned
        if (args.length == 0) return message.channel.send('You need to mention a server member.');

        let memberId = args[0].replace(/<@(&|!)?(\d+)>/, '$2');

        //looks for mentioned user
        let rUser = message.guild.members.cache.get(memberId);
        //sends message if user not found
        if (!rUser) return message.channel.send("Couldn't find this member on this server !");
        
        let reason = (args.length > 1) ? args.splice(1).join(" ") : 'No reason';



        let reportEmbed = new Discord.MessageEmbed()
            .setTitle("❗ Report")
            .setColor("#a83232")
            .addFields(
                { name: "Reported User",    value: `${rUser} with ID: \`${rUser.id}\`` },
                { name: "Reported By",      value: `${message.author} with ID: \`${message.author.id}\`` },
                { name: "Reason",           value: reason },
                { name: "Channel",          value: message.channel },
                { name: "Time",             value: message.createdAt },
                { name: "message",          value: message.url}
            );

        let reportschannel = message.guild.channels.cache.find(channel => channel.name == 'reports');
        if (!reportschannel) return message.channel.send("Couldn't find reports channel !");
          

        reportschannel.send(reportEmbed);
        message.channel.send('User reported.\nPro tip: if you spam this command you will be warned.');
    },

    description: "Report a server member or bot"
};