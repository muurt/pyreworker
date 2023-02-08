/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { colors } from "../config/colors";
import { sendLogMessage } from "./sendLogMessage";

export const onMemberRemove = async (member: any): Promise<void> => {
  const leaveEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Member Left")
    .setDescription(
      `A member has left the server. We hope to see you again soon!`
    )
    .addField("User Tag", `| ${member.user.tag}`, false)
    .addField("User ID", `| ${member.user.id}`, false)
    .addField("User Avatar", `| ${member.user.avatar}`, false)
    .addField("User Discriminator", `| ${member.user.discriminator}`, false)
    .addField("User Created At", `| ${member.user.createdAt}`, false)
    .addField("User Joined At", `| ${member.joinedAt}`, false)
    .addField(
      "User Roles",
      `| ${member.roles.cache.map((r: any) => r.name)}`,
      false
    )
    .setThumbnail(member.user.avatarURL())
    .setTimestamp();
  logHandler.log("info", `${member.user.tag} has left the server.`);
  await sendLogMessage(member.client, leaveEmbed);
};
