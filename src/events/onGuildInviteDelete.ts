/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "./sendLogMessage";
import { colors } from "../config/colors";

export const onGuildInviteDelete = async (invite: any): Promise<void> => {
  logHandler.log("info", `An invite has been deleted: ${invite.url}`);
  const inviteEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Invite Deleted")
    .setDescription(`An invite has been deleted.`)
    .addField("Invite URL", `| ${invite.url}`, false)
    .addField("Invite Code", `| ${invite.code}`, false)
    .addField("Invite Channel", `| ${invite.channel}`, false)
    .addField("Invite Expires", `| ${invite.expiresAt}`, false)
    .addField("Invite Max Uses", `| ${invite.maxUses}`, false)
    .addField("Invite Uses", `| ${invite.uses}`, false)
    .setTimestamp();
  await sendLogMessage(invite.client, inviteEmbed);
};
