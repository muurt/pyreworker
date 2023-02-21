import { DMChannel, GuildChannel, MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onChannelDelete = async (
  channel: GuildChannel | DMChannel
): Promise<void> => {
  if (channel instanceof DMChannel) {
    return;
  }
  const channelEmbed = new MessageEmbed()
    .setColor(colors.success)
    .setTitle("Channel Deleted")
    .setDescription(`A channel has been deleted.`)
    .addFields({
      name: "Channel Name",
      value: `\`\`\`${channel.name}\`\`\``,
      inline: false,
    })
    .setTimestamp();
  logHandler.info(
    `event | #${channel.name} channel has been deleted. Logged to Central Archives.`
  );
  await sendLogMessage(channel.client, channelEmbed);
};
