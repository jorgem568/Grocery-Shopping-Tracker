const {createLogger, transports, format} = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

const logger = createLogger({
    level: "info",
    format: combine(
    timestamp(),
    prettyPrint()
    ),
    transports: [
        new (transports.Console)(),
        new (transports.File)({filename: 'api.log'})
    ]
});

module.exports = {
    logger
};