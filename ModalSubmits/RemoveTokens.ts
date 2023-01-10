import { ModalSubmitInteraction, SlashCommandBuilder } from 'discord.js';
import ModalSubmit from '../Interfaces/ModalSubmit';
import { PrismaClient } from '@prisma/client';
import RemoveTokens from '../Lib/Tokens/Remove';

export const ModalSubmit: ModalSubmit = ({
    Name: 'remove_tokens',
    Execute: (_client, prisma: PrismaClient, guild, interaction: ModalSubmitInteraction) => {
        const tokens = interaction.fields.getTextInputValue(`remove_tokens`).split('\n');

        RemoveTokens(guild, tokens, prisma, interaction);
    }
});
