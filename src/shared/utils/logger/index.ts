import { type LoggerInterface } from "../../types/logger";

export let logger: LoggerInterface;

if (typeof window === "undefined") {
  logger = require("./server").logger;
} else {
  logger = require("./client").logger;
}

export const log = (msg: string) => logger.info(msg);
