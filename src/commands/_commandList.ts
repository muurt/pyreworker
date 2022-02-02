import { commandInt } from "../interfaces/commandInt";
import { editbio } from "./editbio";
import { help } from "./help";
import { bio } from "./bio";
import { viewbio } from "./viewbio";

/*
 * ➞ _CommandList.ts
 * Exports the list of command modules
 */

export const commandList: commandInt[] = [editbio, bio, help, viewbio];
