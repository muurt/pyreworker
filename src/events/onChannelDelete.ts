/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "./sendLogMessage";
import { colors } from "../config/colors";

export const onChannelDelete = async (channel: any): Promise<void> => {
  const channelEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Channel Deleted")
    .setDescription(`A channel has been deleted.`)
    .addField("Channel Name", `| ${channel.name}`, false)
    .setTimestamp();
  logHandler.log(
    "info",
    `${channel.name} has been deleted. Channel ID: ${channel.id}`
  );
  await sendLogMessage(channel.client, channelEmbed);
};
