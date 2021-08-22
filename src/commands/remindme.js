const datetime = require('date-and-time');
const Discord = require('discord.js');
const moment = require('moment-timezone');
// moment().tz("America/Los_Angeles").format();

const remindersSchema = require('../models/reminders-schema');

module.exports = {
    category: 'Reminders',
    description: 'Send a message to yourself at a specified date and time.',
    expectedArgs: '<M/D/YYYY> <H:MM>',
    minArgs: 2,
    maxArgs: 2,
    init: (client) => {
        const checkForPosts = async () => {
            // group all posts with a date < present time
            const query = {
                date: {
                    $lte: Date.now()
                }
            }

            const results = await remindersSchema.find(query);

            // loop through results and send scheduled messages

            for (const post of results) {
                const { content } = post;

                channel.send(content);
            }

            await remindersSchema.deleteMany(query);

            setTimeout(checkForPosts, 1000 * 10);
        }
        checkForPosts();
    },
    callback: async ({ message, args }) => {
        const [date, time] = args;

        // checking for syntax errors

        if (!date.match(/^(0?[1-9]|1[0-2])\/(0?[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/)) {
            message.reply('please provide a date using *M/D/YYYY* format.');
            return;
        }

        if (!time.match(/([01]?[0-9]|2[0-3]):[0-5][0-9]/)) {
            message.reply('please provide a time using *H:MM* in 24-hour format.');
            return;
        }

        console.log(date);
        console.log(time);

        const targetDateTime = datetime.parse(`${date} ${time}`, 'M/D/YYYY H:mm');

        // ask user for message to save

        message.author.send('Please send the message you would like to schedule here!');
        // message.reply('please send the message you would like to schedule.');

        const filter = (m) => {
            return m.author.id === message.author.id;
        }

        const collector = new Discord.MessageCollector(message.author.dmChannel, filter, {
            max: 1,
            time: 1000 * 30
        })

        collector.on('collect', (collected) => {
            console.log(`Collected message: ${collected}`);
        })

        collector.on('end', async (collected) => {
            const collectedMessage = collected.first();

            if (!collectedMessage) {
                message.reply('You did not reply in time.');
                return;
            }

            message.reply(`You will be reminded of this message on ${date} at ${time}.`);

            // save to database

            await new remindersSchema({
                author: message.author,
                date: targetDateTime,
                message: collectedMessage.content
            }).save();
        })
    }
}