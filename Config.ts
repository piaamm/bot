import { Client, GatewayIntentBits } from 'discord.js';

export default ({
    Bot: {
        Token: 'MTA2MTcwMTI3NTAyMjAwNDI5MQ.GbwhlR.iCQM6EaHoGZoujCykkjCMgR1WbtmFto5gGKQZ4',
        Client: new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers
            ]
        }),
        CommandLimit: 5,
        Administrators: ['610140494697332766']
    }
});
