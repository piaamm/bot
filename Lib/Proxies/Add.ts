import { PrismaClient } from '@prisma/client';
import { ModalSubmitInteraction } from 'discord.js';
import Embed from '../Embed';
import Colors from '../EmbedColors';
import Verify from './Verify';

export default async (Guild, Proxies, Prisma: PrismaClient, Interaction: ModalSubmitInteraction) => {
    const ValidProxies = [];
    const InvalidProxies = [];

    const addingEmbed = (valid?, invalid?) => Embed(
        Guild?.embed_config,
        ((valid + invalid) >= Proxies.length) ? '✅ ・ Added Proxies' : '⏰ ・ Adding Proxies',
        `${((valid + invalid) >= Proxies.length) ? `Processed all proxies.` : `Please wait. Validating and adding proxies.`}\n\nTotal Proxies: \`\`${Proxies.length}\`\`\nValid Proxies: \`\`${valid}\`\`\nInvalid Proxies: \`\`${invalid}\`\`\nProcessed Proxies: \`\`${(valid + invalid)}\`\`/\`\`${Proxies.length}\`\`\n\nA total of \`\`${valid}\`\`/\`\`${Proxies.length}\`\` proxies have been added.`,
        ((valid + invalid) >= Proxies.length) ? Colors.Green : Colors.Orange
    );

    const errorEmbed = Embed(
        Guild?.embed_config,
        '❌ ・ Error Occurred',
        `An unexpecting problem occurred.\nTry again or report the problem to a developer.`,
        Colors.Red
    );

    const updateEmbed = async () => await Interaction.editReply({ embeds: [addingEmbed(ValidProxies.length, InvalidProxies.length)] }).catch();

    await Interaction.editReply({ embeds: [addingEmbed(ValidProxies.length, InvalidProxies.length)] }).catch();

    await Promise.all(Proxies.map(async (t) => {
        const [Proxy, Port, Username, Password] = t.split(':');

        if (await Verify(t.split(':'))) ValidProxies.push(Port ? `${Proxy}:${Port}:${Username}:${Password}` : Proxy)
        else InvalidProxies.push(Proxy);

        return updateEmbed();
    }))
        .catch(async () => await Interaction.editReply({ embeds: [errorEmbed] }).catch());

    Prisma.proxy.createMany({ data: [...new Set([...Guild?.proxies?.map((p) => p.proxy), ...ValidProxies])].map((proxy) => ({ proxy, guild_id: Guild?.id })), skipDuplicates: true })
        .catch(async () => await Interaction.editReply({ embeds: [errorEmbed] }).catch());
};