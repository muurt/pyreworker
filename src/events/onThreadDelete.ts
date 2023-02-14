import { MessageEmbed, ThreadChannel } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onThreadDelete = async (thread: ThreadChannel): Promise<void> => {
  const threadEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Thread Deleted")
    .setDescription(`A thread has been deleted.`)
    .addFields({ name: "Thread Name", value: `\`\`\`${thread.name}\`\`\`` })
    .setTimestamp();
  logHandler.info(
    `event | ${thread.name} thread has been deleted. Logged to Central Archives.`
  );
  await sendLogMessage(thread.client, threadEmbed);
};
