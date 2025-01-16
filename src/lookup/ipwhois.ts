import axios from "axios";
import { LookupDTO } from "./dto";
import { LookupService } from "./service";

export class IpWhois implements LookupService {
	async lookup(lookup_ip: string): Promise<LookupDTO | string> {
		console.log(`looking up for ${lookup_ip}`);
		const { data: { city, ip, country, region, success, message } } = await axios.get(`http://ipwho.is/${lookup_ip}`);
		return success ? {
			ip, city, country, region
		} : message;
	}
}
