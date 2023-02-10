/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onGuildUpdate = async (
  oldGuild: any,
  newGuild: any
): Promise<void> => {
  const guildEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Guild Updated")
    .setDescription(`A guild has been updated.`)
    .addField("Old Guild Name", `\`\`\`${oldGuild.name}\`\`\``, false)
    .addField("New Guild Name", `\`\`\`${newGuild.name}\`\`\``, false)
    .addField("Old Guild ID", `\`\`\`${oldGuild.id}\`\`\``, false)
    .addField("New Guild ID", `\`\`\`${newGuild.id}\`\`\``, false)
    .addField("Old Guild Owner", `\`\`\`${oldGuild.owner}\`\`\``, false)
    .addField("New Guild Owner", `\`\`\`${newGuild.owner}\`\`\``, false)
    .addField("Old Guild Region", `\`\`\`${oldGuild.region}\`\`\``, false)
    .addField("New Guild Region", `\`\`\`${newGuild.region}\`\`\``, false)
    .addField(
      "Old Guild Verification Level",
      `\`\`\`${oldGuild.verificationLevel}\`\`\``,
      false
    )
    .addField(
      "New Guild Verification Level",
      `\`\`\`${newGuild.verificationLevel}\`\`\``,
      false
    )
    .addField(
      "Old Guild Explicit Content Filter",
      `\`\`\`${oldGuild.explicitContentFilter}\`\`\``,
      false
    )
    .addField(
      "New Guild Explicit Content Filter",
      `\`\`\`${newGuild.explicitContentFilter}\`\`\``,
      false
    )
    .addField(
      "Old Guild Default Message Notifications",
      `\`\`\`${oldGuild.defaultMessageNotifications}\`\`\``,
      false
    )
    .addField(
      "New Guild Default Message Notifications",
      `\`\`\`${newGuild.defaultMessageNotifications}\`\`\``,
      false
    )
    .addField(
      "Old Guild Description",
      `\`\`\`${oldGuild.description}\`\`\``,
      false
    )
    .addField(
      "New Guild Description",
      `\`\`\`${newGuild.description}\`\`\``,
      false
    )
    .setThumbnail(newGuild.iconURL())
    .setTimestamp();
  logHandler.info(
    `event | Pyreworks Discord has been updated. Logged to Central Archives.`
  );
  await sendLogMessage(newGuild.client, guildEmbed);
};
