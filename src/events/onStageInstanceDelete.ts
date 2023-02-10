/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onStageInstanceDelete = async (stageEvent: any): Promise<void> => {
  const stageEventEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Stage Instance Deleted")
    .setDescription(`A stage instance has been deleted.`)
    .addField("Stage Event Name", `\`\`\`${stageEvent.name}\`\`\``, false)
    .addField("Stage Event ID", `\`\`\`${stageEvent.id}\`\`\``, false)
    .addField(
      "Stage Event Description",
      `\`\`\`${stageEvent.description}\`\`\``,
      false
    )
    .addField(
      "Stage Event Location",
      `\`\`\`${stageEvent.location}\`\`\``,
      false
    )
    .addField("Stage Event Host", `\`\`\`${stageEvent.host}\`\`\``, false)
    .addField("Stage Event Host ID", `\`\`\`${stageEvent.hostID}\`\`\``, false)
    .setThumbnail(stageEvent.hostAvatar)
    .setTimestamp();
  logHandler.info(
    `event | ${stageEvent.name} stage event has been deleted. Logged to Central Archives.`
  );
  await sendLogMessage(stageEvent.client, stageEventEmbed);
};
