const Discord = require('discord.js');
const bot = require('./index.js').bot;
const superagent = require("superagent");
const tag = require('./config.js').prefix;
const fs = require("fs");
const ms = require("ms");
const admin = require('./utils.js');

/*

objExp.commands = {
    execute: (message, args) => {
        let embed = new Discord.MessageEmbed()
            .setTitle('commands')
            .setColor(0xdd0000);

        let cmds = Object.keys(objExp);
        let max = (cmds.length < 20) ? cmds.length : 10; // max the 10 first commands. We'll see for a better version another time

        for (let i = 0; i < max; i++) {
            let cmdName = cmds[i];
            embed.addField(`${tag}${cmdName}`, objExp[cmdName].description ? objExp[cmdName].description : 'No description provided');
        }

        message.channel.send(embed);
    },

    description: "show all commands"
}

objExp.tempmute = (message, args) => {
    // a!tempmute <@user> <time 1s/1h/1d>

    if(!admin(message.member)) return message.channel.send('You can\'t use this command.');

    try {
        let tomute = message.member(message.guild.members.cache.get(args[0]));
        if(!tomute) return message.reply("Couldn't find user!");
        if(tomute.hasPremision("MANAGE_MESSAGES")) return message.reply("Can't mute them!");
        let muterole = messsage.guild.roles.find(`name`, "muted");
		if (!muterole)
		    {
			async member => {
				mutrole = await message.guild.createRole({
					name: "muted",
					color: "#00000",
					permissions: []
                });
            };

            message.guild.channels.forEach(async function(channel, id)
			{
			async channel => {
				await channel.overwritePermissions(muterole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            };
            });

			console.log(e.stack);
            let mutetime = args[1];
            if(!mutetime) return message.reply("You didn't specify a time!");

            //create async
         async member => {
            await(tomute.addRole(muterole.id));
            message.reply(`<@${tomute.id} > has been muted for ${ms(ms(mutetime))}`);

            setTimeout(function(){
                tomute.removeRole(muterole.id);
                message.channel.send(`<@${tomute.id}> has been unmuted!`);
            }, ms(mutetime));
        }

        }
	}
	catch (e)
    {

    }
    description: "tempmute an member in this server (admins"
}

objExp.removerole  = (message, args) => {
    // a!removerole <@user> <@role>
    if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("YOU DODN'T HAVE PERMISSION TO USE THIS COMMAND, DODN'T USE COMMANDS THAT ARE NOT MADE FOR YOUR ROLE!!!");
    let rMember = message.member(message.guild.members.cache(args[0]));
    if(!rMember) return message.reply("Couldn't find that user!");
    let role = args.join(" ").slice(22);
    if(!role) return message.reply("specify a role!");
    let gRole = message.guild.roles.find(`name`, role);
    if(!gRole) return message.reply("Couldn't find that role.");

    if(!rMember.roles.has(gRole.id)) return message.reply("They dodn't haev this role!");
    await(rMember.removeRole(gRole.id));

    try{
        rMember.send(`RIP, you lost the role ${gRole.name}`)
    }catch(e){
      message.channel.send(`RIP to <@${rMember.id}>, we removed ${gRole.name}. from them. We tried to DM them, but their DMs are locked.`)
    }

}

objExp.addrole = (message, args) => {
    //a!addrole @user @role
    if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("YOU DODN'T HAVE PERMISSION TO USE THIS COMMAND, DODN'T USE COMMANDS THAT ARE NOT MADE FOR YOUR ROLE!!!");
    let rMember = message.member(message.guild.members.cache.get(args[0]));
    if(!rMember) return message.reply("Couldn't find that user!");
    let role = args.join(" ").slice(22);
    if(!role) return message.reply("specify a role!");
    let gRole = message.guild.roles.find(`name`, role);
    if(!gRole) return message.reply("Couldn't find that role.");

    if(rMember.roles.has(gRole.id)) return message.reply("They already have that role!");
    await(rMember.addRole(gRole.id));

    try{
        rMember.send(`Congrats, you haev been given the role ${gRole.name}`)
    }catch(e){
      message.channel.send(`congrats to <@${rMember.id}>, you have been given the role ${gRole.name}. We tried to DM them, but their DMs are locked.`)
    }
}

objExp.warn = (message, args) => {
    //a!warn @user <reason>
    if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("YOU DODN'T HAVE PERMISSION TO USE THIS COMMAND, DODN'T USE COMMANDS THAT ARE NOT MADE FOR YOUR ROLE!!!");
    let wUser = message.guild.member(message.guild.members.cache.get(args[0]));
    if(wUser) return message.reply("Can't find that user!!!");
    if(wUser.hasPermission("MANAGE_MESSAGES")) return message.reply("They waaaay too kewl!");
    let reason = args.join(" ").slice(22);

    if(!warns[wUser.id]) warns[wUser.id] = {
        warns: 0
    };

    warns[wUser.id].warns++;

    fs.writeFile("./_config/warnings.json", JSON.stringify(warns), (err) => {
       if(err) console.log(err)
    });

    let warnEmbed = new Discord.MessageEmbed()
    .setDiscription("warns")
    .setAuthor(message.author.username)
    .setColor("#a83232")
    .addField("Wared User", `<@${wUser.tag}>`)
    .addField("Warned In", message.channel)
    .addField("Number of Warnings", warns[wUser.id].warns)
    .addField("Reason", reason);

    let warnchannel = message.guild.channels.find(`name`, "incidents");
    if(!warnchannel) return message.reply("Couldn't find channel!");

    warnchannel.send(warnEmbed);

    if(warns[wUser.id].warns == 2){
        let muterole = message.guild.roles.find(`name`, "muted");
        if(!muterole) return message.reply("Cant find role!")

        let mutetime = "1d";
        await(wUser.addRole(muterole.id));
        message.channel.send(`${wUser.tag} has been temporarily muted`);

        setTimeout(function(){
            wUser.removeRole(muterole.id)
            message.reply(`they have been unmuted.`);
        }, ms(mutetime))
    }
    if(warns[wUser.id].warns == 3){
        message.guild.member(wUser).ban(reason);
        message.reply(`${wUser.tag} has been banned`)
    }
}

objExp.help = (message,args) => {
    // a!help
    match(args) {
        return args.length < 2;
    }

    action(message, args) {
		if(args.length == 0) {
			message.channel.send('I sent you all commands in Private Message.');
			let txt = '';
			for(let command of Object.keys(this.commandList)) {
				txt += `**• ${command}**: ${this.commandList[command].description}\n    usage: \`${this.commandList[command].usage}\`\n`;
			}
			message.guild.members.cache.find(user => user.id == message.author.id).send(txt);
		}

		else {
			if(args[0] in this.commandList) {
				message.channel.send(`**• ${args[0]}**: ${this.commandList[args[0]].description}\n    usage: \`${PREFIX}${this.commandList[args[0]].usage}\`\n`);
			} else {
				message.channel.send("I can't help you for a command that doesn't exist :grimacing: :disappointed_relieved:");
			}
		}
	}

	get description() {
		return "Display the description and the usage of all commands";
	}

	get usage() {
		return "help {commandName (optionnal)}";
	}
}
*/

/*
objExp.empty = (message,args) => {
    // a!


}

objExp.empty = (message,args) => {
    // a!
}

objExp.empty = (message,args) => {
    // a!
}

objExp.empty = (message,args) => {
    // a!
}
*/