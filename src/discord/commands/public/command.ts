import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

// Criar o cliente do Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers
  ]
});

const commands = [
  new SlashCommandBuilder().setName('marcaracao').setDescription('Marque uma ação para ser realizada no servidor')
    .addStringOption(option =>
      option.setName('nome')
        .setDescription('Nome da pessoa')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('id')
        .setDescription('ID do membro')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('organizacao')
        .setDescription('Nome da organização')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('tipoacao')
        .setDescription('Tipo da ação')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('quantidade')
        .setDescription('Quantidade de membros participantes')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('membros')
        .setDescription('Nomes e IDs dos membros')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('datahora')
        .setDescription('Data e horário da ação')
        .setRequired(true)
    )
];

// Registrar comandos com a API Discord
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!);

(async () => {
  try {
    console.log('Iniciando o registro dos comandos...');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID!),
      { body: commands },
    );

    console.log('Comandos registrados com sucesso!');
  } catch (error) {
    console.error('Erro ao registrar os comandos:', error);
  }
})();
