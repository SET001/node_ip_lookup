import axios from "axios";
import { LookupDTO } from "./dto";
import { LookupService } from "./service";
import { getLogger } from "../logger";

export class IpWhois implements LookupService {
	async lookup(lookup_ip: string): Promise<LookupDTO | string> {
		const logger = getLogger('IpWhois');
		logger.debug(`looking up for ${lookup_ip}`);
		const start = Date.now()
		return await axios.get(`http://ipwho.is/${lookup_ip}`)
			.then(response => {
				const { data: { city, ip, country, region, success, message } } = response;
				if (!message && !success) {
					throw new Error("Undexpected response");
				}
				return success ? {
					ip, city, country, region
				} : message;
			})
			.catch((error: Error) => {
				logger.error(error)
				throw new Error();
			})
			.finally(() => {
				logger.debug(`done in ${(Date.now() - start) / 1000}sec.`);
			});
	}
}
