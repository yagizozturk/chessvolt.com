import { context, trace } from "@opentelemetry/api";
import pino, { type TransportTargetOptions } from "pino";

/* 
logger sadece sunucuda değil, doğrudan tarayıcı (client) tarafında da aktif olarak kullanılıyor.
Bu yüzden logger dosyasındaki server-only kısıtlaması uygulamayı çökertiyor; 
çünkü tarayıcı, bazı yerlerde client üzerinden logger'a ulaşmaya çalışıyor.
Bu sebeple logger.ts dosyasındaki "server-only" importunu kaldırdım. 
Yani logger artık hem sunucu hem de tarayıcı tarafında kullanılabilir.
import "server-only";
*/

const isProduction = process.env.NODE_ENV === "production";

export const logger = pino({
  base: {
    service: "chessvolt",
    environment: process.env.NODE_ENV ?? "development",
    version: process.env.APP_VERSION ?? "unknown",
  },
  // Add trace and request context to logs
  mixin() {
    const spanContext = trace.getSpan(context.active())?.spanContext();
    
    return {
      // Include trace and span IDs for correlation with distributed tracing
      trace_id: spanContext?.traceId,
      span_id: spanContext?.spanId,
      // Include trace flags to indicate sampling and other trace properties
      trace_flags: spanContext?.traceFlags,
    };
  },
  // Filter out sensitive information from logs
  redact: [
    "req.headers.authorization", 
    "req.headers.cookie", 
    "password", 
    "accessToken", 
    "refreshToken"
  ],
  transport: {
    targets: [
        // Log to Axiom in production if the token is provided
        ...(isProduction && process.env.LOG_MANAGER_AXIOM_TOKEN 
          ? [
                {
                target: "@axiomhq/pino",
                options: {
                  token: process.env.LOG_MANAGER_AXIOM_TOKEN,
                  dataset: process.env.LOG_MANAGER_AXIOM_DATASET
                },
                level: isProduction ? process.env.LOG_LEVEL ?? "info" : process.env.LOG_LEVEL_DEV ?? "debug",
              },
            ]
          : []),
        ...(!isProduction
          ? [
              // Log to console in development for better readability
              {
                target: "pino-pretty",
                options: { colorize: true },
                level: process.env.LOG_LEVEL_DEV ?? "debug",
              },
              // Log to Axiom in development if the token is provided
              ...(process.env.LOG_MANAGER_AXIOM_TOKEN_DEV 
                ? [
                      {
                      target: "@axiomhq/pino",
                      options: {
                        token: process.env.LOG_MANAGER_AXIOM_TOKEN_DEV,
                        dataset: process.env.LOG_MANAGER_AXIOM_DATASET_DEV
                      },
                      level: isProduction ? process.env.LOG_LEVEL ?? "info" : process.env.LOG_LEVEL_DEV ?? "debug",
                    },
                  ]
                : []),
            ]
          : []),
    ],
    // Add pino-pretty in development for better readability
  },
});