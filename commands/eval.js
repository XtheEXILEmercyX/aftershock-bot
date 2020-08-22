const Discord = require('discord.js');
const Util = require('util');

/**
 * Eval Javascript - restricted to Bot developers
 */
module.exports = {
	hidden: true,
	
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	execute(client, message, args) {
        
        if(!client.isDev(message.author.id)) return;
        
		if(args.length == 0) {
			return;
		}
		
		
		const send = msg => message.channel.send(msg);
		const execute = (cmd, ...args) => client.commands.get(cmd).run(client, message, args) || undefined;
				
		const cleanAfter = text => {
			if(typeof text == 'string') {
                text = text.replace((new RegExp(client.token, 'g')), '');
				text = text.trim();
			}
			
			else if(typeof text == 'object') {
				for(let i of Object.keys(text)) {
					if(typeof text[i] == 'string') {
						text[i] = text[i].replace((new RegExp(client.token, 'g')), '');
					}
				}
			}

			return text;
		};

		const cleanBefore = text => {
			let cleanText = text.replace(/client\.token/g, '');
			
			if(/await/.test(cleanText)) {
				cleanText = `(async () => {${cleanText}})()`;
			}

			return cleanText;
		};
				

		let code = args.join(" ").trim();
	
		
		let lang = (code.length > 0 ? 'js' : '') + '\n';

		// output embed
		const embed = new Discord.MessageEmbed()
				
			let desc = "📥 **Tested code**\n```" + lang + code + "```\n";
		

			// try execute the code. If no errors, then stocks the result
			try {
				let evaluated = Util.inspect(cleanAfter(eval(cleanBefore(code))), {depth: 1});
				
				if(evaluated.length > 1000) {
					evaluated = evaluated.slice(0, 1000) + '\n\t// ...\n}';
				}
				
				lang = (evaluated.length > 0 ? 'js' : '') + '\n';
				
				desc += "📤 **Result**\n```" + lang + evaluated + "```";
			}
	
			// else stocks the error
			catch (error) {
				desc += "📤 **Error**\n```" + lang + error + "```";
			}
		
			embed.setDescription(desc);

			// then print the final result
			send(embed);

	}
};