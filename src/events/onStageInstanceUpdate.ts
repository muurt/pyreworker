/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onStageInstanceUpdate = async (
  oldStageInstance: any,
  newStageInstance: any
): Promise<void> => {
  const stageInstanceEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Stage Instance Updated")
    .setDescription("A stage instance has been updated.")
    .addField(
      "Old Stage Instance Name",
      `\`\`\`${oldStageInstance.name}\`\`\``,
      false
    )
    .addField(
      "New Stage Instance Name",
      `\`\`\`${newStageInstance.name}\`\`\``,
      false
    )
    .addField("Stage Instance ID", `\`\`\`${oldStageInstance.id}\`\`\``, false)
    .addField(
      "Old Stage Instance Privacy Level",
      `\`\`\`${oldStageInstance.privacyLevel}\`\`\``,
      false
    )
    .addField(
      "New Stage Instance Privacy Level",
      `\`\`\`${newStageInstance.privacyLevel}\`\`\``,
      false
    )
    .addField(
      "Old Stage Instance Discoverable Disabled",
      `\`\`\`${oldStageInstance.discoverableDisabled}\`\`\``,
      false
    )
    .addField(
      "New Stage Instance Discoverable Disabled",
      `\`\`\`${newStageInstance.discoverableDisabled}\`\`\``,
      false
    )
    .addField(
      "Old Stage Instance Topic",
      `\`\`\`${oldStageInstance.topic}\`\`\``,
      false
    )
    .addField(
      "New Stage Instance Topic",
      `\`\`\`${newStageInstance.topic}\`\`\``,
      false
    )
    .setTimestamp();
  logHandler.info(
    `event | ${oldStageInstance.name} stage instance has been updated. Logged to Central Archives.`
  );
  await sendLogMessage(oldStageInstance.client, stageInstanceEmbed);
};
