import { MessageEmbed, ThreadChannel } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onThreadCreate = async (thread: ThreadChannel): Promise<void> => {
  const threadEmbed = new MessageEmbed()
    .setColor(colors.success)
    .setTitle("Thread Created")
    .setDescription(`A new thread has been created.`)
    .addFields(
      { name: "Thread Name", value: `\`\`\`${thread.name}\`\`\`` },
      { name: "Thread Type", value: `\`\`\`${thread.type}\`\`\`` },
      { name: "Thread ID", value: `\`\`\`${thread.id}\`\`\`` },
      { name: "Thread Archived?", value: `\`\`\`${thread.archived}\`\`\`` },
      { name: "Thread Locked?", value: `\`\`\`${thread.locked}\`\`\`` },
      {
        name: "Thread Auto Archive Duration",
        value: `\`\`\`${thread.autoArchiveDuration}\`\`\``,
      },
      {
        name: "Thread Member Count",
        value: `\`\`\`${thread.memberCount}\`\`\``,
      },
      { name: "Thread Owner ID", value: `\`\`\`${thread.ownerId}\`\`\`` }
    )
    .setTimestamp();
  logHandler.info(
    `event | ${thread.name} thread has been created. Logged to Central Archives.`
  );
  await sendLogMessage(thread.client, threadEmbed);
};
