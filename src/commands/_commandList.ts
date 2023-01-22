import { commandInt } from "../interfaces/commandInt";
import { editbio } from "./bio/editbio";
import { help } from "./core/help";
import { createbio } from "./bio/createbio";
import { viewbio } from "./bio/viewbio";
import { ban } from "./moderation/ban";
import { unban } from "./moderation/unban";
import { kick } from "./moderation/kick";
import { timeout } from "./moderation/timeout";
import { ticketsetup } from "./tickets/ticketsetup";
import { createreferral } from "./referrals/createreferral";
import { deletereferral } from "./referrals/deletereferral";
import { viewreferral } from "./referrals/viewreferral";
export const commandList: commandInt[] = [
  ticketsetup,
  timeout,
  kick,
  unban,
  ban,
  editbio,
  createbio,
  help,
  viewbio,
  createreferral,
  deletereferral,
  viewreferral,
];
