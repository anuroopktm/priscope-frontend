export interface LogContext {
  feature: string;
  route?: string;
  msg: string;
  [key: string]: any; // allow dynamic fields
}

export interface LoggerInterface {
  info: (msg: any) => void;
  debug: (msg: any) => void;
  warn: (msg: any) => void;
  error: (msg: any) => void;
}
