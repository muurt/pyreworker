/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onGuildKickAdd = async (member: any): Promise<void> => {
  if (member.user.bot) {
    return;
  }
  const fetchKick = await member.guild.fetchAuditLogs({
    limit: 1,
    type: "MEMBER_KICK",
  });
  const kickLog = fetchKick.entries.first();
  const { executor: kickExecutor, target: kickTarget } = kickLog;
  const kickEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Member Kicked")
    .setDescription(`A member has been kicked from the server.`)
    .addField("User Tag", `\`\`\`${kickTarget.user.tag}\`\`\``, false)
    .addField("User ID", `\`\`\`${kickTarget.user.id}\`\`\``, false)
    .addField(
      "User Created At",
      `\`\`\`${kickTarget.user.createdAt}\`\`\``,
      false
    )
    .addField("Kicked By", `\`\`\`${kickExecutor.tag}\`\`\``, false)
    .setThumbnail(kickExecutor.avatarURL())
    .setTimestamp();
  if (kickLog) {
    if (kickTarget.id === member.id) {
      logHandler.info(
        `event | ${kickTarget.user.tag} has been kicked by ${kickExecutor.tag}. Logged to Central Archives.`
      );
      await sendLogMessage(member.client, kickEmbed);
    }
  }
};
