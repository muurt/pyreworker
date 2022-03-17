import { errorHandler } from "../utils/errorHandler";
import { Message } from "discord.js";
import { feedback } from "../utils/prespectiveFeedback";

export const onMessageCreate = async (message: Message): Promise<void> => {
  try {
    const analyzation = await feedback(message, message.toString());
    if (analyzation) {
      message.channel.send({ embeds: [analyzation] });
    }
  } catch (err) {
    errorHandler("onMessageCreate event", err);
  }
};
