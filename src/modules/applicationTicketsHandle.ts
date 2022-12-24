/* eslint-disable prettier/prettier */
import {
  ButtonInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Message,
  MessageSelectMenu,
  Permissions,
  SelectMenuInteraction,
} from "discord.js";
import { confirm, delay } from "../events/onInteraction";
import { errorHandler } from "../utils/errorHandler";
import { colors } from "../config/colors";

export const applicationTicketsNotify = async (
  interaction: ButtonInteraction
): Promise<void> => {
  const { user } = interaction;
  await interaction.deferReply({ 
    ephemeral: true 
  });

  const ticketID = interaction.message.embeds[0].footer?.text
    .toString()
    .replace("© Pyreworks | ", "");
  const managementChannel =
    interaction.client.channels.cache.get("840145878610083881");
  const notifiedEmbed = new MessageEmbed()
    .setTitle("SUCCESS!")
    .setAuthor({
      name: `${user.username}#${user.discriminator}`,
      iconURL: user.displayAvatarURL(),
    })
    .setColor(colors.orange)
    .setDescription("You've successfully notified management!")
    .setFooter({
      text: "© Pyreworks",
      iconURL: interaction.client.user?.displayAvatarURL(),
    });
  const notificationEmbed = new MessageEmbed()
    .setTitle("INFO!")
    .setAuthor({
      name: `${user.username}#${user.discriminator}`,
      iconURL: user.displayAvatarURL(),
    })
    .setColor(colors.white)
    .setDescription("Ticket needs escalation.")
    .addFields(
      { name: "Ticket Channel", value: `<#${ticketID}>` },
      { name: "Escalator", value: `<@${interaction.user.id}>` }
    )
    .setFooter({
      text: "© Pyreworks",
      iconURL: interaction.client.user?.displayAvatarURL(),
    });

  if (
    !ticketID ||
    !managementChannel ||
    managementChannel.type !== "GUILD_TEXT"
  ) {
    return;
  }

  const ticketChannel = interaction.client.channels.cache.get(ticketID);

  if (!ticketChannel || ticketChannel.type !== "GUILD_TEXT") {
    return;
  }

  await interaction.editReply({
    embeds: [notifiedEmbed],
  });
  await managementChannel
    .send({
      embeds: [notificationEmbed],
    })
    .then(() =>
      managementChannel
        .send({ content: "<@&840977614806319135>" })
        .then((m) => m.delete())
    );
};

export const applicationTicketsClaim = async (
  interaction: ButtonInteraction
): Promise<void> => {
  const { user } = interaction;
  await interaction.deferReply({
    ephemeral: true,
  });
  const ticketID = interaction.message.embeds[0].footer?.text
    .toString()
    .replace("© Pyreworks | ", "");
  const claimedEmbed = new MessageEmbed()
    .setTitle("SUCCESS!")
    .setAuthor({
      name: `${user.username}#${user.discriminator}`,
      iconURL: user.displayAvatarURL(),
    })
    .setColor(colors.orange)
    .setDescription("You've successfully claimed the application!")
    .setFooter({
      text: "© Pyreworks",
      iconURL: interaction.client.user?.displayAvatarURL(),
    });
  const notificationEmbed = new MessageEmbed()
    .setTitle("INFO!")
    .setAuthor({
      name: `${user.username}#${user.discriminator}`,
      iconURL: user.displayAvatarURL(),
    })
    .setDescription(
      `A management staff has claimed your application!`
    )
    .setColor(colors.white)
    .addFields({ name: "Management Staff", value: `<@${interaction.user.id}>` })
    .setFooter({
      text: "© Pyreworks",
      iconURL: interaction.client.user?.displayAvatarURL(),
    });
  if (!ticketID) {
    console.log("error 1");
    return;
  }
  console.log("no error mate");

  const ticketChannel = interaction.client.channels.cache.get(ticketID);
  const ticketsChannel =
    interaction.client.channels.cache.get("967773917685104741");
  if (
    !ticketChannel ||
    ticketChannel.type !== "GUILD_TEXT" ||
    !ticketsChannel ||
    ticketsChannel.type !== "GUILD_TEXT"
  ) {
    return;
  }

  const ticketUser = ticketChannel.topic;

  await ticketChannel.permissionOverwrites.create(user.id, {
    VIEW_CHANNEL: true,
  });

  await ticketsChannel.messages
    .fetch(interaction.message.id)
    .then(async (msg) => msg.delete())
    .catch((err) => errorHandler(err, "deleting a message"));

  await interaction
    .editReply({
      embeds: [
        claimedEmbed.addFields({ name: "Ticket channel", value: `<#${ticketChannel.id}>` }),
      ],
    })
    .then(() => {
      ticketChannel
        .send({ content: `<@${ticketUser}>` })
        .then((msg) => msg.delete());
      ticketChannel.send({
        embeds: [notificationEmbed],
      });
    });
};

