import { readdir } from "fs/promises";
import path from "path";

export async function loadFiles<T>(directory: string): Promise<T[]> {
  const files = await readdir(directory);
  const modules: T[] = [];

  for (const file of files) {
    if (!file.endsWith(".ts") && !file.endsWith(".js")) continue;
    const { default: mod } = await import(path.resolve(directory, file));
    modules.push(mod);
  }

  return modules;
}
