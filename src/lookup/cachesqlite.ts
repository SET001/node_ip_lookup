import { Logger } from "winston";
import { getLogger, logger } from "../logger";
import { LookupDTO } from "./dto";
import { CacheService } from "./service";
import { Database, Statement } from "sqlite3";

type LookupDB = LookupDTO & {
	created_at: number
}

export class LookupCacheSQLiteConfig {
	table_name: string = "lookups"
	db_name: string = ":memory:"
	ttl: number = 60	//	in seconds
}

export class LookupCacheSQLite implements CacheService<string, LookupDTO> {
	db: Database
	select: Statement
	insert: Statement
	delete: Statement

	constructor(
		public config: LookupCacheSQLiteConfig
	) {
		this.db = new Database(this.config.db_name);
	}

	async init(): Promise<void> {
		const table_name = this.config.table_name;
		return new Promise((resolve, reject) => {
			this.db.run(`CREATE TABLE IF NOT EXISTS ${table_name}(
				id INTEGER PRIMARY KEY,
				ip TEXT NOT NULL,
				country TEXT NOT NULL,
				region TEXT NOT NULL,
				city TEXT NOT NULL,
				created_at INTEGER NOT NULL
			)`, (err) => {
				if (err) {
					this.getLogger().error(`failed to create table, ${err}`)
					reject();
				} else {
					this.select = this.db.prepare(`SELECT ip, country, region, city, created_at FROM ${table_name} WHERE ip = ?`);
					this.insert = this.db.prepare(`INSERT INTO ${table_name}(ip, country, region, city, created_at) VALUES(?, ?, ?, ?, ?)`);
					this.delete = this.db.prepare(`DELETE FROM ${table_name} WHERE ip = ?`);
					resolve();
				}
			});
		})
	}

	getLogger(): Logger {
		return getLogger('LookupCacheSQLite');
	}

	add({ ip, city, region, country }: LookupDTO): Promise<void> {
		const logger = this.getLogger();
		logger.debug(`adding value for key: ${ip}`);
		return new Promise<void>((resolve, reject) => {
			this.insert.run([ip, city, region, country, Date.now()], error => {
				if (error) {
					logger.error(error);
					reject()
				} else {
					resolve()
				}
			})
		})
	}

	get(key: string): Promise<LookupDTO | null> {
		const logger = this.getLogger();
		logger.debug(`searching for: ${key}`);
		return new Promise((resolve, reject) => {
			this.select.get(key, async (error: Error, res: LookupDB) => {
				if (error) {
					logger.error(error);
					reject()
				} else {
					if (res) {
						const { ip, country, region, city, created_at } = res;
						if ((Date.now() - created_at) / 1000 > this.config.ttl) {
							logger.debug(`key TLL run out`);
							await this.remove(key);
							resolve(null);
						} else {
							logger.debug(`key found`);
							resolve({ ip, country, region, city });
						}
					} else {
						logger.debug(`key is not found`);
						resolve(null);
					}
				}
			});
		})
	}

	remove(key: string): Promise<void> {
		this.getLogger().debug(`removing key ${key}`);
		return new Promise((resolve, reject) => {
			this.delete.run(key, error => {
				if (error) {
					logger.error(error);
					reject()
				} else {
					resolve()
				}
			})
		})
	}
}
