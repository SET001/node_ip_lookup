import { createLogger, transports, format, Logger } from 'winston';
import { AsyncLocalStorage } from 'node:async_hooks';

export const loggerStorage = new AsyncLocalStorage<Logger>();

const { align, colorize, printf, errors, combine, timestamp } = format;
export const logger = createLogger({
	level: process.env.LOG_LEVEL || "info",
	format: combine(
		colorize({ all: true }),
		timestamp({
			format: 'YYYY-MM-DD hh:mm:ss.SSS A',
		}),
		align(),
		printf((info) => `[${info.timestamp}] ${info.requestId || ""} ${info.span || ""} ${info.level}: ${info.message}`),
		errors({ stack: true }),
	),
	transports: [new transports.Console()]
});


export function getLogger(span?: string) {
	const log = loggerStorage.getStore() || logger;
	return span ? log.child({ span }) : log;
}
