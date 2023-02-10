/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onThreadCreate = async (thread: any): Promise<void> => {
  const threadEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Thread Created")
    .setDescription(`A new thread has been created.`)
    .addField("Thread Name", `\`\`\`${thread.name}\`\`\``, false)
    .addField("Thread Type", `\`\`\`${thread.type}\`\`\``, false)
    .addField("Thread ID", `\`\`\`${thread.id}\`\`\``, false)
    .addField("Thread Archived?", `\`\`\`${thread.archived}\`\`\``, false)
    .addField("Thread Locked?", `\`\`\`${thread.locked}\`\`\``, false)
    .addField(
      "Thread Auto Archive Duration",
      `\`\`\`${thread.autoArchiveDuration}\`\`\``,
      false
    )
    .addField("Thread Member Count", `\`\`\`${thread.memberCount}\`\`\``, false)
    .addField("Thread Owner ID", `\`\`\`${thread.ownerID}\`\`\``, false)
    .setTimestamp();
  logHandler.info(
    `event | ${thread.name} thread has been created. Logged to Central Archives.`
  );
  await sendLogMessage(thread.client, threadEmbed);
};
