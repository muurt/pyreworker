/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { colors } from "../config/colors";
import { sendLogMessage } from "../utils/sendLogMessage";

export const onMemberRemove = async (member: any): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let kicked: boolean;
  if (member.user.bot) {
    return;
  }
  const fetchKick = await member.guild.fetchAuditLogs({
    limit: 1,
    type: "MEMBER_KICK",
  });
  const kickLog = fetchKick.entries.first();

  const { executor: kickExecutor, target: kickTarget } = kickLog;
  const leaveEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Member Left")
    .setDescription(`A member has left the server. (Not kicked)`)
    .addField("User Tag", `\`\`\`${member.user.tag}\`\`\``, false)
    .addField("User ID", `\`\`\`${member.user.id}\`\`\``, false)
    .addField("User Created At", `\`\`\`${member.user.createdAt}\`\`\``, false)
    .addField("User Joined At", `\`\`\`${member.joinedAt}\`\`\``, false)
    .setThumbnail(member.user.avatarURL())
    .setTimestamp();

  const kickEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Member Kicked")
    .setDescription(`A member has been kicked from the server.`)
    .addField("User Tag", `\`\`\`${kickTarget.tag}\`\`\``, false)
    .addField("User ID", `\`\`\`${kickTarget.id}\`\`\``, false)
    .addField("User Created At", `\`\`\`${kickTarget.createdAt}\`\`\``, false)
    .addField("Kicked By", `\`\`\`${kickExecutor.tag}\`\`\``, false)
    .setThumbnail(kickExecutor.avatarURL())
    .setTimestamp();

  const parseErrorEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Audit Log Parse Error")
    .setDescription(`A member has either left the server or has been kicked.`)
    .addField("User Tag", `\`\`\`${member.user.tag}\`\`\``, false)
    .setTimestamp();

  setTimeout(async () => {
    if (kickLog) {
      if (kickTarget.id === member.id) {
        if (kickLog.createdAt > member.joinedAt) {
          logHandler.info(
            `event | ${kickTarget.tag} has been kicked by ${kickExecutor.tag}. Logged to Central Archives.`
          );
          await sendLogMessage(member.client, kickEmbed);
          return (kicked = true);
        } else {
          logHandler.error(
            `event | ${member.user.tag} has either left the server or has been kicked. Audit Log Parse Unsuccessful. Logged to Central Archives.`
          );
          sendLogMessage(member.client, parseErrorEmbed);
          return (kicked = false);
        }
      } else {
        logHandler.info(
          `event | ${member.user.tag} has left the server. Logged to Central Archives.`
        );
        sendLogMessage(member.client, leaveEmbed);
        return (kicked = false);
      }
    }
  }, 1599); // arbitrary timeout value to wait for the auditlog to update in case discord is lagging.
};
