const winston = require("winston");

const Log = winston.createLogger({
  level: "debug",
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

module.exports = Log;

