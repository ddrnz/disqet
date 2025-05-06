import {
  ChatInputCommandInteraction,
  Client,
  ClientOptions,
  Collection,
  GatewayIntentBits,
  Interaction,
} from "discord.js";
import path from "path";
import { Command, Event } from "../types";
import { loadCommands } from "./Commands";
import { loadEvents, registerEvents } from "./Events";
import { registerApplicationCommands } from "./Registry";
import { Logger } from "../utils/Logger";

interface DisqetOptions extends ClientOptions {
  silent?: boolean;
  handlers: {
    commandsPath: string;
    eventsPath: string;
  };
}

export class DisqetClient extends Client {
  public commands = new Collection<string, Command>();
  public events = new Collection<string, Event>();
  private commandsPath: string;
  private eventsPath: string;

  constructor(options: DisqetOptions) {
    super({
      ...options,
      intents: options.intents,
    });

    if (options.silent) {
      Logger.setSilent(true);
    }    

    this.commandsPath = path.resolve(options.handlers.commandsPath);
    this.eventsPath = path.resolve(options.handlers.eventsPath);
  }

  public async login(token: string): Promise<any> {
    throw new Error("Please use `client.init()` instead of `client.login()`.");
  }

  public async init(token: string) {
    await this.loadAll();
    await super.login(token);
  }

  private async loadAll() {
    const commands = await loadCommands(this.commandsPath);
    const events = await loadEvents(this.eventsPath);

    commands.forEach((cmd) => this.commands.set(cmd.data.name, cmd));
    events.forEach((evt) => this.events.set(evt.name, evt));

    if (!this.events.has("ready")) {
      this.once("ready", async () => {
        Logger.success(`Logged in as ${this.user?.tag}`);
        await registerApplicationCommands(this);
      });
    }

    registerEvents(this, events);

    Logger.success(
      `Loaded ${commands.length} command(s) from ${this.commandsPath}`
    );
    Logger.success(`Loaded ${events.length} event(s) from ${this.eventsPath}`);

    this.on("interactionCreate", async (interaction: Interaction) => {
      if (interaction.isCommand()) {
        const command = this.commands.get(interaction.commandName);
    
        if (!command) return;
    
        if (command.guards) {
          for (const guard of command.guards) {
            const { passed, message } = await guard(interaction);
    
            if (!passed) {
              const replyMessage = message || "You do not have permission to use this command.";
              return interaction.reply({
                content: replyMessage,
                ephemeral: true,
              });
            }
          }
        }
    
        try {
          await command.execute(interaction as ChatInputCommandInteraction);
        } catch (error) {
          Logger.error(`Error while executing command: ${(error as Error).message}`);
        }
      }
    });    

    this.once("ready", async () => {
      await registerApplicationCommands(this);
    });
  }
}
