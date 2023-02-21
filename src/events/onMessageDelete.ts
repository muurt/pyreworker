import { MessageEmbed, Message, PartialMessage } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";
import { analyzationStatus } from "../events/onMessageUpdate";

export const onMessageDelete = async (
  message: Message | PartialMessage
): Promise<void> => {
  const messageEmbed = new MessageEmbed()
    .setColor(colors.success)
    .setTitle("Message Deleted")
    .setDescription(`A message has been deleted.`)
    .addFields(
      {
        name: "Message Content",
        value: `\`\`\`${message.content}\`\`\``,
        inline: false,
      },
      {
        name: "Message Author",
        value: `\`\`\`${message.author}\`\`\``,
        inline: false,
      },
      {
        name: "Message Channel",
        value: `\`\`\`${message.channel}\`\`\``,
        inline: false,
      },
      { name: "Message ID", value: `\`\`\`${message.id}\`\`\``, inline: false }
    )
    .setThumbnail(message.author ? message.author.displayAvatarURL() : "NULL")
    .setTimestamp();
  if (analyzationStatus === true) {
    await sendLogMessage(message.client, messageEmbed);
    return;
  } else {
    logHandler.info(`event | A message has been deleted: ${message.content}`);
    await sendLogMessage(message.client, messageEmbed);
    return;
  }
};
