import { Invite, MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onGuildInviteDelete = async (invite: Invite): Promise<void> => {
  logHandler.info(
    `event | An invite has been deleted: ${invite.url}. Logged to Central Archives.`
  );
  const inviteEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Invite Deleted")
    .setDescription(`An invite has been deleted.`)
    .addFields(
      { name: "Invite URL", value: `\`\`\`${invite.url}\`\`\``, inline: false },
      {
        name: "Invite Code",
        value: `\`\`\`${invite.code}\`\`\``,
        inline: false,
      },
      {
        name: "Invite Channel",
        value: `\`\`\`${invite.channel}\`\`\``,
        inline: false,
      },
      {
        name: "Invite Expires",
        value: `\`\`\`${invite.expiresAt}\`\`\``,
        inline: false,
      },
      {
        name: "Invite Max Uses",
        value: `\`\`\`${invite.maxUses}\`\`\``,
        inline: false,
      },
      {
        name: "Invite Uses",
        value: `\`\`\`${invite.uses}\`\`\``,
        inline: false,
      }
    )
    .setTimestamp();
  await sendLogMessage(invite.client, inviteEmbed);
};
