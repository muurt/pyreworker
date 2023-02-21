import { Collection, MessageEmbed, Snowflake, ThreadMember } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";

export const onThreadMembersUpdate = async (
  oldMembers: Collection<Snowflake, ThreadMember>,
  newMembers: Collection<Snowflake, ThreadMember>
): Promise<void> => {
  const firstMem = oldMembers.first();
  if (!firstMem) {
    return;
  }
  const threadEmbed = new MessageEmbed()
    .setColor(colors.success)
    .setTitle("Thread Members Updated")
    .setDescription(`A thread's members have been updated.`)
    .addFields(
      {
        name: "Thread Name",
        value: `\`\`\`${firstMem.thread.name}\`\`\``,
      },
      { name: "Old Members", value: `\`\`\`${oldMembers}\`\`\`` },
      { name: "New Members", value: `\`\`\`${newMembers}\`\`\`` }
    )
    .setTimestamp();
  logHandler.info(
    `event | ${firstMem.thread.name}'s thread members have been updated. Logged to Central Archives.`
  );
  await sendLogMessage(firstMem.client, threadEmbed);
};
