/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onMemberUpdate = async (
  oldMember: any,
  newMember: any
): Promise<void> => {
  const updateEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Member Updated")
    .setDescription(`A member has updated their profile.`)
    .addField("Old Username", `\`\`\`${oldMember.user.tag}\`\`\``, false)
    .addField("New Username", `\`\`\`${newMember.user.tag}\`\`\``, false)
    .addField(
      "Old Nickname",
      `\`\`\`${oldMember.nickname || "None"}\`\`\``,
      false
    )
    .addField(
      "New Nickname",
      `\`\`\`${newMember.nickname || "None"}\`\`\``,
      false
    )
    .addField("User ID", `\`\`\`${oldMember.id}\`\`\``, false)
    .addField(
      "User Created At",
      `\`\`\`${oldMember.user.createdAt}\`\`\``,
      false
    )
    .addField("User Joined At", `\`\`\`${oldMember.joinedAt}\`\`\``, false)
    .addField(
      "User Roles",
      `\`\`\`${oldMember.roles.cache.map((r: any) => r.name).join("\n")}\`\`\``,
      false
    )
    .setThumbnail(newMember.user.avatarURL())
    .setTimestamp();
  logHandler.info(
    `event | ${newMember.user.tag}'s profile was updated. Logged to Central Archives.`
  );
  await sendLogMessage(newMember.client, updateEmbed);
};
