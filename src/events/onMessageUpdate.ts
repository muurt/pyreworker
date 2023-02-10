/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed, TextChannel } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";
import { feedback } from "../utils/perspectiveFeedback";
export let analyzationStatus = false;

export const onMessageUpdate = async (
  oldMessage: any,
  newMessage: any
): Promise<void> => {
  if (newMessage.author.bot) {
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
        name: newMessage.author.tag,
        iconURL: newMessage.author.displayAvatarURL(),
      })
      .setColor(colors.gray)
      .setDescription("A user triggered the AI-moderation.")
      .addFields(
        {
          name: "Tag",
          value: newMessage.author.tag,
        },
        {
          name: "ID",
          value: newMessage.author.id,
        },
        {
          name: "Profile",
          value: `<@${newMessage.author.id}>`,
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
  const messageEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Message Updated")
    .setDescription(`A message has been updated.`)
    .addField("Old Message Content", `\`\`\`${oldMessage.content}\`\`\``, false)
    .addField("New Message Content", `\`\`\`${newMessage.content}\`\`\``, false)
    .addField("Message Author", `\`\`\`${newMessage.author}\`\`\``, false)
    .addField("Message Channel", `\`\`\`${newMessage.channel}\`\`\``, false)
    .addField("Message ID", `\`\`\`${newMessage.id}\`\`\``, false)
    .setThumbnail(newMessage.author.avatarURL())
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
