/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { colors } from "../config/colors";
import { sendLogMessage } from "../utils/sendLogMessage";

export const onMemberRemove = async (member: any): Promise<void> => {
  if (member.user.bot) {
    return;
  }
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

  logHandler.info(
    `event | ${member.user.tag} has left the server. Logged to Central Archives.`
  );
  sendLogMessage(member.client, leaveEmbed);
};
