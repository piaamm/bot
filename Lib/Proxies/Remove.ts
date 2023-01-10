import { PrismaClient } from '@prisma/client';
import { ModalSubmitInteraction } from 'discord.js';
import Embed from '../Embed';
import Colors from '../EmbedColors';

export default async (Guild, Proxies, Prisma: PrismaClient, Interaction: ModalSubmitInteraction) => {
    const deletedEmbed = (deleted?, failed?) => Embed(
        Guild?.embed_config,
        '✅ ・ Deleted Proxies',
        `Processed all proxies.\n\nTotal Proxies: \`\`${Proxies.length}\`\`\nDeleted Proxies: \`\`${deleted}\`\`\nFailed To Delete Proxies: \`\`${failed}\`\`\nProcessed Proxies: \`\`${(deleted + failed)}\`\`/\`\`${Proxies.length}\`\`\n\nA total of \`\`${deleted}\`\`/\`\`${Proxies.length}\`\` proxies have been deleted.`,
        Colors.Green
    );

    const errorEmbed = Embed(
        Guild?.embed_config,
        '❌ ・ Error Occurred',
        `An unexpecting problem occurred.\nTry again or report the problem to a developer.`,
        Colors.Red
    );

    Prisma.proxy.deleteMany({ where: { OR: Proxies.map((p) => ({ proxy: p, guild_id: Guild?.id })) } })
        .then(async (d) => await Interaction.editReply({ embeds: [deletedEmbed(d.count ?? 0, Proxies.length - d.count ?? 0)] }).catch())
        .catch(async () => await Interaction.editReply({ embeds: [errorEmbed] }).catch());
};