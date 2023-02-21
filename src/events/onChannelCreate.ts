import { GuildChannel, MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onChannelCreate = async (channel: GuildChannel): Promise<void> => {
  const channelEmbed = new MessageEmbed()
    .setColor(colors.success)
    .setTitle("Channel Created")
    .setDescription(`A channel has been created.`)
    .addFields([
      {
        name: "Channel Name",
        value: `\`\`\`${channel.name}\`\`\``,
        inline: false,
      },
      {
        name: "Channel Type",
        value: `\`\`\`${channel.type}\`\`\``,
        inline: false,
      },
      { name: "Channel ID", value: `\`\`\`${channel.id}\`\`\``, inline: false },
    ])
    .setTimestamp();
  logHandler.info(
    `event | #${channel.name} channel has been created. Logged to Central Archives.`
  );
  await sendLogMessage(channel.client, channelEmbed);
};
