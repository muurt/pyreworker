/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "./sendLogMessage";
import { colors } from "../config/colors";

export const onGuildInviteCreate = async (invite: any): Promise<void> => {
  logHandler.log("info", `A new invite has been created: ${invite.url}`);
  const inviteEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Invite Created")
    .setDescription(`A new invite has been created.`)
    .addField("Invite URL", `| ${invite.url}`, false)
    .addField("Invite Code", `| ${invite.code}`, false)
    .addField("Invite Channel", `| ${invite.channel}`, false)
    .addField("Invite Expires", `| ${invite.expiresAt}`, false)
    .addField("Invite Max Uses", `| ${invite.maxUses}`, false)
    .addField("Invite Uses", `| ${invite.uses}`, false)
    .setTimestamp();
  await sendLogMessage(invite.client, inviteEmbed);
};
