import { GuildBan, MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onGuildBanRemove = async (ban: GuildBan): Promise<void> => {
  const fetchUnban = await ban.guild.fetchAuditLogs({
    limit: 1,
    type: "MEMBER_BAN_REMOVE",
  });

  const unbanLog = fetchUnban.entries.first();
  if (!unbanLog) {
    return;
  }
  const { executor: unbanExecutor, target: unbanTarget } = unbanLog;

  const unbanEmbed = new MessageEmbed()
    .setColor(colors.success)
    .setTitle("Member Unbanned")
    .setDescription(`A member has been unbanned.`)
    .addFields(
      {
        name: "User Tag",
        value: `\`\`\`${unbanTarget?.tag}\`\`\``,
        inline: false,
      },
      {
        name: "User ID",
        value: `\`\`\`${unbanTarget?.id}\`\`\``,
        inline: false,
      },
      {
        name: "User Discriminator",
        value: `\`\`\`${unbanTarget?.discriminator}\`\`\``,
        inline: false,
      },
      {
        name: "User Created At",
        value: `\`\`\`${unbanTarget?.createdAt}\`\`\``,
        inline: false,
      },
      {
        name: "Unbanned By",
        value: `\`\`\`${unbanExecutor?.tag}\`\`\``,
        inline: false,
      }
    )
    .setThumbnail(unbanExecutor?.displayAvatarURL() || "NULL")
    .setTimestamp();
  logHandler.info(
    `event | ${unbanTarget?.tag} has been unbanned by ${unbanExecutor?.tag}. Logged to Central Archives.`
  );
  await sendLogMessage(ban.client, unbanEmbed);
};
// sam was here :)
