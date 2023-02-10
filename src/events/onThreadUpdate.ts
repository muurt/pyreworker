/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onThreadUpdate = async (
  oldThread: any,
  newThread: any
): Promise<void> => {
  const threadEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Thread Updated")
    .setDescription(`A thread has been updated.`)
    .addField("Old Thread Name", `\`\`\`${oldThread.name}\`\`\``, false)
    .addField("New Thread Name", `\`\`\`${newThread.name}\`\`\``, false)
    .addField("Thread ID", `\`\`\`${oldThread.id}\`\`\``, false)
    .addField("Old Thread Type", `\`\`\`${oldThread.type}\`\`\``, false)
    .addField("New Thread Type", `\`\`\`${newThread.type}\`\`\``, false)
    .addField("Thread Archived?", `\`\`\`${oldThread.archived}\`\`\``, false)
    .addField("Thread Locked?", `\`\`\`${oldThread.locked}\`\`\``, false)
    .addField(
      "Old Thread Auto Archive Duration",
      `\`\`\`${oldThread.autoArchiveDuration}\`\`\``,
      false
    )
    .addField(
      "New Thread Auto Archive Duration",
      `\`\`\`${newThread.autoArchiveDuration}\`\`\``,
      false
    )
    .addField(
      "Old Thread Rate Limit Per User",
      `\`\`\`${oldThread.rateLimitPerUser}\`\`\``,
      false
    )
    .addField(
      "New Thread Rate Limit Per User",
      `\`\`\`${newThread.rateLimitPerUser}\`\`\``,
      false
    )
    .addField(
      "Old Thread Member Count",
      `\`\`\`${oldThread.memberCount}\`\`\``,
      false
    )
    .addField(
      "New Thread Member Count",
      `\`\`\`${newThread.memberCount}\`\`\``,
      false
    )
    .addField("Thread Owner ID", `\`\`\`${oldThread.ownerID}\`\`\``, false)
    .setTimestamp();
  logHandler.info(
    `event | ${oldThread.name} thread has been updated. Logged to Central Archives.`
  );
  await sendLogMessage(oldThread.client, threadEmbed);
};
