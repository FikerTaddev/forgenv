import chalk from "chalk";

export const log = {
  success(msg: string) {
    console.log(`${chalk.green("✔")} ${chalk.greenBright(msg)}`);
  },

  error(title: string, msg: string) {
    console.log(`${chalk.red("✖")} ${chalk.redBright(title)}`);
    console.log(`${chalk.gray(msg)}`);
  },

  info(msg: string) {
    console.log(`${chalk.cyanBright("ℹ")} ${chalk.blue(msg)}`);
  },
  warn(msg: string) {
    console.log(`${chalk.yellow("!")} ${msg}`);
  },
};
