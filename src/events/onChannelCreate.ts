/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onChannelCreate = async (channel: any): Promise<void> => {
  const channelEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Channel Created")
    .setDescription(`A channel has been created.`)
    .addField("Channel Name", `\`\`\`${channel.name}\`\`\``, false)
    .addField("Channel Type", `\`\`\`${channel.type}\`\`\``, false)
    .addField("Channel ID", `\`\`\`${channel.id}\`\`\``, false)
    .addField("Channel Topic", `\`\`\`${channel.topic}\`\`\``, false)
    .setTimestamp();
  // eslint-disable-next-line prettier/prettier
  logHandler.info(`event | #${channel.name} channel has been created. Logged to Central Archives.`);
  await sendLogMessage(channel.client, channelEmbed);
};
