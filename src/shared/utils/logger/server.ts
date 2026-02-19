import type { LoggerInterface } from "../../types/logger";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const createServerLogger = (): LoggerInterface => {
  const config = { env: process.env.NODE_ENV || "development" };

  const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      let output = `${timestamp} [${level.toUpperCase()}]: `;
      output +=
        typeof message === "object"
          ? JSON.stringify(message, null, 2)
          : message;
      if (Object.keys(meta).length > 0) {
        output += " " + JSON.stringify(meta, null, 2);
      }
      return output;
    })
  );

  const winstonLogger = winston.createLogger({
    level: config.env === "development" ? "debug" : "info",
    format: logFormat,
    transports: [
      new winston.transports.Console(),
      new DailyRotateFile({
        dirname: "logs",
        filename: "app-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        maxSize: "10m",
        maxFiles: "14d",
        zippedArchive: true,
      }),
    ],
  });

  return {
    info: (msg: any) => winstonLogger.info(msg),
    debug: (msg: any) => winstonLogger.debug(msg),
    warn: (msg: any) => winstonLogger.warn(msg),
    error: (msg: any) => winstonLogger.error(msg),
  };
};

export const logger = createServerLogger();
