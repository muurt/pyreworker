import { Invite, MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onGuildInviteCreate = async (invite: Invite): Promise<void> => {
  logHandler.info(
    `event | A new invite has been created: ${invite.url}. Logged to Central Archives.`
  );
  const inviteEmbed = new MessageEmbed()
    .setColor(colors.success)
    .setTitle("Invite Created")
    .setDescription(`A new invite has been created.`)
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
