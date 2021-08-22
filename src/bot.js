const DiscordJS = require('discord.js');
const WOKCommands = require('wokcommands');
require('dotenv').config();
const mongoose = require('mongoose');
const client = new DiscordJS.Client({
    partials: ['MESSAGE', 'REACTION']
});
const PREFIX = "!";

client.on('ready', () => {
    new WOKCommands(client, {
        commandsDir: 'commands',
        showWarns: false
    }).setMongoPath(process.env.MONGODB_SRV)
    console.log(`${client.user.tag} has logged in.`);
});

// client.on('message', (message) => {
//     if (message.author.bot) return;
//     if (message.content.startsWith(PREFIX)) {
//         const [COMMAND, ...args] = message.content
//         .trim()
//         .substring(PREFIX.length)
//         .split(/\s+/);
        
//         if (COMMAND === 'remindme') {
//             if (args.length === 2) {
//                 const date = args[0];
//                 const time = args[1];

//                 if (date.match(/^(0?[1-9]|1[0-2])\/(0?[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/)) {
//                     if (time.match(/([01]?[0-9]|2[0-3]):[0-5][0-9]/)) {
//                         message.reply('please send the message you would like to schedule.');
//                         console.log(time);
//                         console.log(date);
//                     } else return message.channel.send('Error: Input time as HH:MM in 24-hour format.');
//                 } else return message.channel.send('Error: Input date as MM/DD/YYYY');
//             } else return message.channel.send('Syntax: ***!remindme <date> <time>***');
//         }
//     }
// });

mongoose.connect(process.env.MONGODB_SRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('Connected to the database!')
}).catch((err) => {
    console.log(err);
})

client.login(process.env.TOKEN);