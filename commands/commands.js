const Discord = require('discord.js');

module.exports = {
    execute(client, message, args) {
        
        const embed = new Discord.MessageEmbed()
            .setColor(client.mainColor)
            .setTitle("Commands");

        // enumerating al commands
        if(args.length === 0) {
            // array of commands name
            const commands = Array.from(client.commands.keys()).filter(c => c.hidden !== true);

            embed.setDescription(`do \`${client.prefix}commands commandName\` to have the description of a command.\n\n` + commands.map(c => '`' + c + '`').join(', '));

        }

        // get details of a command
        else {
            const cmd = args[0];

            embed.addField('Command :', cmd);

            if(!client.commands.has(cmd)) {
                embed.setDescription("Command not found");
            }

            else {
                embed.addField('Description', client.commands.get(cmd).description);
            }
        }

        message.channel.send(embed);

    }
}