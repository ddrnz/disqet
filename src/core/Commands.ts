import path from "path";
import fs from "fs/promises";
import { Command } from "../types";

export async function loadCommands(commandsPath: string): Promise<Command[]> {
  const files = await fs.readdir(commandsPath);
  const commands: Command[] = [];

  for (const file of files) {
    const filePath = path.join(commandsPath, file);
    const mod = await import(filePath);
    const command: Command = mod.default || mod;
    commands.push(command);
  }

  return commands;
}
