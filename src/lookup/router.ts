import express from "express";
import { LookupController } from "./controller";
import { IpWhois } from "./ipwhois";
import { LookupCacheSQLite } from "./cachesqlite";
import { config } from "../config";

export async function getLookupRouter() {
	const { db_name, table_name, ttl } = config;
	const cache = new LookupCacheSQLite({
		db_name, table_name, ttl
	});
	await cache.init();

	const controller = new LookupController(new IpWhois(), cache);

	const lookupRouter = express.Router();

	lookupRouter
		.route('/lookup/:ip')
		.get(controller.lookup.bind(controller))
		.delete(controller.remove.bind(controller));

	return lookupRouter;
}
