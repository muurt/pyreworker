import { MessageEmbed, StageInstance } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onStageInstanceDelete = async (
  stageEvent: StageInstance
): Promise<void> => {
  const stageEventEmbed = new MessageEmbed()
    .setColor(colors.success)
    .setTitle("Stage Instance Deleted")
    .setDescription(`A stage instance has been deleted.`)
    .addFields(
      {
        name: "Stage Event Name",
        value: `\`\`\`${stageEvent.guildScheduledEvent?.name}\`\`\``,
      },
      { name: "Stage Event ID", value: `\`\`\`${stageEvent.id}\`\`\`` },
      {
        name: "Stage Event Description",
        value: `\`\`\`${stageEvent.guildScheduledEvent?.name}\`\`\``,
      },
      {
        name: "Stage Event Location",
        value: `\`\`\`${stageEvent.guildScheduledEvent?.entityMetadata.location}\`\`\``,
      },
      {
        name: "Stage Event Host",
        value: `\`\`\`${stageEvent.guildScheduledEvent?.creator}\`\`\``,
      },
      {
        name: "Stage Event Host ID",
        value: `\`\`\`${stageEvent.guildScheduledEvent?.creatorId}\`\`\``,
      }
    )
    .setThumbnail(
      stageEvent.guildScheduledEvent?.creator?.displayAvatarURL()
        ? stageEvent.guildScheduledEvent?.creator?.displayAvatarURL()
        : "NULL"
    )
    .setTimestamp();
  logHandler.info(
    `event | ${stageEvent.guildScheduledEvent?.name} stage event has been deleted. Logged to Central Archives.`
  );
  await sendLogMessage(stageEvent.client, stageEventEmbed);
};
