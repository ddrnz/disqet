import fs from "fs/promises";
import path from "path";
import { Client } from "discord.js";
import { Event } from "../types";

export async function loadEvents(eventsPath: string): Promise<Event[]> {
  const files = await fs.readdir(eventsPath);
  const events: Event[] = [];

  for (const file of files) {
    const filePath = path.join(eventsPath, file);
    const mod = await import(filePath);
    const event: Event = mod.default || mod;
    events.push(event);
  }

  return events;
}

export function registerEvents(client: Client, events: Event[]) {
  for (const event of events) {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
}
