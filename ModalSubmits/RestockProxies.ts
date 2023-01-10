import { ModalSubmitInteraction, SlashCommandBuilder } from 'discord.js';
import ModalSubmit from '../Interfaces/ModalSubmit';
import { PrismaClient } from '@prisma/client';
import AddProxies from '../Lib/Proxies/Add';

export const ModalSubmit: ModalSubmit = ({
    Name: 'restock_proxies',
    Execute: (_client, prisma: PrismaClient, guild, interaction: ModalSubmitInteraction) => {
        const proxies = interaction.fields.getTextInputValue(`restock_proxies`).split('\n');

        AddProxies(guild, proxies, prisma, interaction);
    }
});
