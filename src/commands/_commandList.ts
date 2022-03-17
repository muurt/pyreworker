import { commandInt } from "../interfaces/commandInt";
import { editbio } from "./editbio";
import { help } from "./help";
import { bio } from "./bio";
import { viewbio } from "./viewbio";

export const commandList: commandInt[] = [editbio, bio, help, viewbio];
