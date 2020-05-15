const Discord = require('discord.js');
const bot = require('./index.js').bot;
const superagent = require("superagent");
const tag = require('./config.js').prefix;
const fs = require("fs");
const ms = require("ms");
const admin = require('./utils.js');

let objExp = module.exports = {};
let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));

objExp.commands = {
    execute: (message,args) => {
        let embed = new Discord.MessageEmbed()
            .setTitle('commands')
            .setColor(0xdd0000);

        let cmds = Object.keys(objExp);
        let max = (cmds.length < 20)? cmds.length : 10; // max the 10 first commands. We'll see for a better version another time

        for(let i=0; i<max; i++) {
            let cmdName = cmds[i];
            embed.addField(`${tag}${cmdName}`, objExp[cmdName].description? objExp[cmdName].description : 'No description provided');
        }

        message.channel.send(embed);
    }, 

    description: "show all commands"
}

objExp.help = {
    execute: (message, args) => {
        message.channel.send("<@&589814405970264077> can you help this idiot for a sec ?!!!");
    },

    description: "call for an admin"
};

objExp.help_pleas = {
    execute: (message, args) => {
        message.channel.send("<@&589814405970264077> can you help this kind person pleas?");
    },

    description: "call for an admin on a kind way"
};

objExp.test = {
    execute: (message, args) => {
        message.channel.send("im still online don't worry");
    },

    description: "test if bot is still online"
};

objExp.hello = {
    execute: (message, args) => {
        message.channel.send("hello sir, hope your day is going well!");
    },

    description: "Says hello"
};

objExp.ping = {
    execute: (message, args) => {
        message.channel.send("pong");
    },

    description: "answer with pong"
};

objExp.suicide = {
    execute: (message, args) => {
        message.channel.send("sorry man dodnt wanne die yet wanne annoy <@395980281695305729> lil bit more");
    },

    description: "ask the bot to kill him self (joke)"
};

objExp.summon_a_bot = {
    execute: (message, args) => {
        message.channel.send("a wild discord bot has appeared");
    },

    description: "summon a wild discord bot (pokemon style)"
};

objExp.use_pokeball = {
    execute: (message, args) => {
        message.channel.send("you have captured me master i will obey you from now on");
    },

    description: "catch the wild discordbot (pokemon style)"
};

objExp.pokemon_soundtrack = {
    execute: (message, args) => {
        message.channel.send("https://www.youtube.com/watch?v=xtFL0Okuv2Q");
    },

    description: "plays pokemon soundtrack"
};

objExp.nightcore = {
    execute: (message,args) => {
        message.channel.send("https://www.youtube.com/watch?v=cvaIgq5j2Q8&list=PLckeMyCaCCIN_JU1V4oADW50DlGOREoLjYouTube")
    },
    description: "gives a playlist of nigthcore"
};

objExp.report = {
    execute: (message, args) => {
        //!report <@user> <reason>
        if(!admin(message.member)) return message.channel.send('You can\'t use this command.');

        if(args.length == 0) return message.channel.send('You need to mention a server member.');
        
        let memberId = args[0].replace(/<@(&|!)?(\d+)>/, '$2');

        let rUser = message.guild.members.cache.get(memberId);
        if(!rUser) return message.channel.send("Couldn't find this member on this server !");


        let reason = (args.length > 1)? args.splice(1).join(" ") : 'No reason';

        let reportEmbed = new Discord.MessageEmbed()
            .setTitle("❗ Report")
            .setColor("#a83232")
            .addFields(
                {name: "Reported User", value: `${rUser} with ID: \`${rUser.id}\``},
                {name: "Reported By", value: `${message.author} with ID: \`${message.author.id}\``},
                {name: "Reason", value: reason},
                {name: "Channel", value: message.channel},
                {name: "Time", value: message.createdAt}
            );

        let reportschannel = message.guild.channels.cache.find(channel => channel.name == 'reports');
        if(!reportschannel) return message.channel.send("Couldn't find reports channel !");

        reportschannel.send(reportEmbed);
        message.channel.send('User reported.\nPro tip: if you spam this command you will be warned.');
    },

    description: "Report a server member or bot"
};

objExp.serverinfo = {
    execute: (message, args) => {
        // a!botinfo
        let sicon = message.guild.iconURL();
        let serverembed = new Discord.MessageEmbed()
            .setTitle("Server Information")
            .setColor("#a83232")
            .setThumbnail(sicon)
            .addField("Server Name", message.guild.name)
            .addField("Created On", message.guild.createdAt)
            .addField("You Joined", message.member.joinedAt)
            .addField("Total Members", message.guild.memberCount);

        message.channel.send(serverembed);
    },

    description: "Gives the server basic informations"
};

