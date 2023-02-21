import { MessageEmbed, StageInstance } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onStageInstanceCreate = async (
  stageInstance: StageInstance
): Promise<void> => {
  const stageInstanceEmbed = new MessageEmbed()
    .setColor(colors.success)
    .setTitle("Stage Instance Created")
    .setDescription(`A stage instance has been created.`)
    .addFields(
      {
        name: "Stage Instance Name",
        value: `\`\`\`${stageInstance.guildScheduledEvent?.name}\`\`\``,
      },
      { name: "Stage Instance ID", value: `\`\`\`${stageInstance.id}\`\`\`` },
      {
        name: "Stage Instance Topic",
        value: `\`\`\`${stageInstance.topic}\`\`\``,
      },
      {
        name: "Stage Instance Privacy Level",
        value: `\`\`\`${stageInstance.privacyLevel}\`\`\``,
      },
      {
        name: "Stage Instance Inviter ID",
        value: `\`\`\`${stageInstance.guildScheduledEvent?.createInviteURL()}\`\`\``,
      },
      {
        name: "Stage Instance Participant Count",
        value: `\`\`\`${stageInstance.guildScheduledEvent?.userCount}\`\`\``,
      },
      {
        name: "Stage Instance Discoverable Disabled",
        value: `\`\`\`${stageInstance.discoverableDisabled}\`\`\``,
      }
    )
    .setTimestamp();
  logHandler.info(
    `event | ${stageInstance.guildScheduledEvent?.name} stage instance has been created. Logged to Central Archives.`
  );
  await sendLogMessage(stageInstance.client, stageInstanceEmbed);
};
