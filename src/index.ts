import {
    Client, GatewayIntentBits, Partials, EmbedBuilder, ButtonBuilder, ButtonStyle,
    ActionRowBuilder, Events, TextChannel, ModalBuilder, TextInputBuilder, TextInputStyle,
    InteractionType
  } from 'discord.js';
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
  
    const registroChannelId = '1267479401558446164'; // Canal de Solicitação de TAG
    const tagRequestChannel = await client.channels.fetch(registroChannelId);
    if (!tagRequestChannel || !(tagRequestChannel instanceof TextChannel)) return;
  
    const embedTagRequest = new EmbedBuilder()
      .setTitle('Solicitação de TAG da Organização')
      .setDescription('Solicite aqui a sua TAG da organização que você faz parte!')
      .setColor('Blue')
      .setThumbnail('https://media.discordapp.net/attachments/1365051116794023982/1365440096819609651/ILEGAL_LUX_simbolo_sem_fundo.png')
      .setImage('https://media.discordapp.net/attachments/1365051116794023982/1365798838379614279/CIDADE_LUX_BOT_17.gif?ex=680f478a&is=680df60a&hm=893f7bd9862c0bb7cb6deba74d810fc178932aff483f7bd28c8cf3135b4312ba&=');
  
    const tagRequestButton = new ButtonBuilder()
      .setCustomId('startTagRequest')
      .setLabel('Quero a minha TAG')
      .setEmoji('🎯')
      .setStyle(ButtonStyle.Primary);
  
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(tagRequestButton);
  
    await tagRequestChannel.send({ embeds: [embedTagRequest], components: [row] });
  });
  
  // INTERAÇÕES
  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.guild) return;
  
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
  
      const cargoInput = new TextInputBuilder()
        .setCustomId('cargo')
        .setLabel('Qual é o seu cargo em sua organização?')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);
  
      const primeiroRow = new ActionRowBuilder<TextInputBuilder>().addComponents(nomeInput);
      const segundoRow = new ActionRowBuilder<TextInputBuilder>().addComponents(idInput);
      const terceiroRow = new ActionRowBuilder<TextInputBuilder>().addComponents(orgInput);
      const quartoRow = new ActionRowBuilder<TextInputBuilder>().addComponents(cargoInput);
  
      modal.addComponents(primeiroRow, segundoRow, terceiroRow, quartoRow);
  
      await interaction.showModal(modal);
    }
  
    // MODAL DE SOLICITAÇÃO DE TAG
    if (interaction.type === InteractionType.ModalSubmit && interaction.customId === 'tagRequestModal') {
      const nome = interaction.fields.getTextInputValue('nome');
      const id = interaction.fields.getTextInputValue('id');
      const org = interaction.fields.getTextInputValue('org');
      const cargo = interaction.fields.getTextInputValue('cargo');
  
      const tagRequestChannelId = '1365800661593362543'; // Canal para enviar a solicitação de TAG
      const tagRequestChannel = await interaction.guild.channels.fetch(tagRequestChannelId);
  
      if (!tagRequestChannel || !(tagRequestChannel instanceof TextChannel)) return;
  
      const embedTagRequest = new EmbedBuilder()
        .setTitle('Solicitação de TAG')
        .setColor('Blue')
        .setThumbnail('https://media.discordapp.net/attachments/1365051116794023982/1365440096819609651/ILEGAL_LUX_simbolo_sem_fundo.png')
        .addFields(
          { name: 'Nome na Cidade:', value: nome },
          { name: 'ID:', value: id },
          { name: 'Organização:', value: org },
          { name: 'Cargo:', value: cargo },
          { name: 'Usuário:', value: `<@${interaction.user.id}>` }
        )
        .setTimestamp();
  
      try {
        // Enviar solicitação de TAG
        await tagRequestChannel.send({ embeds: [embedTagRequest] });
  
        await interaction.reply({ content: '✅ Sua solicitação de TAG foi enviada com sucesso!', ephemeral: true });
      } catch (error) {
        console.error('Erro na solicitação de TAG:', error);
        await interaction.reply({ content: '❌ Ocorreu um erro ao solicitar sua TAG.', ephemeral: true });
      }
    }
  });
  
  // Reconectar automaticamente caso o bot desconecte
  client.on('disconnect', () => {
    console.log('Bot desconectado. Tentando reconectar...');
    client.login(process.env.BOT_TOKEN);
  });
  
  // Tratamento de erros
  client.on(Events.Error, (error) => {
    console.error('Erro no bot:', error);
  });
  
  client.login(process.env.BOT_TOKEN);
  