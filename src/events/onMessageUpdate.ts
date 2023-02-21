import { Message, MessageEmbed, PartialMessage, TextChannel } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";
import { feedback } from "../utils/perspectiveFeedback";
export let analyzationStatus = false;

export const onMessageUpdate = async (
  oldMessage: Message | PartialMessage,
  newMessage: Message | PartialMessage
): Promise<void> => {
  if (newMessage.author?.bot) {
    return;
  }
  if (newMessage.content === oldMessage.content) {
    return;
  }
  let analyzation = await feedback(newMessage, newMessage.toString());
  if (analyzation) {
    analyzationStatus = true;
    const userInfo = new MessageEmbed()
      .setTitle("WARN!")
      .setAuthor({
        name: newMessage.author ? newMessage.author.tag : "NULL",
        iconURL: newMessage.author
          ? newMessage.author.displayAvatarURL()
          : "NULL",
      })
      .setColor(colors.warn)
      .setDescription("A user triggered the AI-moderation.")
      .addFields(
        {
          name: "Tag",
          value: newMessage.author ? newMessage.author.tag : "NULL",
        },
        {
          name: "ID",
          value: newMessage.author ? newMessage.author.id : "NULL",
        },
        {
          name: "Profile",
          value: `<@${newMessage.author?.id}>`,
        },
        {
          name: "Message",
          value: newMessage.toString(),
        }
      )
      .setFooter({
        text: "© Pyreworks | EXPERIMENTAL FEATURE",
        iconURL: newMessage.client.user?.displayAvatarURL(),
      });
    await newMessage.delete();
    await newMessage.channel.send({ embeds: [analyzation] });
    analyzation = analyzation.setTitle("").setDescription("").setAuthor({
      name: "",
    });
    await (
      newMessage.guild?.channels.cache.get("885782013204910092") as TextChannel
    ).send({
      embeds: [userInfo, analyzation],
    });
  }
  if (
    !newMessage.author?.displayAvatarURL() ||
    newMessage.author.displayAvatarURL() === null
  ) {
    return;
  }
  const messageEmbed = new MessageEmbed()
    .setColor(colors.success)
    .setTitle("Message Updated")
    .setDescription(`A message has been updated.`)
    .addFields(
      {
        name: "Old Message Content",
        value: `\`\`\`${oldMessage.content}\`\`\``,
      },
      {
        name: "New Message Content",
        value: `\`\`\`${newMessage.content}\`\`\``,
      },
      { name: "Message Author", value: `\`\`\`${newMessage.author}\`\`\`` },
      { name: "Message Channel", value: `\`\`\`${newMessage.channel}\`\`\`` },
      { name: "Message ID", value: `\`\`\`${newMessage.id}\`\`\`` }
    )
    .setThumbnail(newMessage.author.displayAvatarURL())
    .setTimestamp();
  if (analyzationStatus === false) {
    logHandler.info(
      `event | A message has been updated: ${oldMessage.content} -> ${newMessage.content}`
    );
    await sendLogMessage(newMessage.client, messageEmbed);
  } else {
    await sendLogMessage(newMessage.client, messageEmbed);
  }
};
