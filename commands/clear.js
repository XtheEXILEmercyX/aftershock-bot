const Discord = require('discord.js');

module.exports = {
    execute(client, message, args) {
        
        const embed = new Discord.MessageEmbed()
            .setColor(client.mainColor)
            .setTitle("clear");

         //looks if you haev the premission (manage_messages)
         if (!message.member.permissions.has("VIEW_AUDIT_LOG")) return message.channel.send('you dont haev the premisions manage messages!');

         let deleteAmount;
 
         if (isNaN(args[0]) || parseInt(args[0]) <= 0) { return message.reply('pleas put a number!') }
 
         if (parseInt(args[0]) > 100) {
             return message.reply('You can only delete 100 message at a time!')
         } else {
             deleteAmount = parseInt(args[0]);
         }
            message.channel.bulkDelete(deleteAmount + 1, true);
            message.reply(`**successfully** Deleted ***${deleteAmount}*** Messages.`)
         
            
    }
}
