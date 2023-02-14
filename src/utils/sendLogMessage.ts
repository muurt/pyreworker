import { Client, MessageEmbed } from "discord.js";

export const sendLogMessage = async (
  client: Client,
  message: MessageEmbed
): Promise<void> => {
  const channel = await client.channels.fetch(
    process.env.logChannelId as string
  );
  if (!channel || channel.type !== "GUILD_TEXT") {
    return;
  }
  await channel.send({ embeds: [message] });
};
