import { LookupDTO } from "./dto";
import { CacheService } from "./service";
import { Database, Statement } from "sqlite3";

const TABLE_NAME = 'lookups';
const DB_NAME = ':memory:';
const TTL = 60;	//	in seconds

type LookupDB = LookupDTO & {
	created_at: number
}

export class LookupCacheSQLite implements CacheService<string, LookupDTO> {
	db: Database
	select: Statement
	insert: Statement
	delete: Statement

	constructor() {
		this.db = new Database(DB_NAME);
		this.db.run(`CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
			id INTEGER PRIMARY KEY,
			ip TEXT NOT NULL,
			country TEXT NOT NULL,
			region TEXT NOT NULL,
			city TEXT NOT NULL,
			created_at INTEGER NOT NULL
		)`, (err) => {
			if (err) {
				console.log({ err })
			} else {
				this.select = this.db.prepare(`SELECT ip, country, region, city, created_at FROM ${TABLE_NAME} WHERE ip = ?`);
				this.insert = this.db.prepare(`INSERT INTO ${TABLE_NAME}(ip, country, region, city, created_at) VALUES(?, ?, ?, ?, ?)`);
				this.delete = this.db.prepare(`DELETE FROM ${TABLE_NAME} WHERE ip = ?`);
			}
		});
	}

	add({ ip, city, region, country }: LookupDTO): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.insert.run([ip, city, region, country, Date.now()], (err) => {
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
		})
	}

	get(key: string): Promise<LookupDTO | null> {
		return new Promise((resolve, reject) => {
			this.select.get(key, async (err: Error, res: LookupDB) => {
				if (err) {
					reject(err)
				} else {
					if (res) {
						const { ip, country, region, city, created_at } = res;
						if ((Date.now() - created_at) / 1000 > TTL) {
							await this.remove(key);
							resolve(null);
						} else {
							resolve({ ip, country, region, city });
						}
					} else {
						resolve(null);
					}
				}
			});
		})
	}

	remove(key: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.delete.run(key, error => {
				if (error) {
					reject(error)
				} else {
					resolve()
				}
			})
		})
	}
}
