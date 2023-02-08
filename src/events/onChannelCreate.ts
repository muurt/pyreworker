/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "./sendLogMessage";
import { colors } from "../config/colors";

export const onChannelCreate = async (channel: any): Promise<void> => {
  const channelEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Channel Created")
    .setDescription(`A channel has been created.`)
    .addField("Channel Name", `| ${channel.name}`, false)
    .addField("Channel Type", `| ${channel.type}`, false)
    .addField("Channel ID", `| ${channel.id}`, false)
    .addField("Channel Topic", `| ${channel.topic}`, false)
    .setTimestamp();
  logHandler.log(
    "info",
    `${channel.name} has been created. Channel ID: ${channel.id}`
  );
  await sendLogMessage(channel.client, channelEmbed);
};
