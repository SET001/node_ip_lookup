import express from "express";
import { getLookupRouter } from './lookup';
import { logger } from './logger'
import { errorHandler, notFoundPage, requestLogger } from "./middleware";
import { config } from './config';

(async () => {
	express()
		.use(requestLogger)
		.use(await getLookupRouter())
		.use(notFoundPage)
		.use(errorHandler)
		.listen(config.port, () => { logger.info("App is started", { config }) });
})().catch(() => {
	logger.error("Cannot start server");
})
