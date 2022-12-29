import { createLogger, format, transports, config } from "winston";
const { combine, timestamp, colorize, printf } = format;

const logFormat = combine(
  timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  colorize(),
  printf((info) => `${info.level} | ${[info.timestamp]} > ${info.message}`)
);

const consoleTransport = new transports.Console();

export const logHandler = createLogger({
  levels: config.npm.levels,
  level: "silly",
  transports: [consoleTransport],
  format: logFormat,
  exitOnError: false,
});
