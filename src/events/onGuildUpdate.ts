import { Guild, MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onGuildUpdate = async (
  oldGuild: Guild,
  newGuild: Guild
): Promise<void> => {
  const guildEmbed = new MessageEmbed()
    .setColor(colors.success)
    .setTitle("Guild Updated")
    .setDescription(`A guild has been updated.`)
    .addFields(
      {
        name: "Old Guild Name",
        value: `\`\`\`${oldGuild.name}\`\`\``,
        inline: false,
      },
      {
        name: "New Guild Name",
        value: `\`\`\`${newGuild.name}\`\`\``,
        inline: false,
      },
      {
        name: "Old Guild ID",
        value: `\`\`\`${oldGuild.id}\`\`\``,
        inline: false,
      },
      {
        name: "New Guild ID",
        value: `\`\`\`${newGuild.id}\`\`\``,
        inline: false,
      },
      {
        name: "Old Guild Owner",
        value: `\`\`\`${oldGuild.fetchOwner()}\`\`\``,
        inline: false,
      },
      {
        name: "New Guild Owner",
        value: `\`\`\`${newGuild.fetchOwner()}\`\`\``,
        inline: false,
      },
      {
        name: "Old Guild Region",
        value: `\`\`\`${oldGuild.preferredLocale}\`\`\``,
        inline: false,
      },
      {
        name: "New Guild Region",
        value: `\`\`\`${newGuild.preferredLocale}\`\`\``,
        inline: false,
      },
      {
        name: "Old Guild Verification Level",
        value: `\`\`\`${oldGuild.verificationLevel}\`\`\``,
        inline: false,
      },
      {
        name: "New Guild Verification Level",
        value: `\`\`\`${newGuild.verificationLevel}\`\`\``,
        inline: false,
      },
      {
        name: "Old Guild Explicit Content Filter",
        value: `\`\`\`${oldGuild.explicitContentFilter}\`\`\``,
        inline: false,
      },
      {
        name: "New Guild Explicit Content Filter",
        value: `\`\`\`${newGuild.explicitContentFilter}\`\`\``,
        inline: false,
      },
      {
        name: "Old Guild Default Message Notifications",
        value: `\`\`\`${oldGuild.defaultMessageNotifications}\`\`\``,
        inline: false,
      },
      {
        name: "New Guild Default Message Notifications",
        value: `\`\`\`${newGuild.defaultMessageNotifications}\`\`\``,
        inline: false,
      },
      {
        name: "Old Guild Description",
        value: `\`\`\`${oldGuild.description}\`\`\``,
        inline: false,
      },
      {
        name: "New Guild Description",
        value: `\`\`\`${newGuild.description}\`\`\``,
        inline: false,
      }
    )
    .setThumbnail(newGuild.iconURL() || "NULL")
    .setTimestamp();
  logHandler.info(
    `event | Pyreworks Discord has been updated. Logged to Central Archives.`
  );
  await sendLogMessage(newGuild.client, guildEmbed);
};