export const applicationTicketsHandle = async (
  interaction: ButtonInteraction
  ): Promise<void> => {
    // sam was here :)
    const buttonReply = new MessageEmbed()
    .setTitle("Info")
    .setColor(colors.white)
    .setDescription("Please confirm in your DM's to create your ticket. \nIf you did not receive a DM, please check your privacy settings and enable DM's from server members and try again.")
    .setFooter({
      text: "© Pyreworks",
      iconURL: interaction.client.user?.displayAvatarURL(),
    });
    await interaction.deferReply({
      ephemeral: true,
    });
    interaction.followUp({ 
      embeds: [buttonReply], 
      ephemeral: true 
    });
  try {
    const { user } = interaction;
    const ticketsCategory = "966925310337642496";
    const confirmation = await confirm(interaction, user);
    const typeEmbed = new MessageEmbed()
      .setTitle("QUESTION!")
      .setAuthor({
        name: `${user.username}#${user.discriminator}`,
        iconURL: user.displayAvatarURL(),
      })
      .setColor(colors.white)
      .setDescription("What are you applying for?")
      .setFooter({
        text: "© Pyreworks",
        iconURL: interaction.client.user?.displayAvatarURL(),
      });
    const typeSelectMenu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("application-type")
        .setPlaceholder("Select category of the application.")
        .addOptions([
          {
            label: "Moderation Staff",
            description: "Get interviewed for any open moderation staff position.",
            value: "mod-staff-application",
          },
          {
            label: "Management Staff",
            description: "Get interviewed for any open management staff position.",
            value: "mgmt-staff-application",
          },
          {
            label: "Freelancer",
            description: "Apply for the freelancer role to take up commissions.",
            value: "freelancer-application",
          },
          {
            label: "Developer",
            description: "Get interviewed for any open developer position.",
            value: "developer-application",
          },
        ])
    );

    if (!confirmation) {
      return;
    }

    await interaction.guild?.channels
      .create(
        `app-${interaction.user.username.substring(0, 3)}${Math.floor(
          Math.random() * 10000
        )
          .toString()
          .substring(0, 3)}`,
        {
          type: "GUILD_TEXT",
          topic: `${user.id.toString()}`,
          parent: ticketsCategory,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [Permissions.FLAGS.VIEW_CHANNEL],
            },
            {
              id: interaction.user.id,
              allow: [Permissions.FLAGS.VIEW_CHANNEL],
            },
          ],
        }
      )
      .then(async (ticketChannel) => {
        await ticketChannel
          .send({
            content: `<@${user.id}>`,
          })
          .then((m) => m.delete())
          .catch((err) => errorHandler(err, "deleting a message"));
        await ticketChannel
          .send({
            embeds: [typeEmbed],
            components: [typeSelectMenu],
          })
          .then((m) => {
            const ticketMessage = m;
            let ticketCategory: string;
            let ticketDescription: Message<boolean> | undefined;
            const applicationChannel =
              interaction.client.channels.cache.get("840145878610083881");
            if (!applicationChannel || applicationChannel.type !== "GUILD_TEXT") {
              return;
            }
            const noSelectEmbed = new MessageEmbed()
              .setTitle("WARN!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(colors.gray)
              .setDescription(
                "You didn't select anything.\nTicket creation was canceled and this channel will be deleted in 1 min."
              )
              .setFooter({
                text: "© Pyreworks",
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const descriptionEmbed = new MessageEmbed()
              .setTitle("QUESTION!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(colors.white)
              .setDescription(
                "Please write a brief description about yourself."
              )
              .setFooter({
                text: "© Pyreworks",
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const finishedEmbed = new MessageEmbed()
              .setTitle("SUCCESS!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(colors.orange)
              .setDescription(
                "You've successfully finished setting up your Application.\nYour ticket has been sent to our staff and will look into it as soon as possible."
              )
              .setFooter({
                text: "© Pyreworks",
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const supportEmbed = new MessageEmbed()
              .setTitle("NEW TICKET!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(colors.white)
              .setDescription(`<@${user.id}> created an application.`)
              .setFooter({
                text: `© Pyreworks | ${ticketChannel.id}`,
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const claimButtons = new MessageActionRow().addComponents(
              new MessageButton()
                .setCustomId("application-ticket-claim")
                .setLabel("Claim")
                .setStyle("SUCCESS")
                .setEmoji("967707003705237524"),
              new MessageButton()
                .setCustomId("application-ticket-notifym")
                .setLabel("Notify Management")
                .setStyle("DANGER")
                .setEmoji("968144163986104341")
            );

            const collectorFilter = (i: SelectMenuInteraction) => {
              i.deferUpdate();
              return i.user.id === user.id && i.customId === "application-type";
            };

            m.channel
              .awaitMessageComponent({
                componentType: "SELECT_MENU",
                filter: collectorFilter,
                time: 30000,
              })
              .then(async (i) => {
                ticketCategory = i.values[0];
                ticketMessage
                  .edit({
                    embeds: [descriptionEmbed],
                    components: [],
                  })
                  .then(() => {
                    const descriptionFilter = (message: Message) => {
                      return message.author.id === user.id;
                    };
                    ticketMessage.channel
                      .awaitMessages({
                        filter: descriptionFilter,
                        max: 1,
                        time: 600000,
                        errors: ["time"],
                      })
                      .then(async (des) => {
                        ticketDescription = des.first();
                        await des.first()?.delete();
                        await ticketMessage
                          .edit({
                            embeds: [
                              finishedEmbed
                                .addFields({ name: "Category", value: ticketCategory },
                                {
                                  name: "Description",
                                  value: ticketDescription
                                    ? ticketDescription.toString()
                                    : "No description provided." } // won't reach
                                ),
                            ],
                          })
                          .then(
                            async () =>
                              await applicationChannel.send({
                                embeds: [
                                  supportEmbed
                                  .addFields({ name: "Category", value: ticketCategory },
                                  {
                                    name: "Description",
                                    value: ticketDescription
                                      ? ticketDescription.toString()
                                      : "No description provided" } // won't reach
                                    ),
                                ],
                                components: [claimButtons],
                              })
                          );
                      })
                      .catch(async () => {
                        await ticketMessage.edit({
                          embeds: [
                            noSelectEmbed.setDescription(
                              "You didn't write anything.\nTicket creation has been canceled and this channel will be deleted in 1 minute"
                            ),
                          ],
                        });
                        await delay(30000);
                        await ticketMessage.edit({
                          embeds: [
                            noSelectEmbed.setDescription(
                              "You didn't write anything.\nTicket creation has been canceled and this channel will be deleted in 30 seconds"
                            ),
                          ],
                        });
                      });
                  })
                  .catch((err) => errorHandler(err, "editing ticket message"));
              })
              .catch(async () => {
                await ticketMessage.edit({
                  embeds: [noSelectEmbed],
                });
                await delay(30000);
                await ticketMessage.edit({
                  embeds: [
                    noSelectEmbed.setDescription(
                      "You didn't select anything.\nTicket creation was canceled and this channel will be deleted in 30 seconds."
                    ),
                  ],
                });
                await delay(30000);
                await ticketChannel.delete();
              });
          });
      })
      .catch((err) => errorHandler(err, "creating an application channel"));
  } catch (err) {
    errorHandler("applicationTicketsHandle module", err);
  }
};