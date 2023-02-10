/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onChannelUpdate = async (
  oldChannel: any,
  newChannel: any
): Promise<void> => {
  const channelEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Channel Updated")
    .setDescription("A channel has been updated.")
    .addField("Old Channel Name", `\`\`\`${oldChannel.name}\`\`\``, false)
    .addField("New Channel Name", `\`\`\`${newChannel.name}\`\`\``, false)
    .addField("Old Channel Type", `\`\`\`${oldChannel.type}\`\`\``, false)
    .addField("New Channel Type", `\`\`\`${newChannel.type}\`\`\``, false)
    .addField("Channel ID", `\`\`\`${oldChannel.id}\`\`\``, false)
    .setTimestamp();
  logHandler.info(
    `event | #${oldChannel.name} channel has been updated. Logged to Central Archives.`
  );
  await sendLogMessage(oldChannel.client, channelEmbed);
};
