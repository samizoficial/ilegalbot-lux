import { Client, GatewayIntentBits, Partials, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Events, TextChannel, ModalBuilder, TextInputBuilder, TextInputStyle, ModalSubmitInteraction, ChatInputCommandInteraction } from 'discord.js';
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
// BOT INICIADO
client.once(Events.ClientReady, async () => {
    console.log(`🤖 Bot conectado como ${client.user?.tag}`);
    // Sistema de Registro
    const registroChannelId = '1365776446680993832'; // Canal de Registro
    const registroChannel = await client.channels.fetch(registroChannelId);
    if (!registroChannel || !(registroChannel instanceof TextChannel))
        return;
    const embedRegistro = new EmbedBuilder()
        .setTitle('Sistema de Registro')
        .setDescription('Clique no botão abaixo para realizar seu registro no Servidor Ilegal!')
        .setColor('Yellow')
        .setThumbnail('https://cdn.discordapp.com/attachments/1365051116794023982/1365440096819609651/ILEGAL_LUX_simbolo_sem_fundo.png')
        .setImage('https://media.discordapp.net/attachments/1365051116794023982/1365777550143525026/CIDADE_LUX_BOT_16.gif');
    const registroButton = new ButtonBuilder()
        .setCustomId('startRegistro')
        .setLabel('Registrar-se')
        .setEmoji('📝')
        .setStyle(ButtonStyle.Primary);
    const row = new ActionRowBuilder().addComponents(registroButton);
    await registroChannel.send({ embeds: [embedRegistro], components: [row] });
    // Sistema de Solicitação de TAG
    const tagRequestChannelId = '1267479401558446164'; // Canal para solicitação de tag
    const tagRequestChannel = await client.channels.fetch(tagRequestChannelId);
    if (!tagRequestChannel || !(tagRequestChannel instanceof TextChannel))
        return;
    const embedTagRequest = new EmbedBuilder()
        .setTitle('Solicitação de TAG da Organização')
        .setDescription('Solicite aqui a sua TAG da organização que você faz parte!')
        .setColor('Blue')
        .setThumbnail('https://media.discordapp.net/attachments/1365051116794023982/1365440096819609651/ILEGAL_LUX_simbolo_sem_fundo.png')
        .setImage('https://media.discordapp.net/attachments/1365051116794023982/1365798838379614279/CIDADE_LUX_BOT_17.gif');
    const tagRequestButton = new ButtonBuilder()
        .setCustomId('startTagRequest')
        .setLabel('Quero a minha TAG')
        .setEmoji('🎯')
        .setStyle(ButtonStyle.Primary);
    const tagRequestRow = new ActionRowBuilder().addComponents(tagRequestButton);
    await tagRequestChannel.send({ embeds: [embedTagRequest], components: [tagRequestRow] });
});
// INTERAÇÕES
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.guild)
        return;
    // Verificando se a interação é de comando de texto
    if (interaction.isCommand() && interaction instanceof ChatInputCommandInteraction) {
        if (interaction.commandName === 'marcaracao') {
            const modal = new ModalBuilder()
                .setCustomId('marcaracaoModal')
                .setTitle('Formulário de Ação Marcada');
            // Adicionando os campos solicitados
            const nomeInput = new TextInputBuilder()
                .setCustomId('nome')
                .setLabel('Nome:')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            const idInput = new TextInputBuilder()
                .setCustomId('id')
                .setLabel('ID:')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            const orgInput = new TextInputBuilder()
                .setCustomId('org')
                .setLabel('Nome da Organização:')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            const tipoAcaoInput = new TextInputBuilder()
                .setCustomId('tipoAcao')
                .setLabel('Tipo de Ação:')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            const quantidadeMembrosInput = new TextInputBuilder()
                .setCustomId('quantidadeMembros')
                .setLabel('Quantidade de Membros que irão Participar:')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            const membrosInput = new TextInputBuilder()
                .setCustomId('membros')
                .setLabel('Nomes e IDs dos Membros:')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);
            const dataHoraInput = new TextInputBuilder()
                .setCustomId('dataHora')
                .setLabel('Data e Horário:')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            // Adicionando os campos no modal
            const row1 = new ActionRowBuilder().addComponents(nomeInput);
            const row2 = new ActionRowBuilder().addComponents(idInput);
            const row3 = new ActionRowBuilder().addComponents(orgInput);
            const row4 = new ActionRowBuilder().addComponents(tipoAcaoInput);
            const row5 = new ActionRowBuilder().addComponents(quantidadeMembrosInput);
            const row6 = new ActionRowBuilder().addComponents(membrosInput);
            const row7 = new ActionRowBuilder().addComponents(dataHoraInput);
            modal.addComponents(row1, row2, row3, row4, row5, row6, row7);
            await interaction.showModal(modal);
        }
    }
    // Verificando se a interação é um modal
    if (interaction instanceof ModalSubmitInteraction && interaction.customId === 'marcaracaoModal') {
        const nome = interaction.fields.getTextInputValue('nome');
        const id = interaction.fields.getTextInputValue('id');
        const org = interaction.fields.getTextInputValue('org');
        const tipoAcao = interaction.fields.getTextInputValue('tipoAcao');
        const quantidadeMembros = interaction.fields.getTextInputValue('quantidadeMembros');
        const membros = interaction.fields.getTextInputValue('membros');
        const dataHora = interaction.fields.getTextInputValue('dataHora');
        const acaoChannelId = 'SEU_CANAL_DE_ACOES'; // Defina o ID do canal onde as ações serão enviadas
        const acaoChannel = await interaction.guild.channels.fetch(acaoChannelId);
        if (!acaoChannel || !(acaoChannel instanceof TextChannel))
            return;
        const embedAcao = new EmbedBuilder()
            .setTitle('・・・AÇÃO MARCADA・・・')
            .setColor('Green')
            .addFields({ name: 'Nome:', value: nome }, { name: 'ID:', value: id }, { name: 'Organização:', value: org }, { name: 'Tipo de Ação:', value: tipoAcao }, { name: 'Quantidade de Membros:', value: quantidadeMembros }, { name: 'Membros:', value: membros }, { name: 'Data e Horário:', value: dataHora })
            .setTimestamp();
        try {
            // Enviar a ação para o canal
            await acaoChannel.send({ embeds: [embedAcao] });
            await interaction.reply({ content: '✅ Ação marcada com sucesso!', ephemeral: true });
        }
        catch (error) {
            console.error('Erro na marcação de ação:', error);
            await interaction.reply({ content: '❌ Ocorreu um erro ao marcar a ação.', ephemeral: true });
        }
    }
});
client.login(process.env.TOKEN);
// client.login(process.env.TOKEN);
