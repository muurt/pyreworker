/* eslint-disable @typescript-eslint/no-unused-vars */
import { errorHandler } from "../utils/errorHandler";
import { prismaClient } from "../database/database";
import { Prisma } from "@prisma/client";

/**
 * Creates a referral code.
 * @param {string} code - The code to create.
 * @param {string} description - The description of the code.
 * @param {string} discordId - The Discord ID of the user creating the code.
 * @returns {Promise<Prisma.ReferralCodeCreateInput | undefined>} - The created code.
 */

// work in progress.
