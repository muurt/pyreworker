/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onGuildBanRemove = async (member: any): Promise<void> => {
  const fetchUnban = await member.guild.fetchAuditLogs({
    limit: 1,
    type: "MEMBER_BAN_REMOVE",
  });

  const unbanLog = fetchUnban.entries.first();
  const { executor: unbanExecutor, target: unbanTarget } = unbanLog;

  const unbanEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Member Unbanned")
    .setDescription(`A member has been unbanned.`)
    .addField("User Tag", `\`\`\`${unbanTarget.tag}\`\`\``, false)
    .addField("User ID", `\`\`\`${unbanTarget.id}\`\`\``, false)
    .addField(
      "User Discriminator",
      `\`\`\`${unbanTarget.discriminator}\`\`\``,
      false
    )
    .addField("User Created At", `\`\`\`${unbanTarget.createdAt}\`\`\``, false)
    .setThumbnail(unbanExecutor.avatarURL())
    .setTimestamp();

  unbanEmbed.addField("Unbanned By", `\`\`\`${unbanExecutor.tag}\`\`\``, false);
  logHandler.info(
    `event | ${unbanTarget.tag} has been unbanned by ${unbanExecutor.tag}. Logged to Central Archives.`
  );
  await sendLogMessage(member.client, unbanEmbed);
};
// sam was here :)
