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
import { getRefData } from "./getRefData";
import { updateRefData } from "./updateRefData";
import { Prisma } from "@prisma/client";

export const orderTicketsNotify = async (
  interaction: ButtonInteraction
): Promise<void> => {
  const { user } = interaction;
  await interaction.deferReply({
    ephemeral: true,
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

export const orderTicketsClaim = async (
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
    .setDescription("You've successfully claimed the order!")
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
      `A commission manager has claimed your order and is ready to assist you!`
    )
    .setColor(colors.white)
    .addFields({
      name: "Commission Manager",
      value: `<@${interaction.user.id}>`,
    })
    .setFooter({
      text: "© Pyreworks",
      iconURL: interaction.client.user?.displayAvatarURL(),
    });
  if (!ticketID) {
    return;
  }

  const ticketChannel = interaction.client.channels.cache.get(ticketID);
  const ticketsChannel =
    interaction.client.channels.cache.get("840145878610083881");
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
        claimedEmbed.addFields({
          name: "Ticket channel",
          value: `<#${ticketChannel.id}>`,
        }),
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

export const orderTicketsHandle = async (
  interaction: ButtonInteraction
): Promise<void> => {
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
      .setDescription("What would you like to order?")
      .setFooter({
        text: "© Pyreworks",
        iconURL: interaction.client.user?.displayAvatarURL(),
      });
    const typeSelectMenu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("order-type")
        .setPlaceholder("Select category of your order.")
        .addOptions([
          {
            label: "Prebuilts",
            description: "Order from our Prebuilt catalog.",
            value: "prebuilt-bot-order",
          },
          {
            label: "Custom",
            description: "Order a custom discord bot.",
            value: "custom-bot-order",
          },
        ])
    );

    if (!confirmation) {
      return;
    }

    await interaction.guild?.channels
      .create(
        `odr-${interaction.user.username.substring(0, 3)}${Math.floor(
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
            let ticketDescription: Message<boolean> | undefined | string;
            const orderChannel =
              interaction.client.channels.cache.get("840145878610083881");
            if (!orderChannel || orderChannel.type !== "GUILD_TEXT") {
              return;
            }
            const postponedEmbed = new MessageEmbed()
              .setTitle("WARN!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(colors.gray)
              .setDescription(
                "Please note that custom orders are currently postponed, this ticket will go on as usual but this order will be on hold."
              )
              .setFooter({
                text: "© Pyreworks",
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
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
                "Please write a brief description about your requirements and budget."
              )
              .setFooter({
                text: "© Pyreworks",
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const prebuiltTypeEmbed = new MessageEmbed()
              .setTitle("QUESTION!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(colors.white)
              .setDescription("What type of prebuilt do you need?")
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
                "You've successfully finished setting up your order.\nYour ticket has been sent to our staff and will look into it as soon as possible."
              )
              .setFooter({
                text: "© Pyreworks",
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const orderEmbed = new MessageEmbed()
              .setTitle("NEW TICKET!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(colors.white)
              .setDescription(`<@${user.id}> has ordered.`)
              .setFooter({
                text: `© Pyreworks | ${ticketChannel.id}`,
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const codeEmbed = new MessageEmbed()
              .setTitle("QUESTION!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(colors.white)
              .setDescription(
                `Do you have any discount/partner code you want to use?`
              )
              .setFooter({
                text: `© Pyreworks | ${ticketChannel.id}`,
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const codeInputEmbed = new MessageEmbed()
              .setTitle("QUESTION!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(colors.white)
              .setDescription(`Please write the code.`)
              .setFooter({
                text: `© Pyreworks | ${ticketChannel.id}`,
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const codeTrueEmbed = new MessageEmbed()
              .setTitle("SUCCESS!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(colors.orange)
              .setDescription(`The code has been applied.`)
              .setFooter({
                text: `© Pyreworks | ${ticketChannel.id}`,
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const codeFalseEmbed = new MessageEmbed()
              .setTitle("ERROR!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(colors.gray)
              .setDescription(`That code doesn't exist in the database, sorry.`)
              .setFooter({
                text: `© Pyreworks | ${ticketChannel.id}`,
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            let discounted = 0;
            let discountCode: string;
            let targetRefData: Prisma.ReferralWhereInput | undefined;
            const codeButtons = new MessageActionRow().addComponents(
              new MessageButton()
                .setCustomId("discount-code-yes")
                .setLabel("Yes")
                .setStyle("SUCCESS"),
              new MessageButton()
                .setCustomId("discount-code-no")
                .setLabel("No")
                .setStyle("DANGER")
            );
            const claimButtons = new MessageActionRow().addComponents(
              new MessageButton()
                .setCustomId("order-ticket-claim")
                .setLabel("Claim")
                .setStyle("SUCCESS")
                .setEmoji("967707003705237524"),
              new MessageButton()
                .setCustomId("order-ticket-notifym")
                .setLabel("Notify Management")
                .setStyle("DANGER")
                .setEmoji("968144163986104341")
            );
            const prebuiltSelectMenu = new MessageActionRow().addComponents(
              new MessageSelectMenu()
                .setCustomId("prebuilt-type")
                .setPlaceholder("Select the type of the prebuilt.")
                .addOptions([
                  {
                    label: "All purpose",
                    description:
                      "An all purpose discord bot, featuring moderation - economy and much more!",
                    value: "all-purpose",
                  },
                  {
                    label: "Music",
                    description:
                      "A music bot, with luyrics - bass booster and slash commands!",
                    value: "music",
                  },
                  {
                    label: "Suggestions",
                    description: "A suggestions bot with many great features!",
                    value: "suggestions",
                  },
                  {
                    label: "Reactroles",
                    description:
                      "A high performance reactroles bot with many features and modes!",
                    value: "reactroles",
                  },
                  {
                    label: "Tickets",
                    description:
                      "A ticket bot with high performance, transcripts and huge customizability!",
                    value: "tickets",
                  },
                ])
            );

            const collectorFilter = (i: SelectMenuInteraction) => {
              i.deferUpdate();
              return i.user.id === user.id && i.customId === "order-type";
            };

            m.channel
              .awaitMessageComponent({
                componentType: "SELECT_MENU",
                filter: collectorFilter,
                time: 30000,
              })
              // There used to be an "i" here in the async ()... idk what that "i" is but prettier and ts says its useless and it needs to go.
              .then(async (i) => {
                ticketCategory = i.values[0];
                const codeButtonFilter = (i: ButtonInteraction) => {
                  i.deferUpdate();
                  return (
                    (i.user.id === user.id &&
                      i.customId === "discount-code-yes") ||
                    (i.user.id === user.id && i.customId === "discount-code-no")
                  );
                };
                await ticketMessage
                  .edit({
                    embeds: [codeEmbed],
                    components: [codeButtons],
                  })
                  .then(async (m) => {
                    await m.channel
                      .awaitMessageComponent({
                        componentType: "BUTTON",
                        filter: codeButtonFilter,
                        time: 30000,
                      })
                      .then(async (i) => {
                        let discount;
                        switch (i.customId) {
                          case "discount-code-yes":
                            discount = true;
                            break;
                          default:
                            break;
                        }
                        if (!discount) {
                          return;
                        }
                        await ticketMessage
                          .edit({
                            embeds: [codeInputEmbed],
                            components: [],
                          })
                          .then(async () => {
                            const codeFilter = (message: Message) => {
                              return message.author.id === user.id;
                            };
                            await ticketMessage.channel
                              .awaitMessages({
                                filter: codeFilter,
                                max: 1,
                                time: 600000,
                                errors: ["time"],
                              })
                              .then(async (m) => {
                                if (!m) return;
                                const code = m
                                  .first()
                                  ?.toString()
                                  .toLowerCase();
                                if (!code) return;
                                await m.first()?.delete();
                                targetRefData = await getRefData(code);
                                if (!targetRefData) {
                                  await ticketMessage.edit({
                                    embeds: [codeFalseEmbed],
                                    components: [],
                                  });
                                  await delay(5000);
                                  return;
                                }
                                discounted = Number(targetRefData.discount);
                                discountCode = code;
                                await ticketMessage.edit({
                                  embeds: [codeTrueEmbed],
                                  components: [],
                                });
                                await delay(5000);
                              })
                              .catch(async () => {
                                await ticketMessage.edit({
                                  embeds: [
                                    noSelectEmbed.setDescription(
                                      "You didn't write anything.\nTicket creation has been canceled and this channel will be deleted in 1 minute"
                                    ),
                                  ],
                                  components: [],
                                });
                                await delay(30000);
                                await ticketMessage.edit({
                                  embeds: [
                                    noSelectEmbed.setDescription(
                                      "You didn't write anything.\nTicket creation has been canceled and this channel will be deleted in 30 seconds"
                                    ),
                                  ],
                                  components: [],
                                });
                              });
                          });
                      })
                      .catch(async () => {
                        await ticketMessage.edit({
                          embeds: [
                            noSelectEmbed.setDescription(
                              "You didn't write anything.\nTicket creation has been canceled and this channel will be deleted in 1 minute"
                            ),
                          ],
                          components: [],
                        });
                        await delay(30000);
                        await ticketMessage.edit({
                          embeds: [
                            noSelectEmbed.setDescription(
                              "You didn't write anything.\nTicket creation has been canceled and this channel will be deleted in 30 seconds"
                            ),
                          ],
                          components: [],
                        });
                      });
                  });

                if (i.values[0] === "custom-bot-order") {
                  if (discounted > 0 && targetRefData) {
                    updateRefData(discountCode, Number(targetRefData.tab));
                  }
                  await ticketMessage
                    .edit({
                      embeds: [postponedEmbed],
                      components: [],
                    })
                    .then(async () => {
                      await delay(10000);
                    });
                  await ticketMessage
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
                                finishedEmbed.addFields(
                                  { name: "Category", value: ticketCategory },
                                  {
                                    name: "Description",
                                    value: ticketDescription
                                      ? ticketDescription.toString()
                                      : "No description provided.",
                                  },
                                  {
                                    name: "Discount",
                                    value:
                                      discounted > 0
                                        ? `${discounted.toString()} | ${discountCode}`
                                        : "No discount.",
                                  }
                                ),
                              ],
                            })
                            .then(
                              async () =>
                                await orderChannel.send({
                                  embeds: [
                                    orderEmbed.addFields(
                                      {
                                        name: "Category",
                                        value: ticketCategory,
                                      },
                                      {
                                        name: "Description",
                                        value: ticketDescription
                                          ? ticketDescription.toString()
                                          : "No description provided",
                                      },
                                      {
                                        name: "Discount",
                                        value:
                                          discounted > 0
                                            ? `${discounted.toString()} | ${discountCode}`
                                            : "No discount.",
                                      }
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
                            components: [],
                          });
                          await delay(30000);
                          await ticketMessage.edit({
                            embeds: [
                              noSelectEmbed.setDescription(
                                "You didn't write anything.\nTicket creation has been canceled and this channel will be deleted in 30 seconds"
                              ),
                            ],
                            components: [],
                          });
                        });
                    })
                    .catch((err) =>
                      errorHandler(err, "editing ticket message")
                    );
                  return;
                }
                ticketMessage
                  .edit({
                    embeds: [prebuiltTypeEmbed],
                    components: [prebuiltSelectMenu],
                  })
                  .then(() => {
                    const collectorFilter = (i: SelectMenuInteraction) => {
                      i.deferUpdate();
                      return (
                        i.user.id === user.id && i.customId === "prebuilt-type"
                      );
                    };

                    m.channel
                      .awaitMessageComponent({
                        componentType: "SELECT_MENU",
                        filter: collectorFilter,
                        time: 30000,
                      })
                      .then(async (des) => {
                        ticketDescription = des.values[0];
                        if (discounted > 0 && targetRefData) {
                          const round = (num: number): number => {
                            return Math.round(num * 100) / 100;
                          };
                          const calculateDiscount = async (
                            price: number
                          ): Promise<boolean> => {
                            const discount = round((discounted / 100) * price);
                            const valueAfterDiscount = round(price - discount);
                            discounted = valueAfterDiscount;
                            const addedValue = round(
                              (20 / 100) * valueAfterDiscount
                            );
                            try {
                              await updateRefData(
                                discountCode,
                                Number(targetRefData?.tab) + addedValue
                              );
                            } catch {
                              return false;
                            }
                            console.log(
                              `discount: ${discount}\nvalafterdisc: ${valueAfterDiscount}\ndiscounted: ${discounted}\naddedval: ${addedValue}`
                            );
                            return true;
                          };
                          switch (des.values[0]) {
                            case "music": // 7.99
                              await calculateDiscount(7.99);
                              break;
                            case "all-purpose": // 9.99
                              await calculateDiscount(9.99);
                              break;
                            case "suggestions": // 3.69
                              await calculateDiscount(3.69);
                              break;
                            case "tickets": // 3.99
                              await calculateDiscount(3.99);
                              break;
                            case "reactroles": // 4.69
                              await calculateDiscount(4.69);
                              break;
                            default:
                              break;
                          }
                        }
                        await ticketMessage
                          .edit({
                            embeds: [
                              finishedEmbed.addFields(
                                { name: "Category", value: ticketCategory },
                                {
                                  name: "Prebuilt type",
                                  value: ticketDescription
                                    ? ticketDescription.toString()
                                    : "No description provided.",
                                },
                                {
                                  name: "Discount",
                                  value:
                                    discounted > 0
                                      ? `${discounted.toString()} (**Price after**) | ${discountCode}`
                                      : "No discount.",
                                }
                              ),
                            ],
                            components: [],
                          })
                          .then(
                            async () =>
                              await orderChannel.send({
                                embeds: [
                                  orderEmbed.addFields(
                                    { name: "Category", value: ticketCategory },
                                    {
                                      name: "Prebuilt type",
                                      value: ticketDescription
                                        ? ticketDescription.toString()
                                        : "No description provided",
                                    },
                                    {
                                      name: "Discount",
                                      value:
                                        discounted > 0
                                          ? `${discounted.toString()} (**Price after**) | ${discountCode}`
                                          : "No discount.",
                                    }
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
                          components: [],
                        });
                        await delay(30000);
                        await ticketMessage.edit({
                          embeds: [
                            noSelectEmbed.setDescription(
                              "You didn't write anything.\nTicket creation has been canceled and this channel will be deleted in 30 seconds"
                            ),
                          ],
                          components: [],
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
                  components: [],
                });
                await delay(30000);
                await ticketChannel.delete();
              });
          });
      })
      .catch((err) => errorHandler(err, "creating an order channel"));
  } catch (err) {
    errorHandler("orderTicketsHandle module", err);
  }
};
