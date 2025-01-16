import express from "express";
import { LookupController } from "./controller";
import { IpWhois } from "./ipwhois";
import { LookupCacheSQLite } from "./cachesqlite";

const controller = new LookupController(new IpWhois(), new LookupCacheSQLite());

export const lookupRouter = express.Router();

lookupRouter
	.route('/lookup/:ip')
	.get(controller.lookup.bind(controller))
	.delete(controller.remove.bind(controller));
