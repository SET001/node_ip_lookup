import express from "express";
import { LookupController } from "./controller";
import { IpWhois } from "./ipwhois";
import { LookupCacheSQLite } from "./cachesqlite";

export async function getLookupRouter() {
	const cache = new LookupCacheSQLite();
	await cache.init();

	const controller = new LookupController(new IpWhois(), cache);

	const lookupRouter = express.Router();

	lookupRouter
		.route('/lookup/:ip')
		.get(controller.lookup.bind(controller))
		.delete(controller.remove.bind(controller));

	return lookupRouter;
}
