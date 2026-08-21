import "server-only";

import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  base: {
    service: "chessvolt",
    environment: process.env.NODE_ENV,
  },
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "password",
    "accessToken",
    "refreshToken",
  ],
});
