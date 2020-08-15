const {admin} = require('../utils.js');
const Discord = require('discord.js');
const fs = require('fs');
const { deepStrictEqual } = require('assert');

module.exports = {
    execute: (client, message, args) => {
        client.on('message', async message => {
            // Join the same voice channel of the author of the message
            if (message.member.voice.channel) {
                const connection = await message.member.voice.channel.join();
            }
        });

        //Create a dispatcher
        const dispatcher = connection.play('audio.mp3');

        dispatcher.on('start', () => {
            console.log('audio.mp3 is now playing!');
        });

        dispatcher.on('finish', () => {
            console.log('audio.mp3 has finished playing!');
        });

        //alwase remember to handle errors appropriately!
        dispatcher.on('error', console.error);

        dispatcher.destroy();

        connection.play('audio.mp3', {volume: 0.5});

       //play a WebM Opus stream
       connection.play(fs.createReadStream('audio.webm'), { type: 'webm/opus'});
       //play an Ogg Opus stream
       connection.play(fs.createReadStream('audio.ogg'), {type: 'ogg/opus'});

       dispatcher.pause();
       dispatcher.resume();
       //set the volume to 25%
       dispatcher.setVolume(0.25);

       //play silent packets while paused
       dispatcher.pause(true);

       //option 1
       connection.disconnect();

       //option 2
       voiceChannel.leave();

       //create an instance of a voicebroadcast
       const broadcast = client.voice.createBroadcast();
       //play audio on the broadcast
       //const dispatcher = broadcast.play('audio.mp3');
       //play this broadcast across multiple connections (subscribe to the broadcast)
       connection1.play(broadcast);
       connection2.play(broadcast);

    //    const broadcast = client.voice.createBroadcast();
       const broadcast2 = client.voice.createBroadcast();
    }
};