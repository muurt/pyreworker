/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import {
  APIActionRowComponent,
  APIMessageActionRowComponent,
} from "discord-api-types/v9";
import {
  MessageActionRow,
  MessageActionRowComponent,
  MessageActionRowComponentResolvable,
  MessageButton,
  MessageEmbed,
  MessageSelectMenu,
  MessageSelectOptionData,
} from "discord.js";

export const sendModalEmbedEvent = async (client: any) => {
  client.on("interactionCreate", async (interaction: any) => {
    if (interaction.customId !== "menu-role-channel") {
      return;
    }

    if (!interaction.member.permissions.has("MANAGE_ROLES")) {
      return interaction.reply({
        content: `❌ - You do not have the \`MANAGE_ROLES\` permission.`,
        ephemeral: true,
      });
    }

    // Get all values from modal
    const channelNameOrId = interaction.fields
      .getTextInputValue("channel")
      .toLowerCase()
      .replace(" ", "-")
      .replace(/#/g, "");
    const title = interaction.fields.getTextInputValue("title");
    let description = interaction.fields.getTextInputValue("description");
    let color = interaction.fields.getTextInputValue("color");

    let roles:
      | { label: string; description: string | undefined; value: string }
      | MessageSelectOptionData[] = [];
    let roleList = interaction.message.embeds[0].fields[0].value;
    let channel: {
      send: (arg0: {
        embeds: MessageEmbed[];
        components: MessageActionRow<
          MessageActionRowComponent,
          MessageActionRowComponentResolvable,
          APIActionRowComponent<APIMessageActionRowComponent>
        >[];
      }) => Promise<unknown>;
      id: unknown;
    };

    if (!description) {
      description = `Select some roles to add them to your profile, and this could include perks or access to channels.`;
    }

    if (!color) {
      color = process.env.COLOR;
    }

    if (channelNameOrId !== "") {
      // Validating the channel provided

      channel = interaction.guild.channels.cache.find(
        (c: { name: never }) => c.name === channelNameOrId
      );

      if (!channel) {
        channel = interaction.guild.channels.cache.find(
          (c: { id: never }) => c.id === channelNameOrId
        );
      }

      if (!channel) {
        // No channal was Found
        return interaction.update({
          content: `❌ - I am unable to find a channel with the name or id of \`${channelNameOrId}\``,
          ephemeral: true,
        });
      }
    } else {
      channel = interaction.channel;
    }

    // Creating the options for the select menu
    for (const role of roleList.split(`\n`)) {
      const roleId = role.split(" - ")[0].replace(/[<@&>]/g, "");
      const roleDescription = role.split(" - ")[1];

      const r = interaction.guild.roles.cache.find(
        (_role: { id: never }) => _role.id === roleId
      );
      if (!r) {
        return;
      }

      if (roleDescription) {
        // Getting rid of the * * on either sides
        let RoleDisc = "";
        for (let i = 1; i < roleDescription.length - 1; i++) {
          RoleDisc += roleDescription[i];
        }

        roles.push({
          label: r.name,
          description: RoleDisc,
          value: r.id,
        });
      } else {
        roles.push({
          label: r.name,
          value: r.id,
          description: undefined,
        });
      }
    }

    // Embed and Select Menu
    const embed = new MessageEmbed()
      .setTitle(title ? title : "Self Assignable Roles")
      .setFooter({ text: "Pyreworks", iconURL: process.env.icon })
      .setDescription(description)
      .setColor(color);

    const menu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("select-menu-roles")
        .setMinValues(0)
        .setMaxValues(roles.length)
        .setPlaceholder(`Select some roles`)
        .setOptions(roles)
    );

    const buttons = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("display-roles")
        .setLabel("Display Roles")
        .setStyle("PRIMARY"),

      new MessageButton()
        .setCustomId("clear-roles")
        .setLabel("Clear Roles")
        .setStyle("DANGER")
    );

    let failedToSend = false;
    await channel
      .send({ embeds: [embed], components: [menu, buttons] })
      .catch(() => {
        failedToSend = true;
      });

    if (failedToSend) {
      return interaction.update({
        content: `❌ - Failed to send message, please check my permissions for <#${channel.id}>.`,
        embeds: [],
        components: [],
      });
    } else {
      interaction.update({
        content: `🎉 - Success! You have successfully created the Select Menu Roles, check it out in <#${channel.id}>`,
        embeds: [],
        components: [],
      });
    }

    setTimeout(() => {
      if (channel.id === interaction.channel.id) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        interaction.deleteReply().catch(() => {});
      }
    }, 10000);
  });
};
