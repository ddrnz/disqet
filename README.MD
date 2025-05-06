
# **Disqet - Discord Bot Framework**

`Disqet` is an intuitive library for building Discord bots with support for commands, events, guards, and a complete logging system. Easy to set up and ready to use!

## **Installation**

### **With npm**

```bash
npm install disqet
```

### **With yarn**

```bash
yarn add disqet
```

---

## **How to Use DisqetClient**

To use the `DisqetClient`, create an instance by passing the necessary configurations:

```typescript
import { GatewayIntentBits } from "discord.js";
import { DisqetClient } from "disqet";

const client = new DisqetClient({
  intents: [YOUR_DISCORD_INTENTS_HERE], // Example: [GatewayIntentBits.Guilds]
  handlers: {
    commandsPath: "PATH", // Example: "./commands"
    eventsPath: "PATH",   // Example: "./events"
  },
});

client.init("YOUR_BOT_TOKEN_HERE");  // Initialize the bot with the token
```

---

## **How to Create a Command Using Disqet**

Creating commands in `Disqet` is simple! Here's a basic `/ping` command that replies with "Pong!":

```typescript
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { NewCommand } from "disqet";

export default NewCommand({
  data: new SlashCommandBuilder().setName("ping").setDescription("Ping pong!"),
  execute: async (interaction) => {
    await interaction.reply("Pong!");  // Responds to the user
  },
});
```

---

## **How to Use Guards for Commands**

You can add **Guards** to protect or validate commands before they execute. For example, we can restrict a command to be used only in a specific channel:

```typescript
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { NewCommand } from "disqet";

export default NewCommand({
  data: new SlashCommandBuilder().setName("ping").setDescription("Ping pong!"),
  execute: async (interaction) => {
    await interaction.reply("Pong!");  // Responds to the user
  },
  guards: [
    async (interaction: CommandInteraction) => {
      const passed = interaction.channel?.id === "1234344354657568";  // Checks the channel

      if (!passed) {
        return {
          passed: false,
          message: "This command can only be used in the chat <#1234344354657568>.",  // Error message
        };
      }

      return { passed: true };  // If the condition passes
    },
  ],
});
```

---

## **How to Create an Event Using Disqet**

Events can be used to react to actions on Discord. Here's an example of the `messageCreate` event that responds to user commands:

```typescript
import { Message } from "discord.js";
import { NewEvent } from "disqet";

export default NewEvent({
  name: "messageCreate",  // Event name
  execute(...args) {
    const message = args[0] as Message;  // Accesses the received message

    if (message.author.bot) return;  // Ignores bot messages
    
    if (message.content === "!ping") {  // Checks if the message is "!ping"
      message.reply("Pong!");  // Responds with "Pong!"
    }
  },
});
```

---

## **Features**

- **Commands and Subcommands**: Create simple or complex commands, with or without subcommands.
- **Guards**: Add validations and restrictions to your commands to ensure they execute only when appropriate.
- **Events**: Listen to Discord events and execute code in response.
- **Logger**: Log messages, errors, and info in a clear and colorful way.

---

## **By ddnrz 🔨**
