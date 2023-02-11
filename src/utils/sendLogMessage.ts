/* eslint-disable @typescript-eslint/no-explicit-any */
export const sendLogMessage = async (
  client: any,
  message: any
): Promise<void> => {
  const channel = await client.channels.fetch(
    process.env.logChannelId as string
  );
  await channel.send({ embeds: [message] });
};
