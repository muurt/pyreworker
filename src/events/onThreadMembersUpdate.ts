/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onThreadMembersUpdate = async (
  oldMembers: any,
  newMembers: any
): Promise<void> => {
  const threadEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Thread Members Updated")
    .setDescription(`A thread's members have been updated.`)
    .addField("Thread Name", `\`\`\`${oldMembers.name}\`\`\``, false)
    .addField("Old Members", `\`\`\`${oldMembers}\`\`\``, false)
    .addField("New Members", `\`\`\`${newMembers}\`\`\``, false)
    .setTimestamp();
  logHandler.info(
    `event | ${oldMembers.name}'s thread members have been updated. Logged to Central Archives.`
  );
  await sendLogMessage(oldMembers.client, threadEmbed);
};
