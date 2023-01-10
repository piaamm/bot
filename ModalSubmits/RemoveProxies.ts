import { ModalSubmitInteraction, SlashCommandBuilder } from 'discord.js';
import ModalSubmit from '../Interfaces/ModalSubmit';
import { PrismaClient } from '@prisma/client';
import RemoveProxies from '../Lib/Proxies/Remove';

export const ModalSubmit: ModalSubmit = ({
    Name: 'remove_proxies',
    Execute: (_client, prisma: PrismaClient, guild, interaction: ModalSubmitInteraction) => {
        const proxies = interaction.fields.getTextInputValue(`remove_proxies`).split('\n');

        RemoveProxies(guild, proxies, prisma, interaction);
    }
});
