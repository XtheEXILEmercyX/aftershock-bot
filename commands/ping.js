module.exports = {
    execute: (client, message, args) => {
        message.channel.send(":ping_pong: Pong");
    },

    description: "Answer with pong"
};