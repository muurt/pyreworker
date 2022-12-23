import { errorHandler } from "./errorHandler";
import { logHandler } from "./logHandler";
import { Interaction, Message, MessageEmbed } from "discord.js";
import { analyzeText } from "./perspectiveHandler";
import { PerspectiveAttribute } from "../typings/perspective";
import { colors } from "../config/colors";

export const feedback = async (
  context: Interaction | Message,
  text: string
): Promise<MessageEmbed | void> => {
  try {
    const attributeArray: PerspectiveAttribute[] = [
      "PROFANITY",
      "SPAM",
      "SEVERE_TOXICITY",
      "INSULT",
      "THREAT",
      "IDENTITY_ATTACK",
    ];
    const analyzedText = await analyzeText(text, attributeArray);
    if (analyzedText) {
      const normalThreshold = 70;
      const highThreshold = 80;
      const experimentalThreshold = 85;
      const veryHighThreshold = 90;
      let username: string;
      let tag: string;
      let usravatar;
      let clientavatar;
      if (context instanceof Interaction) {
        username = context.user.username;
        tag = context.user.discriminator;
        usravatar = context.user.displayAvatarURL();
        clientavatar = context.client.user?.displayAvatarURL();
      } else if (context instanceof Message) {
        username = context.author.username;
        tag = context.author.discriminator;
        usravatar = context.author.displayAvatarURL();
        clientavatar = context.client.user?.displayAvatarURL();
      } else {
        return;
      }
      const warnEmbed = new MessageEmbed()
        .setTitle("WARNING!")
        .setAuthor({
          name: `${username}#${tag}`,
          iconURL: usravatar,
        })
        .setColor(colors.gray)
        .setDescription("That message triggered our AI moderation module!")
        .setFooter({
          text: "© Pyreworks | EXPERIMENTAL FEATURE",
          iconURL: clientavatar,
        });
      let flagged = false;
      attributeArray.forEach(async (attribute) => {
        let usedThreshold;
        switch (attribute) {
          case "PROFANITY":
            usedThreshold = highThreshold;
            break;
          case "INSULT":
            usedThreshold = highThreshold;
            break;
          case "SPAM":
            usedThreshold = veryHighThreshold;
            break;
          case "FLIRTATION":
            usedThreshold = experimentalThreshold;
            break;
          case "THREAT":
            usedThreshold = highThreshold;
            break;
          default:
            usedThreshold = normalThreshold;
            break;
        }
        const value =
          analyzedText["attributeScores"][attribute]["summaryScore"]["value"];
        const percentage = Math.round(value * 100);
        if (percentage > usedThreshold) {
          warnEmbed.addField(attribute, `${percentage}%`);
          flagged = true;
        }
      });
      if (flagged) {
        logHandler.log(
          "warn",
          `A user with the tag ${username}#${tag} triggered the Automod with the message "${text}".`
        );
        return warnEmbed;
      }
      return;
    }
  } catch (err) {
    errorHandler("perspectiveFeedback module", err);
  }
};
