import { GuildMember, MessageEmbed, PartialGuildMember } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { colors } from "../config/colors";
import { sendLogMessage } from "../utils/sendLogMessage";
import { sendJoinLeaveMessage } from "../utils/sendJoinLeaveMessage";

export const onMemberRemove = async (
  member: GuildMember | PartialGuildMember
): Promise<void> => {
  if (member.user.bot) {
    return;
  }
  const fetchBan = await member.guild.fetchAuditLogs({
    limit: 1,
    type: "MEMBER_BAN_ADD",
  });
  const banLog = fetchBan.entries.first();
  const fetchKick = await member.guild.fetchAuditLogs({
    limit: 1,
    type: "MEMBER_KICK",
  });
  const kickLog = fetchKick.entries.first();
  const kickExecutor = kickLog?.executor;
  const kickTarget = kickLog?.target;

  const leaveEmbed = new MessageEmbed()
    .setColor(colors.success)
    .setTitle("Member Left")
    .setDescription(`A member has left the server. (Not kicked)`)
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
        name: "User Created At",
        value: `\`\`\`${member.user.createdAt}\`\`\``,
        inline: false,
      },
      {
        name: "User Joined At",
        value: `\`\`\`${member.joinedAt}\`\`\``,
        inline: false,
      }
    )
    .setThumbnail(member.user.displayAvatarURL())
    .setTimestamp();

  const kickEmbed = new MessageEmbed()
    .setColor(colors.success)
    .setTitle("Member Kicked")
    .setDescription(`A member has been kicked from the server.`)
    .addFields(
      {
        name: "User Tag",
        value: `\`\`\`${kickTarget?.tag}\`\`\``,
        inline: false,
      },
      {
        name: "User ID",
        value: `\`\`\`${kickTarget?.id}\`\`\``,
        inline: false,
      },
      {
        name: "User Created At",
        value: `\`\`\`${kickTarget?.createdAt}\`\`\``,
        inline: false,
      },
      {
        name: "Kicked By",
        value: `\`\`\`${kickExecutor?.tag}\`\`\``,
        inline: false,
      }
    )
    .setThumbnail(kickExecutor ? kickExecutor.displayAvatarURL() : "NULL")
    .setTimestamp();

  setTimeout(async () => {
    if (!kickLog === undefined && kickLog) {
      if (kickTarget?.id === member.id && member.joinedAt) {
        if (kickLog.createdAt > member.joinedAt) {
          logHandler.info(
            `event | ${kickTarget.tag} has been kicked by ${kickExecutor?.tag}. Logged to Central Archives.`
          );
          await sendLogMessage(member.client, kickEmbed);
          return;
        } else if (banLog) {
          return;
        } else {
          logHandler.info(
            `event | ${member.user.tag} has left the server. Logged to Central Archives.`
          );
          sendLogMessage(member.client, leaveEmbed);
          return;
        }
      }
    }
  }, 1599); // arbitrary timeout value to wait for the auditlog to update in case discord is lagging.
};

export const onMemberLeave = async (
  member: GuildMember | PartialGuildMember
): Promise<void> => {
  if (member.user.bot) {
    return;
  }
  const publicLeaveEmbed = new MessageEmbed()
    .setColor(colors.success)
    .setTitle(`Member left.`)
    .setDescription(`${member.user} may have left or been moderated.`)
    .addField("Member Count", `\`\`\`${member.guild.memberCount}\`\`\``, false)
    .setThumbnail(member.user.displayAvatarURL())
    .setTimestamp()
    .setFooter(`© Pyreworks`, member.client.user?.displayAvatarURL());

  await sendJoinLeaveMessage(member.client, publicLeaveEmbed);
};
// second function to handle the join/leave log message. tried making it work inside the other function above but it didn't work.
