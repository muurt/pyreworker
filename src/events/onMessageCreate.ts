import { errorHandler } from "../utils/errorHandler";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import { feedback } from "../utils/prespectiveFeedback";
import { colors } from "../config/colors";

export const onMessageCreate = async (message: Message): Promise<void> => {
  try {
    if (
      message.author.bot ||
      message.guild?.members.cache
        .get(message.author.id)
        ?.roles.cache.has("840977433658392586")
    ) {
      return;
    }
    let analyzation = await feedback(message, message.toString());
    if (analyzation) {
      const userInfo = new MessageEmbed()
        .setTitle("WARNING!")
        .setAuthor({
          name: message.author.tag,
          iconURL: message.author.displayAvatarURL(),
        })
        .setColor(colors.gray)
        .setDescription("A user triggered the AI-moderation.")
        .addFields(
          {
            name: "Tag",
            value: message.author.tag,
          },
          {
            name: "ID",
            value: message.author.id,
          },
          {
            name: "Profile",
            value: `<@${message.author.id}>`,
          },
          {
            name: "Message",
            value: message.toString(),
          }
        )
        .setFooter({
          text: "© Pyreworks | EXPERIMENTAL FEATURE",
          iconURL: message.client.user?.displayAvatarURL(),
        });
      await message.delete();
      await message.channel.send({ embeds: [analyzation] });
      analyzation = analyzation.setTitle("").setDescription("").setAuthor({
        name: "",
      });
      await (
        message.guild?.channels.cache.get("957358695640096778") as TextChannel
      ).send({
        embeds: [userInfo, analyzation],
      });
    }
  } catch (err) {
    errorHandler("onMessageCreate event", err);
  }
};
