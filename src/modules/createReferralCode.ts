/* eslint-disable @typescript-eslint/no-unused-vars */
import { errorHandler } from "../utils/errorHandler";
import { prismaClient } from "../database/database";
import { Prisma } from "@prisma/client";

/**
 * Creates new bio data for a given Discord user.
 * @param {string} id - The Discord user's ID.
 * @param {string} description - The description for the user's bio.
 * @param {string} code - The referral code for the user.
 * @param {string} services - The services the user provides.
 * @returns {Promise<Prisma.BioCreateInput | undefined>} - The new bio data.
 */

// work in progress.
