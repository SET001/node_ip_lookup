import express, { NextFunction, Request, Response } from "express";
import { getLookupRouter } from './lookup';
import { logger } from './logger'
import { requestLogger } from "./middleware";
import { config } from './config';

(async () => {
	express()
		.use(requestLogger)
		.use(await getLookupRouter())
		.use((_, res) => { res.status(404).send("Page not found") })
		.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
			if (error.message) {
				logger.error(`General error: ${error}`);
			}
			res
				.status(500)
				.send("Server error")
		})
		.listen(config.port, () => { logger.info("App is started", { config }) });
})().catch(() => {
	logger.error("Cannot start server");
})
