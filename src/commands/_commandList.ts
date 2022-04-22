import { commandInt } from "../interfaces/commandInt";
import { editbio } from "./bio/editbio";
import { help } from "./core/help";
import { bio } from "./bio/bio";
import { viewbio } from "./bio/viewbio";
import { ban } from "./moderation/ban";
import { unban } from "./moderation/unban";
import { kick } from "./moderation/kick";
import { timeout } from "./moderation/timeout";

export const commandList: commandInt[] = [
  timeout,
  kick,
  unban,
  ban,
  editbio,
  bio,
  help,
  viewbio,
];
