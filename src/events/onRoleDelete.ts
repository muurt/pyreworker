/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "./sendLogMessage";
import { colors } from "../config/colors";

export const onRoleDelete = async (role: any): Promise<void> => {
  const roleEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Role Deleted")
    .setDescription(`A role has been deleted.`)
    .addField("Role Name", `| ${role.name}`, false)
    .addField("Role ID", `| ${role.id}`, false)
    .setTimestamp();
  logHandler.log("info", `${role.name} has been deleted. Role ID: ${role.id}`);
  await sendLogMessage(role.client, roleEmbed);
};
