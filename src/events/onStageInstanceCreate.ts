/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onStageInstanceCreate = async (
  stageInstance: any
): Promise<void> => {
  const stageInstanceEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Stage Instance Created")
    .setDescription(`A stage instance has been created.`)
    .addField("Stage Instance Name", `\`\`\`${stageInstance.name}\`\`\``, false)
    .addField("Stage Instance ID", `\`\`\`${stageInstance.id}\`\`\``, false)
    .addField(
      "Stage Instance Topic",
      `\`\`\`${stageInstance.topic}\`\`\``,
      false
    )
    .addField(
      "Stage Instance Privacy Level",
      `\`\`\`${stageInstance.privacyLevel}\`\`\``,
      false
    )
    .addField(
      "Stage Instance Inviter ID",
      `\`\`\`${stageInstance.inviterID}\`\`\``,
      false
    )
    .addField(
      "Stage Instance Participant Count",
      `\`\`\`${stageInstance.participantCount}\`\`\``,
      false
    )
    .addField(
      "Stage Instance Speaker Count",
      `\`\`\`${stageInstance.speakerCount}\`\`\``,
      false
    )
    .addField(
      "Stage Instance Discoverable Disabled",
      `\`\`\`${stageInstance.discoverableDisabled}\`\`\``,
      false
    )
    .setTimestamp();
  logHandler.info(
    `event | ${stageInstance.name} stage instance has been created. Logged to Central Archives.`
  );
  await sendLogMessage(stageInstance.client, stageInstanceEmbed);
};
