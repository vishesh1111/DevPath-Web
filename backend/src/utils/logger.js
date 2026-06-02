const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
  defaultMeta: { service: "assistant-backend" },
  transports: [new transports.Console()],
});

const requestLoggerStream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

module.exports = logger;
module.exports.requestLoggerStream = requestLoggerStream;
