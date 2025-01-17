import { v4 as uuidv4 } from 'uuid';
import { NextFunction, Request, Response } from "express";
import { loggerStorage, logger } from './logger';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
	loggerStorage.enterWith(logger.child({
		requestId: uuidv4()
	}));
	next();
}

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
	if (error.message) {
		logger.error(`General error: ${error}`);
	}
	res
		.status(500)
		.send("Server error")
}

export function notFoundPage(_: Request, res: Response) { res.status(404).send("Page not found") }
