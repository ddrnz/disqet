import { Event } from "../types";

export function NewEvent<T extends Event>(event: T): T {
  return event;
}
