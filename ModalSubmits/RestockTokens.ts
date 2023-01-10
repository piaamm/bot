import { ModalSubmitInteraction } from 'discord.js';
import ModalSubmit from '../Interfaces/ModalSubmit';
import { PrismaClient } from '@prisma/client';
import AddTokens from '../Lib/Tokens/Add';
import Embed from '../Lib/Embed';
import Colors from '../Lib/EmbedColors';

export const ModalSubmit: ModalSubmit = ({
    Name: 'restock_tokens',
    Execute: async (_client, prisma: PrismaClient, guild, interaction: ModalSubmitInteraction, reply) => {
        const shuffle = (i) => i.map((v) => ({ v, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ v }) => v);

        const tokens = interaction.fields.getTextInputValue(`restock_tokens`).split('\n');
        const proxies = shuffle(guild?.proxies)?.slice(0, tokens.length);

        const notEnoughProxies = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `There aren't enough proxies in this server for **${tokens.length}** tokens. Try lower the amount of tokens.`,
            Colors.Red
        );

        if (proxies.length < tokens.length) return await reply({ embeds: [notEnoughProxies], ephemeral: true });

        AddTokens(guild, tokens.map((t, idx) => ({ token: t, proxy: proxies[idx]?.proxy })), prisma, interaction);
    }
});
