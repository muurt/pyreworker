import {
  GuildMember,
  MessageEmbed,
  PartialGuildMember,
  Role,
} from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onMemberUpdate = async (
  oldMember: GuildMember | PartialGuildMember,
  newMember: GuildMember
): Promise<void> => {
  const updateEmbed = new MessageEmbed()
    .setColor(colors.success)
    .setTitle("Member Updated")
    .setDescription(`A member has updated their profile.`)
    .addFields(
      {
        name: "Old Username",
        value: `\`\`\`${oldMember.user.tag}\`\`\``,
        inline: false,
      },
      {
        name: "New Username",
        value: `\`\`\`${newMember.user.tag}\`\`\``,
        inline: false,
      },
      {
        name: "Old Nickname",
        value: `\`\`\`${oldMember.nickname || "None"}\`\`\``,
        inline: false,
      },
      {
        name: "New Nickname",
        value: `\`\`\`${newMember.nickname || "None"}\`\`\``,
        inline: false,
      },
      { name: "User ID", value: `\`\`\`${oldMember.id}\`\`\``, inline: false },
      {
        name: "User Created At",
        value: `\`\`\`${oldMember.user.createdAt}\`\`\``,
        inline: false,
      },
      {
        name: "User Joined At",
        value: `\`\`\`${oldMember.joinedAt}\`\`\``,
        inline: false,
      },
      {
        name: "User Roles",
        value: `\`\`\`${oldMember.roles.cache
          .map((r: Role) => r.name)
          .join("\n")}\`\`\``,
        inline: false,
      }
    )
    .setThumbnail(newMember.user.displayAvatarURL())
    .setTimestamp();
  logHandler.info(
    `event | ${newMember.user.tag}'s profile was updated. Logged to Central Archives.`
  );
  await sendLogMessage(newMember.client, updateEmbed);
};
