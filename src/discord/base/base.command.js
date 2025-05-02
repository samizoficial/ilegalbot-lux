import { logger } from "#settings";
import { brBuilder } from "@magicyan/discord";
import ck from "chalk";
import { ApplicationCommandType, } from "discord.js";
import { baseStorage } from "./base.storage.js";
// ⚡️ Correção aqui: Melhor tratamento de erros e verificação
export async function baseCommandHandler(interaction) {
    try {
        const { onNotFound, middleware, onError } = baseStorage.config.commands;
        const command = baseStorage.commands.get(interaction.commandName);
        if (!command) {
            if (onNotFound)
                await onNotFound(interaction);
            else
                await interaction.reply({ content: "Comando não encontrado.", ephemeral: true });
            return;
        }
        let blocked = false;
        if (middleware) {
            await middleware(interaction, () => (blocked = true));
        }
        if (blocked)
            return;
        await command.run(interaction);
    }
    catch (error) {
        const { onError } = baseStorage.config.commands;
        if (onError) {
            await onError(error, interaction);
        }
        else if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: "Ocorreu um erro ao executar o comando.", ephemeral: true });
        }
        else {
            console.error(error);
        }
    }
}
export async function baseAutocompleteHandler(interaction) {
    try {
        const command = baseStorage.commands.get(interaction.commandName);
        if (command && "autocomplete" in command && typeof command.autocomplete === "function") {
            const choices = await command.autocomplete(interaction);
            if (choices && Array.isArray(choices)) {
                await interaction.respond(choices.slice(0, 25));
            }
        }
    }
    catch (error) {
        console.error("Erro no autocomplete:", error);
    }
}
export async function baseRegisterCommands(client) {
    const plural = (value) => (value !== 1 ? "s" : "");
    const guilds = client.guilds.cache.filter(({ id }) => baseStorage.config.commands.guilds.includes(id));
    const messages = [];
    const [globalCommands, guildCommands] = baseStorage.commands.partition(c => c.global === true).map(c => Array.from(c.values()));
    if (guilds.size > 0) {
        await client.application.commands.set(globalCommands);
        for (const guild of guilds.values()) {
            await guild.commands.set(guildCommands);
        }
        messages.push(ck.greenBright(`└ ${guildCommands.length} comando${plural(guildCommands.length)} registrado${plural(guildCommands.length)} nas guilds.`));
    }
    else {
        const commands = Array.from(baseStorage.commands.values());
        await client.application.commands.set(commands);
        messages.push(ck.greenBright(`└ ${commands.length} comando${plural(commands.length)} registrado globalmente.`));
    }
    if (baseStorage.config.commands.verbose) {
        messages.push(...verboseLogs(client.application.commands.cache));
    }
    logger.log(brBuilder(messages));
}
function verboseLogs(commands) {
    const u = ck.underline;
    return commands.map(({ id, name, type: commandType, client, createdAt, guild }) => {
        const [icon] = getCommandTitle(commandType);
        return ck.dim.green([
            ` └ ${icon}`,
            u.cyan(id),
            "CRIOU",
            u.blue(name),
            ck.gray(">"),
            guild ? `${u.blue(guild.name)} guild` : `${u.blue(client.user.username)} app`,
            ck.gray(">"),
            "em:",
            u.greenBright(createdAt.toLocaleTimeString()),
        ].join(" "));
    });
}
export function baseCommandLog(data) {
    const [icon, type] = getCommandTitle(data.type);
    baseStorage.loadLogs.commands.push(ck.green(`${icon} ${type} ${ck.gray(">")} ${ck.blue.underline(data.name)} ✓`));
}
function getCommandTitle(type) {
    switch (type) {
        case ApplicationCommandType.Message:
            return ["{☰}", "Message Context Menu"];
        case ApplicationCommandType.User:
            return ["{☰}", "User Context Menu"];
        default:
            return ["{/}", "Slash Command"];
    }
}
