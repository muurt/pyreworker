import { errorHandler } from "../utils/errorHandler";
import { logHandler } from "../utils/logHandler";
import { REST } from "@discordjs/rest";
import { APIApplicationCommandOption, Routes } from "discord-api-types/v9";
import { commandList } from "../commands/_commandList";
import { Client } from "discord.js";

/**
 * Handles the "ready" event for the bot.
 * @param {Client} botInstance - The bot instance.
 * @returns {Promise<void>} - A promise that resolves when the function finishes executing.
 */
export const onReady = async (botInstance: Client): Promise<void> => {
  try {
    const restClient = new REST({ version: "9" }).setToken(
      process.env.botToken as string
    );

    const commandData: {
      name: string;
      description?: string;
      type?: number;
      options?: APIApplicationCommandOption[];
    }[] = [];

    for (const command of commandList) {
      commandData.push(
        command.data.toJSON() as {
          name: string;
          description?: string;
          type?: number;
          options?: APIApplicationCommandOption[];
        }
      );
    }
    const commandsRoute = Routes.applicationGuildCommands(
      botInstance.user?.id || "Missing token",
      process.env.guildId as string
    );
    await restClient.put(commandsRoute, { body: commandData });

    botInstance.user?.setStatus("dnd");
    botInstance.user?.setActivity(
      `Pyreworks | Beta ${process.env.npm_package_version}`,
      { type: "WATCHING" }
    );

    logHandler.log("info", "Connection with Discord established!");
  } catch (err) {
    errorHandler("onReady event", err);
  }
};
