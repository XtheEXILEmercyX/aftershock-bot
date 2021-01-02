const Discord = require('discord.js');

module.exports = {
    execute(client, message, args) {
        
        const embed = new Discord.MessageEmbed()
            .setColor(client.mainColor)
            .setTitle("clear");

         //looks if you haev the premission (manage_messages)
         if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send('you dont have the premision ***Administrator!***');

         let deleteAmount;

            //says that have have to tell the bot how manny messages he has to delete
         if (isNaN(args[0]) || parseInt(args[0]) <= 0) { return message.reply('pleas put a number!') }
 
            //say max of messages you can delete
         if (parseInt(args[0]) > 100) {
             //send message when you try to delete to mutch messages at once
             return message.reply('You can only delete 100 message at a time!')
         } else {
             deleteAmount = parseInt(args[0]);
         }
            message.channel.bulkDelete(deleteAmount + 0, true);

            let botembed = new Discord.MessageEmbed()
            .setTitle("clear messages")
            .setColor("#a83232")
            .setDescription(`**successfully** Cleared ***${deleteAmount}*** Messages!`)
            message.channel.send(botembed);
         
            
    },
    description: "clears messages (admin only)"
}
