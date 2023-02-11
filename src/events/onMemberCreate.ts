/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onMemberCreate = async (member: any): Promise<void> => {
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
    .setColor(colors.orange)
    .setTitle("Member Joined")
    .setDescription(`A member has joined the server.`)
    .addField("User Tag", `\`\`\`${member.user.tag}\`\`\``, false)
    .addField("User ID", `\`\`\`${member.user.id}\`\`\``, false)
    .addField("Account Created", `\`\`\`${member.user.createdAt}\`\`\``, false)
    .addField("Joined Server", `\`\`\`${member.joinedAt}\`\`\``, false)
    .addField("Member Count", `\`\`\`${member.guild.memberCount}\`\`\``, false)
    .addField(
      "Roles",
      `\`\`\`${member.roles.cache
        .map((r: { toString: () => any }) => r.toString())
        .join("\n")}\`\`\``,
      false
    )
    .setThumbnail(member.user.displayAvatarURL())
    .setTimestamp();
  logHandler.info(
    `event | ${member.user.tag} has joined the server. Automatically granted the Community role.`
  );
  await sendLogMessage(member.client, joinEmbed);
};