objExp.botinfo = {
    execute: (message, args) => {
        // a!botinfo
        let bicon = bot.user.displayAvatarURL();
        let botembed = new Discord.MessageEmbed()
            .setTitle("Bot Information")
            .setColor("#a83232")
            .setThumbnail(bicon)
            .addField("Bot Name", bot.user.username)
            .addField("Created On", bot.user.createdAt)
            .addField("server", message.guild.name)
        message.channel.send(botembed);
    },

    description: "Gives the bot basic informations"
};

objExp.ownerinfo = {
    execute: (message, args) => {
        // a!botinfo
        let bicon = bot.user.displayAvatarURL();
        let botembed = new Discord.MessageEmbed()
            .setTitle("owner Information")
            .setColor("#a83232")
            .setThumbnail(bicon)
            .addField("Bot Name", bot.user.username)
            .addField("owner", "xtheEXILEmercyx")
            .addField("information", "if you need help with the bot or you have some idea's pleas contact me by joining my server!")
            .addField("owner's server", "https://discord.gg/6AfhV9R");
        message.channel.send(botembed);
    },

    description: "Gives the owner basic informations"
};

objExp.kick = {
    execute: (message, args) => {
        if(!admin(message.member)) return message.channel.send('You can\'t use this command.');

        if(args.length == 0) return message.channel.send('You have to mention a server member.');
        //a!kick <@user> <reason>
        let memberId = args[0].replace(/<@(&|!)?(\d+)>/, '$2');

        let kUser = message.guild.members.cache.get(memberId);

        if(!kUser) message.channel.send("Can't find member !");

        let kReason = (args.length > 1)? args.splice(1).join(" ") : 'No reason';

        if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("YOUR NOT AN ADMIN DON'T TRY TO USE COMMANDS THAT ARE NOT MADE FOR YOUR ROLE GO READ SERVER RULES AGAIN !!!");
        if(kUser.hasPermission("KICK_MEMBERS")) return message.channel.send("that member can't be kicked !");

        let kickEmbed = new Discord.MessageEmbed()
            .setTitle("👉🚪 Kick")
            .setColor("#fca503")
            .addFields(
                {name: "Kicked User", value: `${kUser} with ID: \`${kUser.id}\``},
                {name: "Kicked By", value: `${message.author} with ID: \`${message.author.id}\``},
                {name: "Reason", value: kReason},
                {name: "Channel", value: message.channel},
                {name: "Time", value: message.createdAt}
            );

        let kickChannel = message.guild.channels.cache.find(channel => channel.name == "incidents");
        if(!kickChannel) return message.channel.send("Can't find incidents channel!");
        
        kUser.kick(kReason).then(() => {
            message.channel.send('Member kicked.');
            kickChannel.send(kickEmbed);
        }).catch(error => {
            console.log("Cannot kick "+kUser.user.username+'#'+kUser.user.discriminator, error);
            message.channel.send('An error occured.');
        });
    },

    description: "Kick a server member (admins only)"
}

objExp.ban = {
    execute: (message, args) => {
        // a!ban <@user> <reason>
        if(!admin(message.member)) return message.channel.send('You can\'t use this command.');

        if(args.length == 0) return message.channel.send('You have to mention a server member.');

        let memberId = args[0].replace(/<@(&|!)?(\d+)>/, '$2');

        let bUser = message.guild.members.cache.get(memberId);

        if(!bUser) message.channel.send("Can't find member !");

        let bReason = (args.length > 1)? args.splice(1).join(" ") : 'No reason';

        if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("YOUR NOT AN ADMIN DON'T TRY TO USE COMMANDS THAT ARE NOT MADE FOR YOUR ROLE GO READ SERVER RULES AGAIN !!!");
        if(bUser.hasPermission("BAN_MEMBERS")) return message.channel.send("that member can't be banned !");

        let banEmbed = new Discord.MessageEmbed()
            .setTitle("👉🚪 BAN (7 days)")
            .setColor("#fca503")
            .addFields(
                {name: "banned User", value: `${bUser} with ID: \`${bUser.id}\``},
                {name: "banned By", value: `${message.author} with ID: \`${message.author.id}\``},
                {name: "Reason", value: bReason},
                {name: "Channel", value: message.channel},
                {name: "Time", value: message.createdAt}
            );

        let banChannel = message.guild.channels.cache.find(channel => channel.name == "incidents");
        if(!banChannel) return message.channel.send("Can't find incidents channel!");
        
        bUser.ban({days: 7,reason: bReason}).then(() => {
            message.channel.send('Member banned.');
            banChannel.send(banEmbed);
        }).catch(error => {
            console.log("Cannot ban "+bUser.user.username+'#'+bUser.user.discriminator, error);
            message.channel.send('An error occured.');
        });
    },

    description: "Ban a server member (admins only)"
};
/*
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

    fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
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