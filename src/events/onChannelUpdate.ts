/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "./sendLogMessage";
import { colors } from "../config/colors";

export const onChannelUpdate = async (
  oldChannel: any,
  newChannel: any
): Promise<void> => {
  const channelEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Channel Updated")
    .setDescription("A channel has been updated.")
    .addField("Old Channel Name", `| ${oldChannel.name}`, false)
    .addField("New Channel Name", `| ${newChannel.name}`, false)
    .addField("Old Channel Type", `| ${oldChannel.type}`, false)
    .addField("New Channel Type", `| ${newChannel.type}`, false)
    .addField("Channel ID", `| ${oldChannel.id}`, false)
    .setTimestamp();
  logHandler.log(
    "info",
    `${oldChannel.name} has been updated. Channel ID: ${newChannel.name}`
  );
  await sendLogMessage(oldChannel.client, channelEmbed);
};
