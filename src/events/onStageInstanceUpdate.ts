import { MessageEmbed, StageInstance } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onStageInstanceUpdate = async (
  oldStageInstance: StageInstance | null,
  newStageInstance: StageInstance
): Promise<void> => {
  if (!oldStageInstance) {
    return;
  }
  const stageInstanceEmbed = new MessageEmbed()
    .setColor(colors.success)
    .setTitle("Stage Instance Updated")
    .setDescription("A stage instance has been updated.")
    .addFields(
      {
        name: "Old Stage Instance Name",
        value: `\`\`\`${oldStageInstance.guildScheduledEvent?.name}\`\`\``,
      },
      {
        name: "New Stage Instance Name",
        value: `\`\`\`${newStageInstance.guildScheduledEvent?.name}\`\`\``,
      },
      {
        name: "Stage Instance ID",
        value: `\`\`\`${oldStageInstance.id}\`\`\``,
      },
      {
        name: "Old Stage Instance Privacy Level",
        value: `\`\`\`${oldStageInstance.privacyLevel}\`\`\``,
      },
      {
        name: "New Stage Instance Privacy Level",
        value: `\`\`\`${newStageInstance.privacyLevel}\`\`\``,
      },
      {
        name: "Old Stage Instance Discoverable Disabled",
        value: `\`\`\`${oldStageInstance.discoverableDisabled}\`\`\``,
      },
      {
        name: "New Stage Instance Discoverable Disabled",
        value: `\`\`\`${newStageInstance.discoverableDisabled}\`\`\``,
      },
      {
        name: "Old Stage Instance Topic",
        value: `\`\`\`${oldStageInstance.topic}\`\`\``,
      },
      {
        name: "New Stage Instance Topic",
        value: `\`\`\`${newStageInstance.topic}\`\`\``,
      }
    )
    .setTimestamp();
  logHandler.info(
    `event | ${oldStageInstance.guildScheduledEvent?.name} stage instance has been updated. Logged to Central Archives.`
  );
  await sendLogMessage(oldStageInstance.client, stageInstanceEmbed);
};
