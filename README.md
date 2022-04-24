# PYREWORKER

The main bot for "**PYREWORKS**", this will include commission handling and moderation for the bot cluster.
This version is private, however; code snippets will be modified to be used in future commissions, this is only allowed for "**PYREWORKS**" employees.

# Dependencies

This bot uses **MongoDB** and **Prisma** for the database functions.  
**Prettier** and **ESLint** for linting functions.  
**Typescript** and **Node.js** for running functions.  
**Discord.js** for interacting with the Discord API.  
**Winston** for console logging.

# Running

NOTE: If you're on windows, change the "prebuild" script in package.json to

```
    "prebuild": "rmdir /s /q out",
```

To run this you need to rename "**sample.env**" to "**.env**" and add the corresponding tokens.
You need to have Node.js installed, and then you need to run in order;

```bash
# Installing the required dependencies
npm install
npm install --save-dev
# Updating the packages
npm update
npm update --save-dev
# Generating Prisma files
npx prisma generate # IMPORTANT: Make sure to have (Microsoft Visual C++ 2015 Redistributable) for this to work
# Linting the project (checks for linting issues)
npm run lint
# Building the project (changes TS to JS)
# IMPORTANT: Before running the build command make sure to run
mkdir out # This is so the windows commands work correctly
npm run build
# Starts the bot
npm run start
```

When you change the code you need to run `npm run build` for the changes to take effect.

When committing changes mention the simplified form of what you've done in the commit comment.

# Comments

To get a better view of comments, please use "**[Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)**".

# Links

Our official ➞ [Discord](https://discord.gg/RuzEMyjRuR)

Music Bot ➞ [PyreMusic](https://github.com/bigblackfootman/pyremusic)

Branding Archive ➞ [PyreBranding](https://github.com/bigblackfootman/pyreworks-branding)

**Pyreworks**
