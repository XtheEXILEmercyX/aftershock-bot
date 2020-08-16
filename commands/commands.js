const Discord = require('discord.js');

module.exports = {
    execute(client, message, args) {
        // array of commands name
        const commands = Array.from(client.commands.keys());

        const embed = new Discord.MessageEmbed()
            .setColor(client.mainColor)
            .setTitle("Commands")
            .setDescription(`do \`${client.prefix}commands commandName\` to have the description of a command.\n\n` + commands.map(c => '`' + c + '`').join(', '));

        message.channel.send(embed);
    }
}