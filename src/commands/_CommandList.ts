import { CommandInt } from "../interfaces/CommandInt";
import { editbio } from "./editbio";
import { help } from "./help";
import { bio } from "./bio";
import { viewbio } from "./viewbio";

export const CommandList: CommandInt[] = [editbio, bio, help, viewbio];
