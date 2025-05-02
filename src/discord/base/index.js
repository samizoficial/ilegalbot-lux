import { Client, GatewayIntentBits, Partials, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Events, TextChannel, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType } from 'discord.js';
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
    // Canal de Solicitação de TAG
    const tagRequestChannelId = '1365800661593362543'; // Canal onde as solicitações serão enviadas
    const tagRequestChannel = await client.channels.fetch(tagRequestChannelId);
    if (!tagRequestChannel || !(tagRequestChannel instanceof TextChannel))
        return;
    // Embed inicial para solicitar a TAG
    const embedTagRequest = new EmbedBuilder()
        .setTitle('Solicite a sua TAG!')
        .setDescription('Clique no botão abaixo para solicitar a TAG da organização que você faz parte.')
        .setColor('Blue')
        .setThumbnail('https://media.discordapp.net/attachments/1365051116794023982/1365440096819609651/ILEGAL_LUX_simbolo_sem_fundo.png?ex=680df96f&is=680ca7ef&hm=45cd046350ea0eac4f05ef446c689e9b645344f775137fd9deaec4b36544c1f1&format=webp&quality=lossless&width=968&height=968')
        .setImage('https://media.discordapp.net/attachments/1365051116794023982/1365798838379614279/CIDADE_LUX_BOT_17.gif?ex=680e9eca&is=680d4d4a&hm=ae1a881e31acfff6b4664ed73ec165075d600b1c618175d0b4aff42999b7c9e7&=');
    const tagRequestButton = new ButtonBuilder()
        .setCustomId('startTagRequest')
        .setLabel('Quero a minha TAG')
        .setEmoji('🔑') // Emoji para o botão
        .setStyle(ButtonStyle.Primary);
    const row = new ActionRowBuilder().addComponents(tagRequestButton);
    await tagRequestChannel.send({ embeds: [embedTagRequest], components: [row] });
});
// INTERAÇÕES
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.guild)
        return;
    // BOTÃO DE SOLICITAÇÃO DE TAG
    if (interaction.isButton() && interaction.customId === 'startTagRequest') {
        const modal = new ModalBuilder()
            .setCustomId('tagRequestModal')
            .setTitle('Solicitação de TAG');
        const nomeInput = new TextInputBuilder()
            .setCustomId('nome')
            .setLabel('Nome na cidade?')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        const idInput = new TextInputBuilder()
            .setCustomId('id')
            .setLabel('ID?')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        const orgInput = new TextInputBuilder()
            .setCustomId('org')
            .setLabel('Nome da Organização?')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        const primeiroRow = new ActionRowBuilder().addComponents(nomeInput);
        const segundoRow = new ActionRowBuilder().addComponents(idInput);
        const terceiroRow = new ActionRowBuilder().addComponents(orgInput);
        modal.addComponents(primeiroRow, segundoRow, terceiroRow);
        await interaction.showModal(modal);
    }
    // MODAL DE SOLICITAÇÃO DE TAG
    if (interaction.type === InteractionType.ModalSubmit && interaction.customId === 'tagRequestModal') {
        const nome = interaction.fields.getTextInputValue('nome');
        const id = interaction.fields.getTextInputValue('id');
        const org = interaction.fields.getTextInputValue('org');
        const tagRequestChannelId = '1365800661593362543'; // Canal para enviar a solicitação de TAG
        const tagRequestChannel = await interaction.guild.channels.fetch(tagRequestChannelId);
        if (!tagRequestChannel || !(tagRequestChannel instanceof TextChannel))
            return;
        const embedTagRequest = new EmbedBuilder()
            .setTitle('Solicitação de TAG')
            .setColor('Blue')
            .setThumbnail('https://media.discordapp.net/attachments/1365051116794023982/1365440096819609651/ILEGAL_LUX_simbolo_sem_fundo.png?ex=680df96f&is=680ca7ef&hm=45cd046350ea0eac4f05ef446c689e9b645344f775137fd9deaec4b36544c1f1&format=webp&quality=lossless&width=968&height=968')
            .addFields({ name: 'Nome na Cidade:', value: nome }, { name: 'ID:', value: id }, { name: 'Organização:', value: org }, { name: 'Usuário:', value: `<@${interaction.user.id}>` })
            .setTimestamp();
        try {
            // Enviar solicitação de TAG para o canal
            await tagRequestChannel.send({ embeds: [embedTagRequest] });
            await interaction.reply({ content: '✅ Sua solicitação de TAG foi enviada com sucesso!', ephemeral: true });
        }
        catch (error) {
            console.error('Erro na solicitação de TAG:', error);
            await interaction.reply({ content: '❌ Ocorreu um erro ao solicitar sua TAG.', ephemeral: true });
        }
    }
});
client.login(process.env.TOKEN);
