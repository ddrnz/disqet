import {
    REST,
    Routes,
    ApplicationCommandDataResolvable,
    Client,
  } from "discord.js";
  import { Command } from "../types";
  import { Logger } from "../utils/Logger";
  
  export async function registerApplicationCommands(
    client: Client & { commands: Map<string, Command> }
  ) {
    const rest = new REST({ version: "10" }).setToken(client.token!);
    const data: ApplicationCommandDataResolvable[] = [
      ...client.commands.values(),
    ].map((c) => c.data.toJSON());
  
    try {
      await rest.put(Routes.applicationCommands(client.user!.id), { body: data });
      Logger.success(`Successfully registered ${data.length} global application command(s).`);
    } catch (err: any) {
      Logger.error("Failed to register application commands.");
      Logger.error(err.message || err);
    }
  }
  