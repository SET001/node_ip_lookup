import { LookupCacheSQLiteConfig } from "./lookup/cachesqlite";

const { db_name, ttl, table_name } = new LookupCacheSQLiteConfig();
export const config = {
	port: isNaN(Number(process.env.PORT)) ? 3000 : parseInt(process.env.PORT!),
	db_name: process.env.DB || db_name,
	table_name: process.env.TABLE || table_name,
	ttl: isNaN(Number(process.env.TTL)) ? ttl : parseInt(process.env.TTL!)
}
