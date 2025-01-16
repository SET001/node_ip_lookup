import { Request, Response } from "express";
import { CacheService, LookupService } from "./service";
import { LookupDTO } from "./dto";

class Lookuprequest {
	ip: string
}

export class LookupController {
	constructor(
		public lookupService: LookupService,
		public lookupCacheService: CacheService<string, LookupDTO>
	) { }

	async lookup(req: Request<Lookuprequest>, res: Response) {
		const ip = req.params.ip;

		const cache = await this.lookupCacheService.get(ip);
		if (cache === null) {
			const result = await this.lookupService.lookup(ip);
			if (typeof result === 'string') {
				console.log("error: ", result);
				res
					.status(400)
					.send(result)
			} else {
				this.lookupCacheService.add(result as LookupDTO);
				console.log("responding with new lookup result: ", result);
				res.json(result);
			}
		} else {
			console.log("responding with cached result: ", cache);
			res.json(cache);
		}
	}

	async remove(req: Request, res: Response) {
		const ip = req.params.ip;
		await this.lookupCacheService.remove(ip)
		res.send("ok");
	}
}


