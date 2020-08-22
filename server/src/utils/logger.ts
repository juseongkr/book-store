import winston, { createLogger, format, transports } from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import appRoot from 'app-root-path';
import path from 'path';

const logPath: string = path.join(appRoot.path, '/logs');
const logForm: winston.Logform.Format = format.printf(({ timestamp, level, message }): string => {
    return `${timestamp} ${level}: ${message}`;
});

const logger: winston.Logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.prettyPrint(),
        logForm,
    ),
    defaultMeta: {
        service: 'user-service',
    },
    transports: [
        new winstonDaily({
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            dirname: logPath,
            filename: `%DATE%.info.log`,
            maxSize: '20m',
            maxFiles: '30d',
            zippedArchive: true,
        }),
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logPath + '/error',
            filename: `%DATE%.error.log`,
            maxSize: '20m',
            maxFiles: '30d',
            zippedArchive: true,
        }),
    ],
});

logger.add(new transports.Console({
    format: format.combine(format.simple(), format.colorize()),
}));

export default logger;