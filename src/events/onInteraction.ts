import { Interaction } from "discord.js";
import { commandList } from "../commands/_commandList";
import { errorHandler } from "../utils/errorHandler";

/*
 * ➞ OnInteraction.ts
 * The file for handling interaction events
 */

/*
 * ➞ onInteraction
 * ➞ interaction | The interaction to handle
 * ➞ Return type | Promises void
 * Checks if the interaction is a slash command
 * If so, it checks the commandList for the command name, if it finds it
 * it runs the "run" function of the command, else it does nothing
 ! In the future this will handle context menus and such
 */

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
