import { MessageEmbed, ThreadChannel } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onThreadUpdate = async (
  oldThread: ThreadChannel,
  newThread: ThreadChannel
): Promise<void> => {
  const threadEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Thread Updated")
    .setDescription(`A thread has been updated.`)
    .addFields(
      { name: "Old Thread Name", value: `\`\`\`${oldThread.name}\`\`\`` },
      { name: "New Thread Name", value: `\`\`\`${newThread.name}\`\`\`` },
      { name: "Thread ID", value: `\`\`\`${oldThread.id}\`\`\`` },
      { name: "Old Thread Type", value: `\`\`\`${oldThread.type}\`\`\`` },
      { name: "New Thread Type", value: `\`\`\`${newThread.type}\`\`\`` },
      { name: "Thread Archived?", value: `\`\`\`${oldThread.archived}\`\`\`` },
      { name: "Thread Locked?", value: `\`\`\`${oldThread.locked}\`\`\`` },
      { name: "Thread Archived?", value: `\`\`\`${oldThread.archived}\`\`\`` },
      { name: "Thread Locked?", value: `\`\`\`${oldThread.locked}\`\`\`` },
      { name: "Thread Owner ID", value: `\`\`\`${oldThread.ownerId}\`\`\`` },

      {
        name: "Old Thread Auto Archive Duration",
        value: `\`\`\`${oldThread.autoArchiveDuration}\`\`\``,
      },
      {
        name: "New Thread Auto Archive Duration",
        value: `\`\`\`${newThread.autoArchiveDuration}\`\`\``,
      },
      {
        name: "Old Thread Rate Limit Per User",
        value: `\`\`\`${oldThread.rateLimitPerUser}\`\`\``,
      },
      {
        name: "New Thread Rate Limit Per User",
        value: `\`\`\`${newThread.rateLimitPerUser}\`\`\``,
      },
      {
        name: "Old Thread Member Count",
        value: `\`\`\`${oldThread.memberCount}\`\`\``,
      },
      {
        name: "New Thread Member Count",
        value: `\`\`\`${newThread.memberCount}\`\`\``,
      }
    )
    .setTimestamp();
  logHandler.info(
    `event | ${oldThread.name} thread has been updated. Logged to Central Archives.`
  );
  await sendLogMessage(oldThread.client, threadEmbed);
};
