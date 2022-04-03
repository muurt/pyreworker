import { errorHandler } from "../utils/errorHandler";
import { logHandler } from "../utils/logHandler";
import { REST } from "@discordjs/rest";
import { APIApplicationCommandOption, Routes } from "discord-api-types/v9";
import { commandList } from "../commands/_commandList";
import { Client } from "discord.js";
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

    commandList.forEach((command) =>
      commandData.push(
        command.data.toJSON() as {
          name: string;
          description?: string;
          type?: number;
          options?: APIApplicationCommandOption[];
        }
      )
    );
    await restClient.put(
      Routes.applicationGuildCommands(
        botInstance.user?.id || "Missing token",
        process.env.guildId as string
      ),
      { body: commandData }
    );
    logHandler.log("info", "Connection with Discord established!");
  } catch (err) {
    errorHandler("onReady event", err);
  }
};