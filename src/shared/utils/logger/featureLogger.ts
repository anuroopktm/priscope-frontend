import { logger } from "@/shared/utils/logger";
import type { LogContext } from "@/shared/types/logger";

type LogLevel = "info" | "debug" | "warn" | "error";

export function generateFeatureLogger(feature: string, route?: string) {
  const logWithLevel =
    (level: LogLevel) =>
    (
      msg: string,
      extra?: Partial<Omit<LogContext, "feature" | "route" | "msg">>
    ) => {
      const context: LogContext = {
        feature,
        route,
        msg,
        ...extra,
      };
      logger[level](context);
    };

  return {
    info: logWithLevel("info"),
    debug: logWithLevel("debug"),
    warn: logWithLevel("warn"),
    error: logWithLevel("error"),
  };
}
