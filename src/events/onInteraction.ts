import { Interaction } from "discord.js";
import { commandList } from "../commands/_commandList";
import { errorHandler } from "../utils/errorHandler";

export const onInteraction = async (
  interaction: Interaction
): Promise<void> => {
  try {
    if (interaction.isCommand()) {
      for (const command of commandList) {
        if (interaction.commandName === command.data.name) {
          await command.run(interaction);
          break;
        }
      }
    }
  } catch (err) {
    errorHandler("onInteraction event", err);
  }
};
