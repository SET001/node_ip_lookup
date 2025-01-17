import { Request, Response } from "express";
import { CacheService, LookupService } from "./service";
import { LookupDTO } from "./dto";
import { getLogger } from "../logger";

class LookupRequest {
	ip: string
}

export class LookupController {
	constructor(
		public lookupService: LookupService,
		public lookupCacheService: CacheService<string, LookupDTO>
	) { }

	async lookup(req: Request<LookupRequest>, res: Response) {
		const { params: { ip } } = req;
		const logger = getLogger();

		logger.log('info', 'lookup request', { ip });

		const cache = await this.lookupCacheService.get(ip);
		if (cache === null) {
			const result = await this.lookupService.lookup(ip);
			if (typeof result === 'string') {
				logger.log('info', `responding with error: ${result}`);
				res
					.status(400)
					.send(result)
			} else {
				this.lookupCacheService.add(result as LookupDTO);
				logger.log('info', 'responding with new lookup result', { result });
				res.json(result);
			}
		} else {
			logger.log('info', 'responding with cached result', { cache });
			res.json(cache);
		}
	}

	async remove(req: Request, res: Response) {
		const { ip } = req.params;
		getLogger().log('info', 'remove request', { ip });
		await this.lookupCacheService.remove(ip)
		res.send("ok");
	}
}


