/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onGuildBanAdd = async (member: any): Promise<void> => {
  if (member.user.bot) {
    return;
  }
  const fetchBan = await member.guild.fetchAuditLogs({
    limit: 3,
    type: "MEMBER_BAN_ADD",
  });
  const banLog = fetchBan.entries.first();

  const { executor: banExecutor, target: banTarget } = banLog;
  const banEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Member Banned")
    .setDescription(`A member has been banned.`)
    .addField("User Tag", `\`\`\`${banTarget.tag}\`\`\``, false)
    .addField("User ID", `\`\`\`${banTarget.id}\`\`\``, false)
    .addField("User Created At", `\`\`\`${banTarget.createdAt}\`\`\``, false)
    .addField("Banned By", `\`\`\`${banExecutor.tag}\`\`\``, false)
    .setThumbnail(banExecutor.avatarURL())
    .setTimestamp();
  const parseErrorEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Audit Log Parse Error")
    .setDescription(`A member has either left the server or has been banned.`)
    .addField("User Tag", `\`\`\`${member.user.tag}\`\`\``, false)
    .setTimestamp();
  setTimeout(async () => {
    if (banLog) {
      if (banLog.createdAt > member.joinedAt) {
        if (banTarget.id === member.id) {
          logHandler.info(
            `event | ${banTarget.tag} has been banned by ${banExecutor.tag}. Logged to Central Archives.`
          );
          await sendLogMessage(member.client, banEmbed);
        } else {
          logHandler.error(
            `event | ${member.user.tag} has either left the server or has been banned. Audit Log Parse Unsuccessful. Logged to Central Archives.`
          );
          await sendLogMessage(member.client, parseErrorEmbed);
        }
      } else {
        return;
      }
    } else {
      return;
    }
  }, 1599); // arbitrary timeout value to wait for the auditlog to update in case discord is lagging.
};
