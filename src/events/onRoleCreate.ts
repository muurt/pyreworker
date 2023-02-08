/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "./sendLogMessage";
import { colors } from "../config/colors";

export const onRoleCreate = async (role: any): Promise<void> => {
  const roleEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Role Created")
    .setDescription(`A role has been created.`)
    .addField("Role Name", `| ${role.name}`, false)
    .addField("Role ID", `| ${role.id}`, false)
    .addField("Role Color", `| ${role.color}`, false)
    .addField("Role Mentionable", `| ${role.mentionable}`, false)
    .addField("Role Permissions", `| ${role.permissions}`, false)
    .addField("Role Hoisted", `| ${role.hoist}`, false)
    .setTimestamp();
  logHandler.log("info", `${role.name} has been created. Role ID: ${role.id}`);
  await sendLogMessage(role.client, roleEmbed);
};
