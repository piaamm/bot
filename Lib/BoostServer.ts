import { PrismaClient } from '@prisma/client';
import { ChatInputCommandInteraction } from 'discord.js';
import Embed from './Embed';
import Colors from './EmbedColors';
import Verify from './DiscordTokens/Verify';
import GetBoosts from './DiscordTokens/GetBoosts';
import GetHeaders from './DiscordTokens/GetHeaders';
import JoinServer from './DiscordTokens/JoinServer';
import BoostServer from './DiscordTokens/BoostServer';

export default async (Invite, Tokens, Interaction: ChatInputCommandInteraction, Prisma: PrismaClient, Guild) => {
    const ValidTokens = [];
    const InvalidTokens = [];
    const TotalBoosts = [];
    const DeleteTokens = [];

    const boostingEmbed = (valid?, invalid?) => Embed(
        Guild?.embed_config,
        ((valid + invalid) >= Tokens.length) ? `✅ ・ Boosted Guild (Invite: ${Invite})` : `⏰ ・ Boosting Guild (Invite: ${Invite})`,
        `${((valid + invalid) >= Tokens.length) ? `Processed all tokens and boosts.` : `Please wait. Validating and boosting with tokens.`}\n\nTotal Tokens: \`\`${Tokens.length}\`\`\nValid Tokens: \`\`${valid}\`\`\nInvalid Tokens: \`\`${invalid}\`\`\nProcessed Tokens: \`\`${(valid + invalid)}\`\`/\`\`${Tokens.length}\`\`\n\nA total of \`\`${valid}\`\`/\`\`${Tokens.length}\`\` tokens (\`\`${TotalBoosts.length}\`\` boosts) have boosted the guild.`,
        ((valid + invalid) >= Tokens.length) ? Colors.Green : Colors.Orange
    );

    const errorEmbed = Embed(
        Guild?.embed_config,
        '❌ ・ Error Occurred',
        `An unexpecting problem occurred.\nTry again or report the problem to a developer.`,
        Colors.Red
    );

    const updateEmbed = async () => await Interaction.editReply({ embeds: [boostingEmbed(ValidTokens.length, InvalidTokens.length)] }).catch();

    await Interaction.editReply({ embeds: [boostingEmbed(ValidTokens.length, InvalidTokens.length)] }).catch();

    await Prisma.discordToken.updateMany({ where: { OR: Tokens.map((t) => ({ guild_id: Guild?.id, token: t.token })) }, data: { using: true } })
        .catch();

    await Promise.all(Tokens.map(async (t) => {
        const { token: Token, boosts: BoostsAvailable, proxy: Proxy } = t;

        if (!await Verify(Token, Proxy)) return InvalidTokens.push(Token);

        const Invalid = (Token) => {
            InvalidTokens.push(Token);
            updateEmbed();
        };

        const Valid = async (Token, BoostedBoosts) => {
            DeleteTokens.push(Token);
            ValidTokens.push(Token);
            TotalBoosts.push(...BoostedBoosts);
            updateEmbed();
        };

        const Headers = await GetHeaders(Token, Proxy);
        if (!Headers) return Invalid(Token);

        const Boosts = (await GetBoosts(Proxy.split(':'), Headers)).map((b) => b.id).splice(0, BoostsAvailable);
        if (!Boosts) return Invalid(Token);

        const Server: any = await JoinServer(Proxy.split(':'), Headers, Invite, Guild?.capmonster_api_key);
        if (!Server) return Invalid(Token);
        
        const ServerBoosts = await BoostServer(Proxy.split(':'), Headers, Boosts, Server?.guild?.id)
        if (!ServerBoosts) return Invalid(Token);

        return await Valid(Token, Boosts);
    }))
        .then(async () => {
            await Prisma.discordToken.updateMany({ where: { OR: Tokens.map((t) => ({ guild_id: Guild?.id, token: t.token })) }, data: { using: false } })
                .catch();
            await Prisma.discordToken.deleteMany({ where: { OR: DeleteTokens.map((t) => ({ guild_id: Guild?.id, token: t })) } })
                .catch();
        })
        .catch(async () => await Interaction.editReply({ embeds: [errorEmbed] }).catch());
};