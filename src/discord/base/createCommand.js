// createCommand.ts
import { SlashCommandBuilder } from 'discord.js';
// Função para criar comandos
export function createCommand(options) {
    // Criar o comando utilizando o SlashCommandBuilder do discord.js
    const command = new SlashCommandBuilder()
        .setName(options.name)
        .setDescription(options.description);
    return {
        data: command.toJSON(),
        execute: options.run,
    };
}
