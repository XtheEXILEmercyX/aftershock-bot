const Discord = require('discord.js');

module.exports = {
    execute: (client, message, args) => {

        const embed = new Discord.MessageEmbed()
            .setColor(client.mainColor);

        const mention = message.mentions.users.first();
        
        // no arguments : show own profile
        if(args.length === 0) {
            // has a profile
            if(client.profiles.has(message.author.id)) {
                
                const profile = client.profiles.get(message.author.id);

                for(const field of Object.keys(profile)) {
                    embed.addField(field, profile[field]);
                }

                embed.setThumbnail(message.author.displayAvatarURL({dynamic: true}));
                
            }

            // hasn't a profile
            else {
                embed.setDescription("You don't have a profile :(");
            }
        }


        // mentionned someone - show his profile
        else if(args.length === 1 && mention || client.users.cache.get(args[0])) {
            let member = message.guild.members.cache.get(message.mentions.users.first());
            
            if(member) member = member.id;
            else member = client.users.cache.get(args[0]);

            // member not found
            if(!member) {
                embed.setDesrcription("I can't find this member on the server");
            }

            // member found
            else {
                if(client.profiles.has(member.user.id)) {
                    const profile = client.profiles.get(member.user.id);

                    for(const field of Object.keys(profile)) {
                        embed.addField(field, profile[field]);
                    }

                    embed.setThumbnail(member.user.displayAvatarURL({dynamic: true}));
                } else {
                    embed.setDescription("This member does not have a profile. It's too bad :(");
                }
            }
        }


        // at least one argument - add / edit field
        else if(args[0] === 'set') {

            client.profiles.ensure(message.author.id, {});
            
            const arguments = formatRequest(args.slice(1).join(' '));
            
            let fields = {};

            if(arguments.length % 2 !== 0 || arguments.length === 0) {
                embed.setDescription(`You passed ${arguments.length} arguments, but you have to give a value to each field and at least one :(`);
            } else {

                for(let i=0; i < arguments.length; i += 2) {
                    fields[arguments[i]] = arguments[i+1];
                }

                for(let field of Object.keys(fields)) {
                    client.profiles.set(message.author.id, fields[field], field);
                }

                embed.setDescription(":white_check_mark: Profile updated");

            }
        }

        // remove field
        else if(args[0] === 'rub') {
            if(arguments.length > 0) {
                embed.setDescription("You need to precise which field you want to remove");
            }

            else {
            
                client.profiles.ensure(message.author.id, {});

                const arguments = formatRequest(args.slice(1).join(' '));

                let found = [], notFound = [];

                for(const field of arguments) {
                    if(client.profiles.has(message.author.id, field)) {
                        found.push(field);

                        client.profiles.delete(message.author.id, field);
                    }

                    else {
                        notFound.push(field);
                    }
                }

                if(found.length > 0) {
                    embed.addField("Deleted fields :", found.join(', '));
                }

                if(notFound.length > 0) {
                    embed.addField("Not found fields :", notFound.join(', '));
                }


                if(client.profiles.get(message.author.id) === {}) {
                    client.profiles.delete(message.author.id);

                    embed.setDescription("You don't have any field : profile deleted");
                }
            }
        }

        else {
            embed.setDescription("Bad arguments given.");
        }


        message.channel.send(embed);
    },

    description: "Change / Show your profile informations !"
};




const formatRequest = message => {
    // remove early and end spaces
    message = message.trim();

    // remove multiple spaces
    message = message.replace(/\s+/g, ' ');
    
    // remove line breaks for the next instructions
    message = message.replace('\n', ' ');

    // remove spaces between quotes and other chars
    message = message.replace(/(?!")(.)\s+"/g, '$1"').replace(/"\s+(?!")(.)/g, '"$1');

    // transform "strings" separator from space to line break
    message = message.replace(/" "/g, '"\n"');
    

    // split the string where there're line breaks
    let arrayMessage = message.split('\n');
    
    // remove every quotes
    arrayMessage = arrayMessage.map(a => a.replace(/"/g, ''));

    if(arrayMessage.join('').trim() === '') return [];

    return arrayMessage;
}