import { Client, GatewayIntentBits, Partials, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Events, TextChannel } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Channel]
});
client.once(Events.ClientReady, async () => {
    console.log(`🤖 Bot conectado como ${client.user?.tag}`);
    const channelId = '1364251464767246500'; // <- coloque o ID do canal
    const roleId = '1364251461537759420'; // <- coloque o ID do cargo
    const channel = await client.channels.fetch(channelId);
    if (!channel || !(channel instanceof TextChannel))
        return;
    const embed = new EmbedBuilder()
        .setTitle('Sistema de Verificação')
        .setDescription('Clique no botão abaixo para se verificar e obter acesso completo!')
        .setColor('Green');
    const verifyButton = new ButtonBuilder()
        .setCustomId('verify')
        .setLabel('Verificar')
        .setEmoji('✅')
        .setStyle(ButtonStyle.Success);
    const row = new ActionRowBuilder().addComponents(verifyButton);
    channel.send({ embeds: [embed], components: [row] });
});
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton())
        return;
    if (interaction.customId !== 'verify')
        return;
    if (!interaction.guild)
        return;
    const roleId = '1364251461537759420'; // <- mesmo ID que colocou acima
    const member = await interaction.guild.members.fetch(interaction.user.id);
    const role = interaction.guild.roles.cache.get(roleId);
    if (!member || !role)
        return;
    try {
        await member.roles.add(role);
        await interaction.reply({ content: '✅ Você foi verificado com sucesso!', ephemeral: true });
    }
    catch (error) {
        console.error('Erro ao dar o cargo:', error);
        await interaction.reply({ content: '❌ Ocorreu um erro ao tentar verificar você.', ephemeral: true });
    }
});
client.login(process.env.BOT_TOKEN);
// ClientRequest.login(process.env.BOT_TOKEN);
