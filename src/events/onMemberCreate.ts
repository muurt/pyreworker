import { GuildMember, MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onMemberCreate = async (member: GuildMember): Promise<void> => {
  const roles: string[] = [
    "885761807078268948",
    "847060751595601970",
    "841329548477595659", // community role
    "1032913604187525150",
    "841329483402838057",
    "840980277605433354",
    "841331860293550120",
  ];
  await member.roles.add(roles);

  const joinEmbed = new MessageEmbed()
    .setColor(colors.success)
    .setTitle("Member Joined")
    .setDescription(`A member has joined the server.`)
    .addFields(
      {
        name: "User Tag",
        value: `\`\`\`${member.user.tag}\`\`\``,
        inline: false,
      },
      {
        name: "User ID",
        value: `\`\`\`${member.user.id}\`\`\``,
        inline: false,
      },
      {
        name: "Account Created",
        value: `\`\`\`${member.user.createdAt}\`\`\``,
        inline: false,
      },
      {
        name: "Joined Server",
        value: `\`\`\`${member.joinedAt}\`\`\``,
        inline: false,
      },
      {
        name: "Member Count",
        value: `\`\`\`${member.guild.memberCount}\`\`\``,
        inline: false,
      },
      {
        name: "Roles",
        value: `\`\`\`${member.roles.cache
          .map((r: { toString: () => string }) => r.toString())
          .join("\n")}\`\`\``,
        inline: false,
      }
    )
    .setThumbnail(member.user.displayAvatarURL())
    .setTimestamp();
  logHandler.info(
    `event | ${member.user.tag} has joined the server. Automatically granted the Community role.`
  );
  await sendLogMessage(member.client, joinEmbed);
};
