import chalk from "chalk";

const LOG_COLOR_MAP = {
  error: "color: #fff; background-color: #f00",
  info: "color: #fff; background-color: #00f",
  log: "color: #fff; background-color: #000",
  trace: "color: #000; background-color: #fff",
};

const CHALK_COLOR_MAP = {
  error: chalk.red,
  info: chalk.white,
  success: chalk.green,
};

const group = (
  title: string,
  options: {
    sub: {
      type: "error" | "info" | "log" | "trace";
      message: string | Error | unknown;
    }[];
  }
) => {
  const { sub = [] } = options ?? {};

  console.group(`%c${title}`, "color: #fff; background-color: #000");

  sub.forEach((item) => {
    const { type, message } = item;

    console[type](`%c${message}`, LOG_COLOR_MAP[type]);
  });

  console.groupEnd();
};

const log = (
  message: string = "",
  options?: {
    type: keyof typeof CHALK_COLOR_MAP;
  }
) => {
  const { type = "info" } = options ?? {};

  console.log(CHALK_COLOR_MAP[type](message));
};

export { log };
