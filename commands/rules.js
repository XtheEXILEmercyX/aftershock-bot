const Discord = require('discord.js');

module.exports = {
    execute(client, message, args) {

        let botembed = new Discord.MessageEmbed()
            .setTitle("Rules")
            .setColor("#a83232")
            .addField("***1. No toxicity***", "Includes racism, sexism, homophobia etc...")
            .addField("***2. Advertisements***", "DM advertisements included")
            .addField("***3. No spamming***", "Memes excluded (in <#788515943281721344>)")
            .addField("***4. SFW only***", "This is a sfw community, nfsw profile pictures, posting nfsw memes or any form of such content will result in a warn")
            .addField("***5. Stay on topic in themed channels***", "Be nice, don't try to argue, no slurs, just be nice")
            .addField("***6. Respect other members***", "Be nice to your fellow members.")
            .addField("***7. Report to staff***", "If you see something against the rules or something that makes you feel unsafe, let the staff know. We want this server to be a welcoming space!")
            .addField("***8. English only***", "Please use it.")
            .addField("***9. Enjoy your stay, GLHF***", "Have fun in the server.")
            .setDescription('Make sure to read the rules <#782902923062673460>')
            message.channel.send(botembed);

    },
    description: "send server rules"
}