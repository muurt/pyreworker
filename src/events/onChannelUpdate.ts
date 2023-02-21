import {
  DMChannel,
  MessageEmbed,
  NonThreadGuildBasedChannel,
} from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onChannelUpdate = async (
  oldChannel: NonThreadGuildBasedChannel | DMChannel,
  newChannel: NonThreadGuildBasedChannel | DMChannel
): Promise<void> => {
  if (oldChannel instanceof DMChannel || newChannel instanceof DMChannel) {
    return;
  }
  const channelEmbed = new MessageEmbed()
    .setColor(colors.success)
    .setTitle("Channel Updated")
    .setDescription("A channel has been updated.")
    .addFields([
      {
        name: "Old Channel Name",
        value: `\`\`\`${oldChannel.name}\`\`\``,
        inline: false,
      },
      {
        name: "New Channel Name",
        value: `\`\`\`${newChannel.name}\`\`\``,
        inline: false,
      },
      {
        name: "Old Channel Type",
        value: `\`\`\`${oldChannel.type}\`\`\``,
        inline: false,
      },
      {
        name: "New Channel Type",
        value: `\`\`\`${newChannel.type}\`\`\``,
        inline: false,
      },
      {
        name: "Channel ID",
        value: `\`\`\`${oldChannel.id}\`\`\``,
        inline: false,
      },
    ])
    .setTimestamp();
  logHandler.info(
    `event | #${oldChannel.name} channel has been updated. Logged to Central Archives.`
  );
  await sendLogMessage(oldChannel.client, channelEmbed);
};
