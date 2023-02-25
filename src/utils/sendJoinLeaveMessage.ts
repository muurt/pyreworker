import { Client, MessageEmbed } from "discord.js";

export const sendJoinLeaveMessage = async (
  client: Client,
  message: MessageEmbed
): Promise<void> => {
  const channel = await client.channels.fetch(
    process.env.joinLeaveChannelId as string
  );
  if (!channel || channel.type !== "GUILD_TEXT") {
    return;
  }
  await channel.send({ embeds: [message] });
};
// idk this is for functional consistency.
