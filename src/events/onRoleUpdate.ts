/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "./sendLogMessage";
import { colors } from "../config/colors";

export const onRoleUpdate = async (
  oldRole: any,
  newRole: any
): Promise<void> => {
  const roleEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Role Updated")
    .setDescription(`A role has been updated.`)
    .addField("Old Role Name", `| ${oldRole.name}`, false)
    .addField("New Role Name", `| ${newRole.name}`, false)
    .addField("Old Role ID", `| ${oldRole.id}`, false)
    .addField("New Role ID", `| ${newRole.id}`, false)
    .addField("Old Role Color", `| ${oldRole.hexColor}`, false)
    .addField("New Role Color", `| ${newRole.hexColor}`, false)
    .addField("Old Role Mentionable", `| ${oldRole.mentionable}`, false)
    .addField("New Role Mentionable", `| ${newRole.mentionable}`, false)
    .addField("Old Role Permissions", `| ${oldRole.permissions}`, false)
    .addField("New Role Permissions", `| ${newRole.permissions}`, false)
    .addField("Old Role Hoisted", `| ${oldRole.hoist}`, false)
    .addField("New Role Hoisted", `| ${newRole.hoist}`, false)
    .setTimestamp();
  logHandler.log(
    "info",
    `${newRole.name} has been updated. Role ID: ${newRole.id}`
  );
  await sendLogMessage(newRole.client, roleEmbed);
};
