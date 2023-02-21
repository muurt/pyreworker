import { GuildBan, MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onGuildBanAdd = async (ban: GuildBan): Promise<void> => {
  if (ban.user.bot) {
    return;
  }
  const fetchBan = await ban.guild.fetchAuditLogs({
    limit: 3,
    type: "MEMBER_BAN_ADD",
  });
  const banLog = fetchBan.entries.first();
  if (!banLog) {
    return;
  }
  const { executor: banExecutor, target: banTarget } = banLog;
  const banEmbed = new MessageEmbed()
    .setColor(colors.success)
    .setTitle("Member Banned")
    .setDescription(`A member has been banned.`)
    .addFields([
      {
        name: "User Tag",
        value: `\`\`\`${banTarget?.tag}\`\`\``,
        inline: false,
      },
      { name: "User ID", value: `\`\`\`${banTarget?.id}\`\`\``, inline: false },
      {
        name: "User Created At",
        value: `\`\`\`${banTarget?.createdAt}\`\`\``,
        inline: false,
      },
      {
        name: "Banned By",
        value: `\`\`\`${banExecutor?.tag}\`\`\``,
        inline: false,
      },
    ])
    .setThumbnail(banExecutor?.displayAvatarURL() || "NULL")
    .setTimestamp();
  const parseErrorEmbed = new MessageEmbed()
    .setColor(colors.success)
    .setTitle("Audit Log Parse Error")
    .setDescription(`A member has either left the server or has been banned.`)
    .addFields({
      name: "User Tag",
      value: `\`\`\`${ban.user.tag}\`\`\``,
      inline: false,
    })
    .setTimestamp();
  setTimeout(async () => {
    if (banLog && banExecutor && ban.guild.joinedAt && banTarget) {
      if (banLog.createdAt > ban.guild.joinedAt) {
        if (banTarget.id === ban.user.id) {
          logHandler.info(
            `event | ${banTarget.tag} has been banned by ${banExecutor.tag}. Logged to Central Archives.`
          );
          await sendLogMessage(ban.client, banEmbed);
        } else {
          logHandler.error(
            `event | ${ban.user.tag} has either left the server or has been banned. Audit Log Parse Unsuccessful. Logged to Central Archives.`
          );
          await sendLogMessage(ban.client, parseErrorEmbed);
        }
      } else {
        return;
      }
    } else {
      return;
    }
  }, 1599); // arbitrary timeout value to wait for the auditlog to update in case discord is lagging.
};
