import chalk from "chalk";

let silent = false;

const prefix = chalk.bold.blueBright("🔹 [DISQET]");

function log(msg: string) {
  if (!silent) console.log(`${prefix} ${msg}`);
}

function success(msg: string) {
  if (!silent) console.log(`${prefix} ${chalk.green("✅")} ${msg}`);
}

function error(msg: string) {
  if (!silent) console.error(`${prefix} ${chalk.red("❌")} ${msg}`);
}

function info(msg: string) {
  if (!silent) console.log(`${prefix} ${chalk.cyan("ℹ️")} ${msg}`);
}

function setSilent(state: boolean) {
  silent = state;
}

export const Logger = {
  log,
  success,
  error,
  info,
  setSilent,
};
