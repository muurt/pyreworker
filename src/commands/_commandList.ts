import { commandInt } from "../interfaces/commandInt";
import { editbio } from "./editbio";
import { help } from "./help";
import { bio } from "./bio";
import { test } from "./test";
import { viewbio } from "./viewbio";

export const commandList: commandInt[] = [test, editbio, bio, help, viewbio];
