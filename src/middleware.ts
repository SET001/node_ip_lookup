import { v4 as uuidv4 } from 'uuid';
import { NextFunction, Request, Response } from "express";
import { loggerStorage, logger } from './logger';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
	loggerStorage.enterWith(logger.child({
		requestId: uuidv4()
	}));
	next();
}
