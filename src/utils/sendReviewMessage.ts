import { Client, MessageEmbed } from "discord.js";

export const sendReviewMessage = async (
  client: Client,
  message: MessageEmbed
): Promise<void> => {
  const channel = await client.channels.fetch(
    process.env.reviewChannelId as string
  );
  if (!channel || channel.type !== "GUILD_TEXT") {
    return;
  }
  await channel.send({ embeds: [message] });
  const star = await channel.messages.fetch({ limit: 1 });
  await star.first()?.react("⭐");
};
// i'll combine all the functions similar to this soon.
